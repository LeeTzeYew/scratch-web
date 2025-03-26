/**
 * Scratch编辑器操作记录器 - 弹出窗口脚本
 * 负责用户界面交互和状态显示
 */

// 获取DOM元素
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const timerElement = document.getElementById('timer');
const operationCountElement = document.getElementById('operation-count');
const lastOperationElement = document.getElementById('last-operation');

// 设置相关元素
const autoStartCheckbox = document.getElementById('auto-start');
const saveToFileCheckbox = document.getElementById('save-to-file');
const syncWithAppCheckbox = document.getElementById('sync-with-app');

// 录制状态
let isRecording = false;
let recordingStartTime = null;
let timerInterval = null;
let operationCount = 0;

// 加载设置
function loadSettings() {
  chrome.storage.local.get('settings', (result) => {
    if (result.settings) {
      autoStartCheckbox.checked = result.settings.autoStartRecording;
      saveToFileCheckbox.checked = result.settings.saveDataToFile;
      syncWithAppCheckbox.checked = result.settings.syncWithServer;
    }
  });
}

// 保存设置
function saveSettings() {
  const settings = {
    autoStartRecording: autoStartCheckbox.checked,
    saveDataToFile: saveToFileCheckbox.checked,
    syncWithServer: syncWithAppCheckbox.checked
  };
  
  chrome.storage.local.set({ 'settings': settings }, () => {
    console.log('设置已保存');
  });
}

// 更新录制状态UI
function updateRecordingStatus(recording) {
  isRecording = recording;
  
  if (recording) {
    statusDot.classList.add('recording');
    statusText.textContent = '正在录制';
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } else {
    statusDot.classList.remove('recording');
    statusText.textContent = '未录制';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    
    // 停止计时器
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
}

// 开始录制
function startRecording() {
  chrome.runtime.sendMessage({ type: 'startRecording' }, (response) => {
    if (response && response.success) {
      recordingStartTime = response.timestamp;
      updateRecordingStatus(true);
      
      // 启动计时器
      startTimer();
      
      // 重置操作计数
      operationCount = 0;
      updateOperationCount();
      lastOperationElement.textContent = '无';
    }
  });
}

// 停止录制
function stopRecording() {
  chrome.runtime.sendMessage({ type: 'stopRecording' }, (response) => {
    if (response && response.success) {
      updateRecordingStatus(false);
      
      // 更新统计信息
      operationCount = response.operationCount || 0;
      updateOperationCount();
    }
  });
}

// 开始计时器
function startTimer() {
  recordingStartTime = recordingStartTime || Date.now();
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerElement.textContent = '00:00';
  
  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// 导出最近的录制
function exportRecording() {
  chrome.storage.local.get('last_recording', (result) => {
    if (result.last_recording) {
      const blob = new Blob([JSON.stringify(result.last_recording, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      chrome.downloads.download({
        url: url,
        filename: `scratch-recording-${new Date().toISOString().replace(/:/g, '-')}.json`,
        saveAs: true
      }, (downloadId) => {
        console.log('数据已导出到文件，下载ID:', downloadId);
        URL.revokeObjectURL(url);
      });
    } else {
      alert('没有找到最近的录制数据');
    }
  });
}

// 清除数据
function clearData() {
  if (confirm('确定要清除所有录制数据吗？')) {
    chrome.storage.local.remove(['scratch_operations', 'recording_time', 'last_recording'], () => {
      operationCount = 0;
      updateOperationCount();
      lastOperationElement.textContent = '无';
      alert('数据已清除');
    });
  }
}

// 更新操作计数
function updateOperationCount() {
  operationCountElement.textContent = operationCount.toString();
}

// 获取当前录制状态
function getCurrentStatus() {
  chrome.runtime.sendMessage({ type: 'getRecordingStatus' }, (response) => {
    if (response) {
      updateRecordingStatus(response.isRecording);
      
      if (response.isRecording && response.recordingStartTime) {
        recordingStartTime = response.recordingStartTime;
        startTimer();
      }
      
      operationCount = response.operationCount || 0;
      updateOperationCount();
    }
  });
}

// 监听来自后台的消息
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'recordOperation') {
    operationCount++;
    updateOperationCount();
    
    // 更新最后一次操作
    if (message.operation) {
      const opType = message.operation.type || 'unknown';
      lastOperationElement.textContent = opType;
    }
  }
  
  if (message.type === 'recordingStarted') {
    updateRecordingStatus(true);
    recordingStartTime = message.timestamp;
    startTimer();
  }
  
  if (message.type === 'recordingStopped') {
    updateRecordingStatus(false);
  }
});

// 注册事件监听器
document.addEventListener('DOMContentLoaded', () => {
  // 加载设置
  loadSettings();
  
  // 获取当前状态
  getCurrentStatus();
  
  // 设置按钮点击事件
  startBtn.addEventListener('click', startRecording);
  stopBtn.addEventListener('click', stopRecording);
  exportBtn.addEventListener('click', exportRecording);
  clearBtn.addEventListener('click', clearData);
  
  // 设置选项变化事件
  autoStartCheckbox.addEventListener('change', saveSettings);
  saveToFileCheckbox.addEventListener('change', saveSettings);
  syncWithAppCheckbox.addEventListener('change', saveSettings);
});

// 检查当前标签页是否是Scratch编辑器
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab && currentTab.url && currentTab.url.includes('leetzeyew.github.io/scratch-editor')) {
    // 当前是编辑器页面，检查是否需要自动开始录制
    chrome.storage.local.get('settings', (result) => {
      if (result.settings && result.settings.autoStartRecording && !isRecording) {
        startRecording();
      }
    });
  }
}); 