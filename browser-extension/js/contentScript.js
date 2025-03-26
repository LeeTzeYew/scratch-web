/**
 * Scratch编辑器操作记录器 - 内容脚本
 * 负责监听用户在Scratch编辑器中的各种交互操作
 */

// 初始化变量
let operations = [];
let isRecording = false;
let recordingStartTime = null;
let parentOrigin = '';

console.log('Scratch编辑器操作记录器已加载 - 版本1.2');

// 从URL获取参数
const urlParams = new URLSearchParams(window.location.search);
const isRecordMode = urlParams.get('mode') === 'record';
parentOrigin = urlParams.get('parent') || '*';

console.log('编辑器模式:', isRecordMode ? '录制模式' : '普通模式');
console.log('父窗口源:', parentOrigin);
console.log('当前URL:', window.location.href);

/**
 * 检查环境
 */
function checkEnvironment() {
  console.log('检查运行环境...');
  
  // 检查是否在Scratch编辑器页面
  const isScratchEditor = window.location.href.includes('scratch-editor') || 
                          window.location.href.includes('test-page.html');
  console.log('是否在Scratch编辑器页面:', isScratchEditor);
  
  // 检查Chrome API是否可用
  const isChromeAPIAvailable = typeof chrome !== 'undefined' && chrome.runtime && chrome.storage;
  console.log('Chrome API是否可用:', isChromeAPIAvailable ? '可用' : '不可用');
  
  // 检查DOM结构
  setTimeout(() => {
    // 检查积木面板
    const blocksFound = document.querySelectorAll('.blocklyBlock, [class*="block"]').length;
    console.log('找到积木元素数量:', blocksFound);
    
    // 检查绿旗按钮
    const flagButton = document.querySelector('.green-flag, [class*="green-flag"], [aria-label*="运行"]');
    console.log('绿旗按钮:', flagButton ? '已找到' : '未找到');
  }, 2000);
  
  return {
    isScratchEditor,
    isChromeAPIAvailable
  };
}

/**
 * 记录操作
 * @param {string} type 操作类型
 * @param {Object} data 操作数据
 */
function recordOperation(type, data = {}) {
  if (!isRecording) return;
  
  const timestamp = Math.floor((Date.now() - recordingStartTime) / 1000);
  
  const operation = {
    type,
    timestamp,
    ...data
  };
  
  console.log(`记录操作: ${type}`, operation);
  operations.push(operation);
  
  // 向父窗口发送操作信息
  sendMessageToParent({
    type: 'userAction',
    details: operation
  });
}

/**
 * 向父窗口发送消息
 * @param {Object} message 要发送的消息
 */
function sendMessageToParent(message) {
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(message, parentOrigin);
      console.log('向父窗口发送消息:', message);
    } catch (error) {
      console.error('发送消息到父窗口失败:', error);
    }
  }
}

/**
 * 保存操作到本地存储
 */
function saveOperationsToStorage() {
  try {
    if (operations.length === 0) {
      console.warn('没有录制到任何操作，不保存');
      return;
    }
    
    const recordingData = {
      operations: operations,
      recordedAt: new Date().toISOString(),
      duration: recordingStartTime ? Math.floor((Date.now() - recordingStartTime) / 1000) : 0
    };
    
    console.log('保存操作记录:', recordingData);
    
    // 尝试使用Chrome API保存
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ 
        'scratch_operations': recordingData
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Chrome存储失败:', chrome.runtime.lastError);
          // 回退到localStorage
          saveToLocalStorage(recordingData);
        } else {
          console.log('操作记录已保存到Chrome存储');
        }
      });
    } else {
      // 回退到localStorage
      saveToLocalStorage(recordingData);
    }
    
    // 向扩展发送消息
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: 'operationsRecorded',
          data: recordingData
        });
      }
    } catch (error) {
      console.error('向扩展发送消息失败:', error);
    }
  } catch (error) {
    console.error('保存录制数据失败:', error);
  }
}

/**
 * 保存到localStorage
 */
