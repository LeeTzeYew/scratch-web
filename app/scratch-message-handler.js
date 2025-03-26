/**
 * Scratch编辑器消息处理器
 * 
 * 这个文件需要嵌入到Scratch编辑器中，用于处理与父窗口的通信
 * 在实际部署时，需要将这个代码注入到Scratch编辑器的页面中
 */

// 存储操作记录
window.scratchOperations = [];
// 记录开始时间
let recordingStartTime = Date.now();
// 是否正在录制
let isRecording = false;

// 初始化Scratch操作监听
function initScratchListener() {
  console.log('初始化Scratch操作监听器');
  
  try {
    // 监听Blockly工作区变化
    // 注意：这里假设Scratch编辑器使用Blockly，需要根据实际情况调整
    if (window.Blockly && window.Blockly.getMainWorkspace()) {
      const workspace = window.Blockly.getMainWorkspace();
      
      workspace.addChangeListener((event) => {
        // 只有在录制模式下才记录操作
        if (!isRecording) return;
        
        // 记录积木移动操作
        if (event.type === Blockly.Events.MOVE) {
          const timestamp = (Date.now() - recordingStartTime) / 1000;
          const blockId = event.blockId;
          const block = workspace.getBlockById(blockId);
          
          if (block) {
            const position = block.getRelativeToSurfaceXY();
            
            // 向父窗口发送消息
            window.parent.postMessage({
              type: 'userAction',
              action: `移动积木 ${blockId} 到位置 (${position.x}, ${position.y})`,
              details: {
                type: 'move',
                blockId,
                position: {x: position.x, y: position.y},
                timestamp
              }
            }, '*');
            
            console.log(`记录了积木移动: ${blockId} 在 ${timestamp}秒`);
          }
        }
        
        // 记录其他类型的操作
        // 例如：创建积木、删除积木、变更属性等
      });
      
      console.log('Blockly工作区监听器设置成功');
    } else {
      console.warn('无法找到Blockly工作区，将使用DOM事件监听');
      setupDOMListeners();
    }
    
    // 通知父窗口编辑器已就绪
    window.parent.postMessage({
      type: 'ready'
    }, '*');
    
  } catch (error) {
    console.error('设置Scratch操作监听器失败:', error);
  }
}

// 当无法直接访问Blockly时使用DOM事件监听
function setupDOMListeners() {
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    if (!isRecording) return;
    
    mutations.forEach(mutation => {
      // 根据DOM变化判断用户操作类型
      // 这部分需要根据Scratch编辑器的具体DOM结构调整
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const timestamp = (Date.now() - recordingStartTime) / 1000;
        window.parent.postMessage({
          type: 'userAction',
          action: `添加了新积木 (基于DOM变化)`,
          details: {
            type: 'addBlock',
            timestamp
          }
        }, '*');
      }
    });
  });
  
  // 观察整个文档
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'] 
  });
  
  // 添加鼠标事件监听
  document.addEventListener('mousedown', (event) => {
    if (!isRecording) return;
    
    // 检查是否点击了积木
    const target = event.target;
    if (target.closest('.blocklyDraggable')) {
      console.log('用户选择了积木');
    }
  });
}

// 执行命令
function executeCommand(command, code) {
  console.log(`执行命令: ${command}`, code);
  
  try {
    // 这里需要根据Scratch编辑器API实现具体命令执行
    // 以下是一些示例实现
    
    if (command === 'reset') {
      // 重置工作区
      if (window.Blockly && window.Blockly.getMainWorkspace()) {
        window.Blockly.getMainWorkspace().clear();
      }
    } 
    else if (command === 'run') {
      // 执行代码
      console.log(`运行代码: ${code}`);
      // 模拟执行
      setTimeout(() => {
        // 通知命令执行完成
        window.parent.postMessage({
          type: 'actionComplete',
          action: `执行了代码: ${code}`
        }, '*');
      }, 500);
    }
    else if (command === 'moveBlock') {
      // 移动积木到指定位置
      try {
        const details = JSON.parse(code);
        const { blockId, position } = details;
        
        if (window.Blockly && window.Blockly.getMainWorkspace()) {
          const workspace = window.Blockly.getMainWorkspace();
          const block = workspace.getBlockById(blockId);
          
          if (block) {
            block.moveTo(position);
            console.log(`移动积木 ${blockId} 到位置 (${position.x}, ${position.y})`);
          }
        }
      } catch (e) {
        console.error('解析moveBlock参数失败:', e);
      }
    }
  } catch (error) {
    console.error(`执行命令失败: ${command}`, error);
  }
}

// 监听来自父窗口的消息
window.addEventListener('message', (event) => {
  // 确保消息来自父窗口
  if (event.source !== window.parent) return;
  
  console.log('收到父窗口消息:', event.data);
  
  // 处理初始化消息
  if (event.data.type === 'init') {
    isRecording = !!event.data.isRecording;
    console.log(`初始化编辑器，录制模式: ${isRecording}`);
  }
  
  // 处理开始录制消息
  if (event.data.type === 'recordingStarted') {
    isRecording = true;
    recordingStartTime = Date.now();
    console.log('开始录制操作');
  }
  
  // 处理停止录制消息
  if (event.data.type === 'recordingStopped') {
    isRecording = false;
    console.log('停止录制操作');
  }
  
  // 处理命令执行
  if (event.data.type === 'command') {
    executeCommand(event.data.command, event.data.code);
  }
});

// 页面加载完成后初始化
window.addEventListener('load', () => {
  // 等待Scratch编辑器加载完成
  setTimeout(() => {
    initScratchListener();
  }, 1000);
});

// 立即执行
(function() {
  console.log('Scratch消息处理器已加载');
  
  // 如果页面已经加载完成，立即初始化
  if (document.readyState === 'complete') {
    setTimeout(initScratchListener, 1000);
  }
})(); 