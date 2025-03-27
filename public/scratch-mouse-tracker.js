// Scratch 鼠标事件跟踪器
(function() {
  let isRecording = false;

  // 初始化鼠标事件跟踪
  function initMouseTracking() {
    const mouseEvents = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove'];
    
    mouseEvents.forEach(eventType => {
      document.addEventListener(eventType, handleMouseEvent, true);
    });
  }

  // 处理鼠标事件
  function handleMouseEvent(event) {
    if (!isRecording) return;

    // 获取目标元素信息
    const target = event.target;
    const targetInfo = {
      target: target.tagName,
      targetId: target.id,
      targetClass: target.className,
      x: event.clientX,
      y: event.clientY,
      eventType: event.type
    };

    // 发送事件信息到父窗口
    window.parent.postMessage({
      type: 'MOUSE_EVENT',
      ...targetInfo,
      timestamp: Date.now()
    }, '*');
  }

  // 监听来自父窗口的消息
  window.addEventListener('message', (event) => {
    if (event.data.type === 'INIT_MOUSE_TRACKING') {
      isRecording = event.data.isRecording;
      console.log('Mouse tracking initialized, recording:', isRecording);
    } else if (event.data.type === 'recordingStarted') {
      isRecording = true;
      console.log('Recording started');
    } else if (event.data.type === 'recordingStopped') {
      isRecording = false;
      console.log('Recording stopped');
    }
  });

  // 初始化
  initMouseTracking();
  console.log('Mouse tracker initialized');
})(); 