function saveToLocalStorage(data) {
  try {
    localStorage.setItem('scratch_operations', JSON.stringify(data));
    console.log('操作记录已保存到localStorage');
  } catch (error) {
    console.error('保存到localStorage失败:', error);
    // 最后的尝试：保存到window对象
    window.scratchOperationsData = data;
    console.log('操作记录已保存到window对象');
  }
}

/**
 * 初始化与父窗口的通信
 */
function initializeCommunication() {
  // 监听来自父窗口的消息
  window.addEventListener('message', (event) => {
    // 验证消息来源
    if (event.source !== window.parent) return;
    
    const message = event.data;
    console.log('收到父窗口消息:', message);
    
    // 处理初始化消息
    if (message.type === 'init') {
      if (message.enableTracking) {
        console.log('启用事件跟踪');
        setupEventListeners();
      }
      
      if (message.isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    }
    
    // 处理开始录制消息
    if (message.type === 'recordingStarted') {
      startRecording();
    }
    
    // 处理停止录制消息
    if (message.type === 'recordingStopped') {
      stopRecording();
    }
    
    // 处理测试消息
    if (message.type === 'test') {
      console.log('收到测试消息:', message.message);
      sendMessageToParent({
        type: 'testResponse',
        message: 'Hello from Scratch editor!'
      });
    }
  });
  
  // 监听来自扩展的消息
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('收到扩展消息:', message);
      
      if (message.type === 'startRecording') {
        startRecording();
        sendResponse({ success: true });
      }
      
      if (message.type === 'stopRecording') {
        stopRecording();
        sendResponse({ success: true });
      }
      
      if (message.type === 'getOperations') {
        sendResponse({ 
          operations: operations,
          isRecording: isRecording,
          duration: recordingStartTime ? Math.floor((Date.now() - recordingStartTime) / 1000) : 0
        });
      }
      
      // 保持消息通道开放
      return true;
    });
  }
  
  // 通知父窗口编辑器已就绪
  sendMessageToParent({
    type: 'ready'
  });
}

/**
 * 开始录制
 */
function startRecording() {
  console.log('开始录制操作');
  isRecording = true;
  recordingStartTime = Date.now();
  operations = [];
  
  sendMessageToParent({
    type: 'recordingStatus',
    isRecording: true
  });
  
  // 显示录制状态在页面上
  showRecordingStatus(true);
  
  // 记录开始录制事件
  recordOperation('recordStart', {
    url: window.location.href,
    timestamp: 0
  });
}

/**
 * 停止录制
 */
function stopRecording() {
  if (!isRecording) return;
  
  console.log('停止录制操作');
  
  // 记录停止录制事件
  recordOperation('recordStop', {
    duration: Math.floor((Date.now() - recordingStartTime) / 1000)
  });
  
  isRecording = false;
  
  sendMessageToParent({
    type: 'recordingStatus',
    isRecording: false
  });
  
  // 保存到存储
  saveOperationsToStorage();
  
  // 隐藏录制状态
  showRecordingStatus(false);
  
  console.log('录制结果概览:');
  console.log('- 总操作数:', operations.length);
  console.log('- 录制时长:', Math.floor((Date.now() - recordingStartTime) / 1000), '秒');
  console.log('- 操作类型统计:', getOperationStats());
}

/**
 * 获取操作统计信息
 */
function getOperationStats() {
  const stats = {};
  operations.forEach(op => {
    stats[op.type] = (stats[op.type] || 0) + 1;
  });
  return stats;
}

/**
 * 在页面上显示录制状态
 */
function showRecordingStatus(isActive) {
  // 移除已有的状态指示器
  const existingIndicator = document.getElementById('scratch-recording-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  if (isActive) {
    // 创建一个新的录制状态指示器
    const indicator = document.createElement('div');
    indicator.id = 'scratch-recording-indicator';
    indicator.style.position = 'fixed';
    indicator.style.top = '10px';
    indicator.style.right = '10px';
    indicator.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '5px';
    indicator.style.fontWeight = 'bold';
    indicator.style.zIndex = '9999';
    indicator.style.animation = 'pulse 1s infinite';
    indicator.textContent = '⚫ 录制中';
    
    // 添加闪烁动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(indicator);
    
    // 添加点击事件，单击指示器停止录制
    indicator.addEventListener('click', function() {
      stopRecording();
    });
  }
}

