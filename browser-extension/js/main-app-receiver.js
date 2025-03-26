/**
 * Scratch编辑器操作记录器 - 主应用接收器
 * 此脚本应当注入到主应用页面，用于接收浏览器扩展发送的操作记录
 */

(function() {
  console.log('Scratch编辑器操作接收器已加载');
  
  // 保存上次收到的操作数据
  let lastReceivedData = null;
  
  // 监听来自扩展的消息
  window.addEventListener('message', function(event) {
    // 验证消息来源
    if (event.source !== window) {
      console.log('收到来自扩展的消息:', event.data);
      
      // 处理录制数据
      if (event.data && event.data.type === 'recordingData') {
        processRecordingData(event.data.data);
      }
    }
  });
  
  // 监听来自浏览器扩展的消息
  if (chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      console.log('收到来自扩展的消息:', message);
      
      // 处理录制数据
      if (message && message.type === 'recordingData') {
        processRecordingData(message.data);
        sendResponse({ success: true });
      }
      
      return true; // 表示我们将异步回复
    });
  }
  
  /**
   * 处理收到的录制数据
   * @param {Object} data 录制数据
   */
  function processRecordingData(data) {
    if (!data || !data.operations) return;
    
    console.log(`收到${data.operations.length}个操作记录`);
    lastReceivedData = data;
    
    // 通知主应用有新的操作记录
    const event = new CustomEvent('scratch-operations-received', {
      detail: {
        operations: data.operations,
        recordedAt: data.recordedAt,
        duration: data.duration
      }
    });
    
    window.dispatchEvent(event);
    
    // 如果页面中存在保存操作的函数，直接调用
    if (typeof window.handleScratchOperations === 'function') {
      window.handleScratchOperations(data);
    }
    
    // 如果存在React应用上下文，尝试更新其状态
    updateReactState(data);
  }
  
  /**
   * 尝试更新React应用状态
   * @param {Object} data 录制数据
   */
  function updateReactState(data) {
    // 尝试寻找React应用上下文
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props) {
      console.log('检测到Next.js应用');
      
      // 这里可以通过全局事件总线等方式通知React应用更新状态
      // 由于React应用结构各不相同，这里提供一个通用的事件机制
      window.dispatchEvent(new CustomEvent('scratch-data-update', { 
        detail: data 
      }));
    }
  }
  
  /**
   * 导出数据到文件
   */
  function exportReceivedDataToFile() {
    if (!lastReceivedData) {
      console.warn('没有可导出的数据');
      return;
    }
    
    const blob = new Blob([JSON.stringify(lastReceivedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scratch-recording-${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('数据已导出到文件');
  }
  
  // 暴露接口供主应用使用
  window.scratchOperationReceiver = {
    getLastReceivedData: function() {
      return lastReceivedData;
    },
    exportDataToFile: exportReceivedDataToFile
  };
  
  console.log('Scratch编辑器操作接收器初始化完成');
})(); 