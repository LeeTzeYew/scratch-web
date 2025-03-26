/**
 * Scratch编辑器操作记录器 - 后台脚本
 * 负责处理数据持久化和与主应用的通信
 */

console.log('Scratch编辑器操作记录器后台脚本已加载');

// 存储所有录制数据
let allRecordedData = [];

// 开启录制时间
let recordingStartTime = null;

// 录制状态
let isRecording = false;

/**
 * 开始新的录制
 */
function startRecording() {
  console.log('开始新的录制');
  isRecording = true;
  recordingStartTime = Date.now();
  allRecordedData = [];
  
  // 更新图标状态
  chrome.action.setIcon({
    path: {
      "16": "/icons/recording16.png",
      "48": "/icons/recording48.png",
      "128": "/icons/recording128.png"
    }
  });
  
  // 向所有活动的Scratch编辑器页面发送开始录制消息
  broadcastMessageToScratchEditors({
    type: 'recordingStarted',
    timestamp: recordingStartTime
  });
  
  return {
    success: true,
    timestamp: recordingStartTime
  };
}

/**
 * 停止当前录制
 */
function stopRecording() {
  console.log('停止录制');
  isRecording = false;
  
  // 计算录制时长
  const recordingDuration = recordingStartTime ? Math.floor((Date.now() - recordingStartTime) / 1000) : 0;
  
  // 向所有活动的Scratch编辑器页面发送停止录制消息
  broadcastMessageToScratchEditors({
    type: 'recordingStopped',
    timestamp: Date.now()
  });
  
  // 更新图标状态
  chrome.action.setIcon({
    path: {
      "16": "/icons/icon16.png",
      "48": "/icons/icon48.png",
      "128": "/icons/icon128.png"
    }
  });
  
  // 保存录制数据
  chrome.storage.local.get(['scratch_operations', 'recording_time'], (result) => {
    if (result.scratch_operations && result.scratch_operations.length > 0) {
      console.log(`获取到${result.scratch_operations.length}个操作记录`);
      allRecordedData = result.scratch_operations;
      
      // 整理数据
      const recordData = {
        operations: allRecordedData,
        recordedAt: new Date().toISOString(),
        duration: result.recording_time || recordingDuration
      };
      
      // 在扩展中保存一份
      chrome.storage.local.set({
        'last_recording': recordData
      }, () => {
        console.log('录制数据已保存到扩展存储');
      });
      
      // 发送到主应用
      sendDataToMainApp(recordData);
    } else {
      console.log('没有找到录制数据');
    }
  });
  
  return {
    success: true,
    recordingDuration,
    operationCount: allRecordedData.length
  };
}

/**
 * 向所有活动的Scratch编辑器页面广播消息
 */
function broadcastMessageToScratchEditors(message) {
  chrome.tabs.query({ url: "*://leetzeyew.github.io/scratch-editor*" }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message);
    });
  });
}

/**
 * 发送数据到主应用
 */
function sendDataToMainApp(data) {
  // 首先尝试寻找主应用页面
  chrome.tabs.query({ url: "*://leetzeyew.github.io/*" }, (tabs) => {
    // 过滤掉编辑器页面
    const mainAppTabs = tabs.filter(tab => !tab.url.includes('scratch-editor'));
    
    if (mainAppTabs.length > 0) {
      // 找到主应用页面，发送数据
      chrome.tabs.sendMessage(mainAppTabs[0].id, {
        type: 'recordingData',
        data: data
      });
      console.log('数据已发送到主应用');
    } else {
      console.log('未找到主应用页面，数据将保存在本地');
      // 导出数据到文件
      exportDataToFile(data);
    }
  });
}

/**
 * 导出数据到文件
 */
function exportDataToFile(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  chrome.downloads.download({
    url: url,
    filename: `scratch-recording-${new Date().toISOString().replace(/:/g, '-')}.json`,
    saveAs: true
  }, (downloadId) => {
    console.log('数据已导出到文件，下载ID:', downloadId);
    URL.revokeObjectURL(url);
  });
}

/**
 * 监听来自内容脚本的消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message, '来自:', sender);
  
  if (message.type === 'startRecording') {
    const result = startRecording();
    sendResponse(result);
  }
  
  if (message.type === 'stopRecording') {
    const result = stopRecording();
    sendResponse(result);
  }
  
  if (message.type === 'getRecordingStatus') {
    sendResponse({
      isRecording,
      recordingStartTime,
      operationCount: allRecordedData.length
    });
  }
  
  if (message.type === 'recordOperation') {
    if (isRecording) {
      // 添加时间戳
      const timestamp = Math.floor((Date.now() - recordingStartTime) / 1000);
      const operation = {
        ...message.operation,
        timestamp
      };
      
      allRecordedData.push(operation);
      sendResponse({ success: true, timestamp });
    } else {
      sendResponse({ success: false, error: '录制未开始' });
    }
  }
  
  // 表示我们将异步回复
  return true;
});

/**
 * 监听扩展按钮点击
 */
chrome.action.onClicked.addListener((tab) => {
  // 检查是否是Scratch编辑器页面
  if (tab.url && tab.url.includes('leetzeyew.github.io/scratch-editor')) {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  } else {
    // 如果不是编辑器页面，打开弹出窗口
    chrome.action.openPopup();
  }
});

/**
 * 扩展安装或更新时的初始化
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('扩展已安装或更新:', details.reason);
  
  // 初始化存储
  chrome.storage.local.set({
    'settings': {
      autoStartRecording: false,
      saveDataToFile: true,
      syncWithServer: false,
      serverUrl: ''
    }
  }, () => {
    console.log('初始化设置已保存');
  });
}); 