/**
 * 设置各种事件监听器
 */
function setupEventListeners() {
  // 立即尝试设置监听器，并持续检查
  setupListenersImmediate();
  
  // 等待Scratch编辑器完全加载
  const checkInterval = setInterval(() => {
    // 尝试查找编辑器中的典型元素
    const scratchBlocks = document.querySelectorAll('.blocklyBlock, [class*="block"], [data-id]');
    const workspace = document.querySelector('.blocklyWorkspace') || document.querySelector('[class*="workspace"]');
    
    if (scratchBlocks.length > 0 || workspace) {
      console.log('Scratch编辑器已加载，设置事件监听器');
      clearInterval(checkInterval);
      setupListenersImmediate();
    }
  }, 1000);
  
  // 最多检查30秒
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 30000);
}

/**
 * 立即设置事件监听器
 */
function setupListenersImmediate() {
  // 监听积木拖动
  document.removeEventListener('mousedown', handleMouseDown); // 避免重复添加
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousedown', handleMouseDown, true);
  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('mouseup', handleMouseUp, true);
  
  // 监听点击事件
  document.removeEventListener('click', handleClick);
  document.addEventListener('click', handleClick, true);
  
  // 监听键盘事件
  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown, true);
  
  // 监听输入事件
  document.removeEventListener('input', handleInput);
  document.addEventListener('input', handleInput, true);
  
  // 特定于Scratch编辑器的元素监听
  setupScratchSpecificListeners();
  
  console.log('所有事件监听器已设置');
}

// 拖动相关变量
let isDragging = false;
let dragStartElement = null;
let dragStartPosition = null;

/**
 * 处理鼠标按下事件
 */
function handleMouseDown(event) {
  if (!isRecording) return;

  const target = event.target;
  
  // 检查是否点击了Scratch积木
  if (isBlockElement(target)) {
    console.log('鼠标按下:', target.tagName, target.className);
    dragStartElement = target;
    dragStartPosition = { x: event.clientX, y: event.clientY };
    isDragging = true;
    
    const blockId = getBlockId(target);
    console.log('积木按下:', blockId);
    
    recordOperation('blockStart', {
      blockId: blockId,
      startPosition: { x: event.clientX, y: event.clientY }
    });
  }
}

/**
 * 处理鼠标移动事件
 */
function handleMouseMove(event) {
  if (isDragging && dragStartElement && isRecording) {
    // 这里我们不记录每一个移动事件，只关注开始和结束
    // 可以根据需要添加节流逻辑来减少记录频率
  }
}

/**
 * 处理鼠标释放事件
 */
function handleMouseUp(event) {
  if (!isRecording) return;

  if (isDragging && dragStartElement) {
    isDragging = false;
    
    const blockId = getBlockId(dragStartElement);
    console.log('积木释放:', blockId);
    
    recordOperation('blockMove', {
      blockId: blockId,
      startPosition: dragStartPosition,
      endPosition: { x: event.clientX, y: event.clientY }
    });
    
    dragStartElement = null;
    dragStartPosition = null;
  }
}

/**
 * 处理点击事件
 */
function handleClick(event) {
  if (!isRecording) return;

  const target = event.target;
  console.log('点击:', target.tagName, target.className);
  
  // 检查是否点击了运行按钮
  if (isRunButton(target)) {
    recordOperation('executeCode', {
      action: '运行程序'
    });
  }
  
  // 检查是否点击了停止按钮
  if (isStopButton(target)) {
    recordOperation('stopCode', {
      action: '停止程序'
    });
  }
  
  // 检查是否点击了积木
  if (isBlockElement(target)) {
    const blockId = getBlockId(target);
    
    recordOperation('clickBlock', {
      blockId: blockId,
      position: { x: event.clientX, y: event.clientY }
    });
  }
  
  // 检查是否点击了类别按钮
  if (isCategoryElement(target)) {
    const category = getCategoryName(target);
    
    recordOperation('selectCategory', {
      category: category
    });
  }
}

