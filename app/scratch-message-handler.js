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
    if (window.Blockly && window.Blockly.getMainWorkspace()) {
      const workspace = window.Blockly.getMainWorkspace();
      
      // 记录所有类型的操作
      workspace.addChangeListener((event) => {
        if (!isRecording) return;
        
        const timestamp = (Date.now() - recordingStartTime) / 1000;
        let operation = null;
        
        switch (event.type) {
          case Blockly.Events.MOVE:
            const block = workspace.getBlockById(event.blockId);
            if (block) {
              const position = block.getRelativeToSurfaceXY();
              operation = {
                type: 'move',
                blockId: event.blockId,
                position: {x: position.x, y: position.y},
                timestamp
              };
            }
            break;
            
          case Blockly.Events.CREATE:
            operation = {
              type: 'create',
              blockId: event.blockId,
              blockType: event.blockType,
              timestamp
            };
            break;
            
          case Blockly.Events.DELETE:
            operation = {
              type: 'delete',
              blockId: event.blockId,
              timestamp
            };
            break;
            
          case Blockly.Events.CHANGE:
            operation = {
              type: 'change',
              blockId: event.blockId,
              field: event.fieldName,
              oldValue: event.oldValue,
              newValue: event.newValue,
              timestamp
            };
            break;
            
          case Blockly.Events.FINISHED_LOADING:
            operation = {
              type: 'load',
              timestamp
            };
            break;
        }
        
        if (operation) {
          // 添加到本地记录
          window.scratchOperations.push(operation);
          
          // 发送到父窗口
          window.parent.postMessage({
            type: 'userAction',
            details: operation
          }, '*');
          
          console.log(`记录了操作: ${operation.type} @ ${timestamp}秒`);
        }
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

// 生成可重放的代码
function generateReplayCode(operations) {
  let code = '';
  
  operations.forEach(op => {
    switch (op.type) {
      case 'create':
        code += `// 创建积木: ${op.blockType}\n`;
        code += `createBlock('${op.blockType}', ${op.timestamp});\n`;
        break;
        
      case 'move':
        code += `// 移动积木到位置 (${op.position.x}, ${op.position.y})\n`;
        code += `moveBlock('${op.blockId}', ${op.position.x}, ${op.position.y}, ${op.timestamp});\n`;
        break;
        
      case 'change':
        code += `// 修改积木属性: ${op.field} = ${op.newValue}\n`;
        code += `changeBlock('${op.blockId}', '${op.field}', '${op.newValue}', ${op.timestamp});\n`;
        break;
        
      case 'delete':
        code += `// 删除积木\n`;
        code += `deleteBlock('${op.blockId}', ${op.timestamp});\n`;
        break;
    }
  });
  
  return code;
}

// 导出操作记录
function exportOperations() {
  const code = generateReplayCode(window.scratchOperations);
  
  // 创建下载链接
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scratch-operations-${new Date().toISOString()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 监听来自父窗口的消息
window.addEventListener('message', (event) => {
  if (event.source !== window.parent) return;
  
  console.log('收到父窗口消息:', event.data);
  
  if (event.data.type === 'init') {
    isRecording = !!event.data.isRecording;
    console.log(`初始化编辑器，录制模式: ${isRecording}`);
  }
  
  if (event.data.type === 'recordingStarted') {
    isRecording = true;
    recordingStartTime = Date.now();
    window.scratchOperations = []; // 清空之前的记录
    console.log('开始录制操作');
  }
  
  if (event.data.type === 'recordingStopped') {
    isRecording = false;
    console.log('停止录制操作');
    exportOperations(); // 导出操作记录
  }
  
  if (event.data.type === 'command') {
    executeCommand(event.data.command, event.data.code);
  }
});

// 页面加载完成后初始化
window.addEventListener('load', () => {
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