/**
 * 处理键盘事件
 */
function handleKeyDown(event) {
  if (!isRecording) return;

  // 记录一些常用的编辑器快捷键
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 'c' || event.keyCode === 67) {
      recordOperation('copy', {
        key: 'Ctrl+C'
      });
    } else if (event.key === 'v' || event.keyCode === 86) {
      recordOperation('paste', {
        key: 'Ctrl+V'
      });
    } else if (event.key === 'x' || event.keyCode === 88) {
      recordOperation('cut', {
        key: 'Ctrl+X'
      });
    } else if (event.key === 'z' || event.keyCode === 90) {
      recordOperation('undo', {
        key: 'Ctrl+Z'
      });
    } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey) || event.keyCode === 89) {
      recordOperation('redo', {
        key: event.shiftKey ? 'Ctrl+Shift+Z' : 'Ctrl+Y'
      });
    }
  }
}

/**
 * 处理输入事件
 */
function handleInput(event) {
  if (!isRecording) return;

  const target = event.target;
  
  // 检查是否在编辑积木参数
  if (isInputElement(target)) {
    const blockId = getBlockId(target);
    
    recordOperation('editBlockParam', {
      blockId: blockId,
      value: target.value || target.textContent
    });
  }
}

/**
 * 检查元素是否是积木
 */
function isBlockElement(element) {
  if (!element) return false;
  
  return element.classList && (
    element.classList.contains('blocklyBlock') || 
    element.closest('.blocklyBlock') || 
    element.closest('[data-id]') || 
    element.classList.contains('blocklyDraggable') || 
    element.closest('.blocklyDraggable') ||
    // Scratch 3.0特定选择器
    element.classList.contains('blocklyPath') ||
    element.closest('[data-block-type]') ||
    element.closest('[data-category]') ||
    element.closest('[class*="block_"]')
  );
}

/**
 * 检查元素是否是运行按钮
 */
function isRunButton(element) {
  if (!element) return false;
  
  return element.classList && (
    element.classList.contains('green-flag') || 
    element.matches('[class*="green-flag"]') || 
    element.matches('[aria-label*="运行"]') ||
    element.matches('[class*="green-flag"]') ||
    element.matches('[class*="start"]') ||
    (element.closest('button') && 
     (element.closest('button').matches('[aria-label*="运行"]') ||
      element.closest('button').matches('[class*="start"]')))
  );
}

/**
 * 检查元素是否是停止按钮
 */
function isStopButton(element) {
  if (!element) return false;
  
  return element.classList && (
    element.classList.contains('stop-all') || 
    element.matches('[class*="stop-all"]') || 
    element.matches('[aria-label*="停止"]') ||
    element.matches('[class*="stop"]') ||
    (element.closest('button') && 
     (element.closest('button').matches('[aria-label*="停止"]') ||
      element.closest('button').matches('[class*="stop"]')))
  );
}

/**
 * 检查元素是否是输入元素
 */
function isInputElement(element) {
  if (!element) return false;
  
  return element.classList && (
    element.closest('.blocklyEditableText') || 
    element.closest('input') || 
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.classList.contains('blocklyFlyoutLabelInput') ||
    element.classList.contains('blocklyHtmlInput') ||
    element.closest('[class*="input"]')
  );
}

/**
 * 检查元素是否是类别元素
 */
function isCategoryElement(element) {
  if (!element) return false;
  
  return element.classList && (
    element.closest('.scratchCategoryMenuItem') || 
    element.closest('[class*="category-"]') ||
    element.closest('[data-category]') ||
    element.hasAttribute('data-category') ||
    element.closest('[class*="category_"]')
  );
}

/**
 * 获取积木ID
 */
function getBlockId(element) {
  if (!element) return 'unknown-block';
  
  // 尝试不同的方式获取ID
  const idFromDataset = element.dataset?.id || 
                       element.closest('[data-id]')?.dataset?.id;
  
  const idFromAttribute = element.getAttribute('data-id') || 
                         element.closest('[data-id]')?.getAttribute('data-id');
  
  const idFromBlockType = element.getAttribute('data-block-type') || 
                         element.closest('[data-block-type]')?.getAttribute('data-block-type');
  
  // 通过class名称尝试提取ID
  let idFromClass = null;
  if (element.className && typeof element.className === 'string') {
    const blockClassMatch = element.className.match(/block_([a-zA-Z0-9]+)/);
    if (blockClassMatch) {
      idFromClass = blockClassMatch[1];
    }
  }
  
  return idFromDataset || idFromAttribute || idFromBlockType || idFromClass || ('block-' + Date.now());
}

/**
 * 获取类别名称
 */
function getCategoryName(element) {
  if (!element) return '未知类别';
  
  // 尝试不同的方式获取类别名称
  const nameFromText = element.textContent?.trim() || 
                      element.closest('.scratchCategoryMenuItem')?.textContent?.trim();
  
  const nameFromDataset = element.dataset?.category || 
                         element.closest('[data-category]')?.dataset?.category;
  
  const nameFromAttribute = element.getAttribute('data-category') || 
                           element.closest('[data-category]')?.getAttribute('data-category');
  
  return nameFromText || nameFromDataset || nameFromAttribute || '未知类别';
}

/**
 * 设置特定于Scratch编辑器的监听器
 */
function setupScratchSpecificListeners() {
  // 监听角色选择
  try {
    const spriteSelectors = document.querySelectorAll('.sprite-selector-item, [class*="sprite-selector"], [class*="sprite_"]');
    spriteSelectors.forEach(selector => {
      selector.addEventListener('click', function(event) {
        if (!isRecording) return;
        
        // 尝试获取角色名称
        const spriteName = 
          this.querySelector('.sprite-name')?.textContent || 
          this.querySelector('[class*="sprite-name"]')?.textContent ||
          this.getAttribute('data-id') ||
          this.getAttribute('aria-label') ||
          '未知角色';
          
        recordOperation('selectSprite', {
          sprite: spriteName
        });
      });
    });
    
    // 监听右键菜单
    document.addEventListener('contextmenu', function(event) {
      if (!isRecording) return;
      
      if (isBlockElement(event.target)) {
        const blockId = getBlockId(event.target);
        recordOperation('contextMenu', {
          blockId: blockId,
          position: { x: event.clientX, y: event.clientY }
        });
      }
    });
    
  } catch (error) {
    console.error('设置特定监听器失败:', error);
  }
}

// 启动检查
const env = checkEnvironment();

// 初始化功能 - 不判断是否在编辑器页面，始终尝试初始化
initializeCommunication();
setupEventListeners();

// 自动录制检查
if (isRecordMode) {
  setTimeout(() => {
    startRecording();
  }, 3000); // 给页面加载一些时间
}

// 导出一些函数以供测试
window.scratchRecorder = {
  startRecording,
  stopRecording,
  getOperations: () => operations,
  isRecording: () => isRecording,
  saveOperationsManually: () => {
    saveOperationsToStorage();
    return operations;
  },
  exportData: () => {
    const data = {
      operations: operations,
      recordedAt: new Date().toISOString(),
      duration: recordingStartTime ? Math.floor((Date.now() - recordingStartTime) / 1000) : 0
    };
    
    // 创建下载链接
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scratch-recording-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return data;
  },
  debugDOMElements: () => {
    // 辅助调试函数
    console.log('--- DOM结构调试信息 ---');
    console.log('绿旗按钮:', document.querySelectorAll('.green-flag, [class*="green-flag"], [aria-label*="运行"], [class*="start"]'));
    console.log('积木元素:', document.querySelectorAll('.blocklyBlock, [data-id], [data-block-type], [class*="block_"]'));
    console.log('类别元素:', document.querySelectorAll('.scratchCategoryMenuItem, [class*="category-"], [data-category], [class*="category_"]'));
    console.log('----------------------');
  }
}; 