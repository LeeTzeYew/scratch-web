'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BackToTop from '../../../components/BackToTop';
import JSZip from 'jszip';

// 定义RecordRTC类型
declare global {
  interface Window {
    RecordRTC: any;
  }
}

interface Action {
  timestamp: number;
  action: string;
  code: string;
}

// 定义操作接口
interface EditorOperation {
  type: string;
  blockId?: string;
  position?: {x: number, y: number};
  command?: string;
  code?: string;
  timestamp: number;
  field?: string;
  newValue?: string;
  blockType?: string;
}

export default function RecordCoursePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedActions, setRecordedActions] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const snapIframeRef = useRef<HTMLIFrameElement>(null);
  const scratchIframeRef = useRef<HTMLIFrameElement>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isSnapReady, setIsSnapReady] = useState(false);
  const [isScratchReady, setIsScratchReady] = useState(false);
  const [lastExecutedTime, setLastExecutedTime] = useState(-1);
  const [activeEditor, setActiveEditor] = useState<'scratch'>('scratch');
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  
  // 添加操作记录相关状态
  const [operations, setOperations] = useState<EditorOperation[]>([]);
  const recordingStartTime = useRef<number>(0);
  
  // 屏幕录制相关状态
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<any>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isScreenShareSupported, setIsScreenShareSupported] = useState(true);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  
  // 添加新的状态变量
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  
  // 模拟的操作数据
  const actions: Action[] = [
    { timestamp: 2, action: 'run', code: 'say "欢迎来到Scratch编程课程!"' },
    { timestamp: 5, action: 'run', code: 'move 10 steps' },
    { timestamp: 8, action: 'run', code: 'turn right 90 degrees' },
    { timestamp: 12, action: 'run', code: 'turn left 90 degrees' },
    { timestamp: 15, action: 'run', code: 'move 20 steps' },
    { timestamp: 18, action: 'run', code: 'say "这是我们的第一个动画!"' }
  ];
  
  // 获取URL参数中的课程ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    if (courseId) {
      setSelectedCourse(courseId);
    }
  }, []);
  
  // 检查浏览器是否支持屏幕共享
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setIsScreenShareSupported(false);
      setRecordingError('您的浏览器不支持屏幕共享功能，无法录制屏幕');
    }
    
    // 动态加载RecordRTC库
    const loadRecordRTC = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/recordrtc@5.6.2/RecordRTC.min.js';
        script.async = true;
        script.onload = () => console.log('RecordRTC库加载成功');
        script.onerror = () => {
          setRecordingError('加载录制库失败，请检查网络连接');
          console.error('RecordRTC库加载失败');
        };
        document.body.appendChild(script);
      } catch (error) {
        console.error('加载RecordRTC失败:', error);
        setRecordingError('加载录制库失败');
      }
    };
    
    loadRecordRTC();
  }, []);
  
  // 检查JSZip是否正确加载
  useEffect(() => {
    if (typeof JSZip === 'undefined') {
      console.error('JSZip未正确加载');
      setRecordingError('文件压缩功能未正确加载，请刷新页面重试');
    }
  }, []);
  
  // 处理编辑器加载完成
  const handleEditorLoad = () => {
    setIsEditorLoading(false);
  };
  
  // 监听Scratch编辑器加载完成并设置双向通信
  useEffect(() => {
    const iframe = scratchIframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        console.log('Scratch 编辑器已加载');
        setTimeout(() => {
          handleEditorLoad();
          setIsScratchReady(true);
          
          // 加载时发送初始化消息
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'init',
              isRecording: isRecording
            }, '*');
          }
        }, 1000);
      };
      
      iframe.onload = handleLoad;
      
      // 监听Scratch编辑器的消息
      const handleScratchMessage = (event: MessageEvent) => {
        if (iframe.contentWindow === event.source) {
          console.log('收到Scratch消息:', {
            type: event.data.type,
            details: event.data.details,
            timestamp: new Date().toISOString(),
            isRecording: isRecording,
            currentOperations: operations.length
          });
          
          if (event.data.type === 'userAction') {
            const operation = event.data.details;
            if (isRecording) {
              const newOperation: EditorOperation = {
                ...operation,
                timestamp: recordingTime
              };
              console.log('添加新操作:', newOperation);
              setOperations(prevOps => [...prevOps, newOperation]);
            } else {
              console.log('未记录操作：当前未在录制状态');
            }
          }
          
          // 处理录制状态变化
          if (event.data.type === 'recordingStatus') {
            console.log('录制状态变化:', event.data.isRecording);
          }
        }
      };
      
      window.addEventListener('message', handleScratchMessage);
      
      return () => {
        iframe.onload = null;
        window.removeEventListener('message', handleScratchMessage);
      };
    }
  }, [isRecording, operations.length, recordingTime]);
  
  // 监听视频事件
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsSyncing(true);
    const handlePause = () => setIsSyncing(false);
    const handleTimeUpdate = () => {
      if (!isSyncing || !video) return;
      
      const currentTime = Math.floor(video.currentTime);
      if (currentTime !== lastExecutedTime) {
        setLastExecutedTime(currentTime);
        
        // 删除Snap!相关代码
      }
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isSyncing, lastExecutedTime, actions]);
  
  // 向Scratch编辑器发送命令 - 并记录操作
  const sendScratchCommand = (command: string, code: string) => {
    const iframe = scratchIframeRef.current;
    if (iframe && iframe.contentWindow) {
      console.log('发送Scratch命令:', command, code);
      iframe.contentWindow.postMessage({
        type: 'command',
        command: command,
        code: code
      }, '*');
      
      // 如果正在录制，记录这个操作
      if (isRecording) {
        const relativeTime = (Date.now() - recordingStartTime.current) / 1000;
        
        // 添加到操作列表
        setOperations(prev => [...prev, {
          type: 'command',
          command: command,
          code: code,
          timestamp: relativeTime
        }]);
        
        recordAction(`发送命令: ${command} - ${code} 在 ${relativeTime}秒`);
      }
    }
  };
  
  // 处理开始/停止录制
  const handleToggleRecording = () => {
    if (isRecording) {
      // 停止录制
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
      
      // 通知Scratch编辑器停止录制
      const iframe = scratchIframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'recordingStopped'
        }, '*');
      }
      
      // 停止屏幕录制
      if (isScreenRecording) {
        stopScreenRecording();
      } else if (screenStream) {
        // 确保流被停止，即使没有录制
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
      }
      
      // 暂停视频
      if (videoRef.current) {
        videoRef.current.pause();
      }
      
      // 保存操作记录
      handleSaveOperations();
    } else {
      // 检查是否有已存在的录制资源，如果有则清理
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
      }
      if (recorder) {
        setRecorder(null);
      }
      if (recordedBlob) {
        setRecordedBlob(null);
      }
      
      // 重置录制状态
      setIsScreenRecording(false);
      setRecordingTime(0);
      
      // 开始倒计时
      setCountdown(3);
    }
  };
  
  // 倒计时逻辑
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // 倒计时结束，开始录制
      setCountdown(null);
      
      // 避免重复启动录制
      if (!isRecording) {
        startRecording();
      }
    }
  }, [countdown, isRecording]);
  
  // 开始录制
  const startRecording = () => {
    // 如果已经在录制，不要再次启动
    if (isRecording) return;
    
    logDebug('开始录制');
    
    setIsRecording(true);
    setRecordedActions([]);
    setOperations([]); // 重置操作记录数组
    recordingStartTime.current = Date.now();
    
    // 开始计时
    if (timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    // 通知Scratch编辑器开始录制
    if (activeEditor === 'scratch' && scratchIframeRef.current && scratchIframeRef.current.contentWindow) {
      scratchIframeRef.current.contentWindow.postMessage({
        type: 'recordingStarted',
        timestamp: Date.now()
      }, '*');
      logDebug('通知Scratch编辑器：开始录制');
    }
    
    // 只在第一次录制时开始屏幕录制
    if (isScreenShareSupported && !isScreenRecording && !recordedBlob && !screenStream) {
      startScreenRecording().catch(error => {
        console.error('启动屏幕录制失败:', error);
        recordAction('屏幕录制启动失败');
      });
    }
  };
  
  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 记录一个动作
  const recordAction = (action: string, code: string = '') => {
    if (!isRecording) return;
    
    // 计算相对时间戳
    const timestamp = Math.floor((Date.now() - recordingStartTime.current) / 1000);
    
    console.log(`记录动作: ${action}, 时间: ${timestamp}秒`);
    
    // 将操作记录到日志中
    setRecordedActions(prev => [...prev, `${formatTime(timestamp)} - ${action}`]);
    
    // 同时记录到操作记录中
    const newOperation: EditorOperation = {
      type: 'command',
      command: action,
      code: code,
      timestamp: timestamp
    };
    
    // 更新操作列表
    setOperations(prev => [...prev, newOperation]);
  };
  
  // 保存操作记录
  const handleSaveOperations = () => {
    console.log(`保存前操作数量: ${operations.length}`);
    
    // 创建包含课程信息和操作记录的数据对象
    const operationData = {
      lessonTitle: lessonTitle,
      courseId: selectedCourse,
      recordedAt: new Date().toISOString(),
      duration: recordingTime > 0 ? recordingTime : Math.floor((Date.now() - recordingStartTime.current) / 1000),
      operations: operations,
      // 添加重放代码
      replayCode: operations.map(op => {
        switch (op.type) {
          case 'create':
            return op.blockType ? `createBlock('${op.blockType}', ${op.timestamp});` : '';
          case 'move':
            return op.position ? `moveBlock('${op.blockId}', ${op.position.x}, ${op.position.y}, ${op.timestamp});` : '';
          case 'change':
            return op.field && op.newValue ? `changeBlock('${op.blockId}', '${op.field}', '${op.newValue}', ${op.timestamp});` : '';
          case 'delete':
            return `deleteBlock('${op.blockId}', ${op.timestamp});`;
          default:
            return '';
        }
      }).filter(code => code !== '').join('\n')
    };
    
    // 保存为JSON文件
    const jsonBlob = new Blob([JSON.stringify(operationData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `lesson-${selectedCourse}-${Date.now()}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
    
    // 保存为可重放的代码文件
    const codeBlob = new Blob([operationData.replayCode], { type: 'text/plain' });
    const codeUrl = URL.createObjectURL(codeBlob);
    const codeLink = document.createElement('a');
    codeLink.href = codeUrl;
    codeLink.download = `lesson-${selectedCourse}-${Date.now()}-replay.txt`;
    document.body.appendChild(codeLink);
    codeLink.click();
    document.body.removeChild(codeLink);
    URL.revokeObjectURL(codeUrl);
    
    console.log(`已保存${operations.length}个操作记录`);
    
    // 显示下载按钮
    setShowDownloadButton(true);
  };
  
  // 将操作保存按钮添加到保存视频部分
  const handleSaveRecording = () => {
    // 保存录制的数据
    if (recordedBlob) {
      downloadRecording();
    }
    
    // 同时也保存操作记录
    handleSaveOperations();
    
    alert('录制内容和操作记录已保存！在实际应用中，这将会上传到服务器。');
  };
  
  // 课程选择列表
  const courses = [
    { id: '1', title: 'Scratch基础入门' },
    { id: '2', title: '制作你的第一个动画' },
    { id: '3', title: '条件语句与循环' },
    { id: '4', title: '新课程' }
  ];
  
  // 处理屏幕录制
  const startScreenRecording = async () => {
    try {
      // 重置之前的错误
      setRecordingError(null);
      
      // 获取屏幕流
      const displayOptions = {
        video: true,
        audio: false
      };
      
      console.log('请求屏幕共享权限...');
      const stream = await navigator.mediaDevices.getDisplayMedia(displayOptions);
      console.log('获取到屏幕流');
      
      // 获取音频流（如果用户允许）
      let audioStream: MediaStream | null = null;
      if (isMicrophoneEnabled) {
        try {
          audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('获取到音频流');
          stream.addTrack(audioStream.getAudioTracks()[0]);
        } catch (error) {
          console.warn('无法获取麦克风权限:', error);
          recordAction('无法获取麦克风权限，将只录制屏幕无声音', '');
        }
      }
      
      setScreenStream(stream);
      
      // 处理用户停止分享的情况
      stream.getVideoTracks()[0].onended = () => {
        console.log('用户停止了屏幕共享');
        stopScreenRecording();
        recordAction('用户停止了屏幕共享', '');
      };
      
      // 创建RecordRTC实例
      if (window.RecordRTC) {
        console.log('创建RecordRTC实例...');
        const options = {
          type: 'video',
          mimeType: 'video/webm;codecs=vp9',
          bitsPerSecond: 128000 * 8,
          recorderType: window.RecordRTC.MediaStreamRecorder,
          disableLogs: false,
          timeSlice: 1000,
          checkForInactiveTracks: true,
          ondataavailable: (blob: Blob) => {
            console.log('新的录制数据可用', recordingTime);
          }
        };
        
        const newRecorder = new window.RecordRTC(stream, options);
        console.log('RecordRTC实例创建成功');
        
        // 开始录制
        newRecorder.startRecording();
        console.log('开始录制');
        
        setRecorder(newRecorder);
        setIsScreenRecording(true);
        recordAction('开始屏幕录制', '');
        
      } else {
        console.error('RecordRTC库未加载');
        setRecordingError('RecordRTC库尚未加载完成，请稍后再试');
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
      }
    } catch (error) {
      console.error('启动屏幕录制失败:', error);
      setRecordingError(`启动屏幕录制失败: ${error instanceof Error ? error.message : '未知错误'}`);
      recordAction('屏幕录制启动失败', '');
    }
  };
  
  // 停止屏幕录制
  const stopScreenRecording = async () => {
    try {
      if (!recorder) {
        console.log('没有活动的录制器');
        return;
      }

      console.log('正在停止录制...');
      
      // 停止录制器
      recorder.stopRecording(() => {
        console.log('录制已停止');
        const blob = recorder.getBlob();
        setRecordedBlob(blob);
        setRecorder(null);
        setIsScreenRecording(false);
        setShowDownloadButton(true);
      });

      // 停止所有媒体流
      if (screenStream) {
        screenStream.getTracks().forEach(track => {
          track.stop();
          console.log('停止轨道:', track.kind);
        });
        setScreenStream(null);
      }

      // 通知Scratch编辑器停止录制
      if (scratchIframeRef.current?.contentWindow) {
        scratchIframeRef.current.contentWindow.postMessage({
          type: 'recordingStopped',
          timestamp: Date.now()
        }, '*');
      }
      
    } catch (error) {
      console.error('停止录制失败:', error);
      setRecordingError('停止录制失败，请重试');
    }
  };
  
  // 下载录制的视频
  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${lessonTitle || '课程录制'}-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  };
  
  // 修改下载处理函数
  const handleDownloadAll = () => {
    console.log('开始下载处理...');
    console.log('recordedBlob:', recordedBlob);
    console.log('operations:', operations);

    if (!recordedBlob) {
      console.error('没有录制的视频');
      alert('没有可下载的视频内容');
      return;
    }

    if (!operations.length) {
      console.error('没有操作记录');
      alert('没有可下载的操作记录');
      return;
    }
    
    try {
      console.log('创建ZIP文件...');
      const zip = new JSZip();
      
      // 添加视频文件
      console.log('添加视频文件...');
      zip.file('recording.mp4', recordedBlob);
      
      // 创建操作记录的JSON数据
      const jsonData = {
        operations: operations,
        timestamp: new Date().toISOString(),
        duration: recordingTime
      };
      
      // 添加JSON文件
      console.log('添加JSON文件...');
      zip.file('operations.json', JSON.stringify(jsonData, null, 2));
      
      // 创建重放代码文本
      const replayCode = operations.map(op => {
        switch (op.type) {
          case 'create':
            return op.blockType ? 
              `createBlock('${op.blockType}', ${op.position?.x || 0}, ${op.position?.y || 0}, ${op.timestamp});` :
              `createBlock('${op.blockType}', ${op.timestamp});`;
          case 'move':
            return op.blockId ? 
              `moveBlock('${op.blockId}', ${op.position?.x || 0}, ${op.position?.y || 0}, ${op.timestamp});` :
              `moveBlock('${op.blockId}', ${op.timestamp});`;
          case 'change':
            return op.blockId && op.field && op.newValue ? 
              `changeBlock('${op.blockId}', '${op.field}', '${op.newValue}', ${op.timestamp});` : '';
          case 'delete':
            return op.blockId ? `deleteBlock('${op.blockId}', ${op.timestamp});` : '';
          default:
            return '';
        }
      }).filter(code => code !== '').join('\n');
      
      // 添加重放代码文件
      console.log('添加重放代码文件...');
      zip.file('replay.txt', replayCode);
      
      // 生成并下载ZIP文件
      console.log('生成ZIP文件...');
      zip.generateAsync({ type: 'blob' })
        .then((content: Blob) => {
          console.log('ZIP文件生成成功，开始下载...');
          const url = URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = url;
          link.download = `scratch-recording-${new Date().toISOString().split('T')[0]}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('下载完成');
        })
        .catch((error: Error) => {
          console.error('生成ZIP文件失败:', error);
          alert('下载文件失败，请重试');
        });
    } catch (error) {
      console.error('下载处理失败:', error);
      alert('下载处理失败，请重试');
    }
  };
  
  // 修改录制状态更改时的处理，确保在开始/停止录制时通知Scratch编辑器
  useEffect(() => {
    if (activeEditor === 'scratch' && scratchIframeRef.current && scratchIframeRef.current.contentWindow) {
      scratchIframeRef.current.contentWindow.postMessage({
        type: isRecording ? 'recordingStarted' : 'recordingStopped',
        timestamp: Date.now(),
      }, '*');
      
      console.log(`通知Scratch编辑器录制状态更改为: ${isRecording ? '开始' : '停止'}`);
    }
  }, [isRecording, activeEditor]);

  // 在组件加载时添加debug测试消息发送功能
  useEffect(() => {
    // 创建测试函数，用于调试iframe通信
    const testScratchCommunication = () => {
      if (scratchIframeRef.current && scratchIframeRef.current.contentWindow) {
        console.log('发送测试消息到Scratch编辑器');
        scratchIframeRef.current.contentWindow.postMessage({
          type: 'test',
          message: 'Hello from React app'
        }, '*');
      }
    };
    
    // 定期检查并测试通信
    const interval = setInterval(testScratchCommunication, 10000);
    
    // 在开发环境添加全局测试函数，便于调试
    if (typeof window !== 'undefined') {
      (window as any).testScratch = testScratchCommunication;
    }
    
    return () => clearInterval(interval);
  }, []);
  
  // 添加调试日志函数
  const logDebug = (message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] [录制调试]`;
    
    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  };

  // 添加全局消息监听
  useEffect(() => {
    // 全局消息监听器，用于捕获所有消息
    const globalMessageHandler = (event: MessageEvent) => {
      // 记录所有收到的消息，帮助调试
      if (event.source !== window) {
        logDebug('捕获iframe消息:', event.data);
      }
    };
    
    window.addEventListener('message', globalMessageHandler);
    
    return () => {
      window.removeEventListener('message', globalMessageHandler);
    };
  }, []);
  
  // 添加调试信息显示函数
  const showDebugInfo = () => {
    console.log('当前录制状态:', {
      isRecording,
      recordingTime,
      operationsCount: operations.length,
      operations: operations
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 container mx-auto p-4">
        {/* 添加调试按钮 */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={showDebugInfo}
            className="px-4 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50"
          >
            显示调试信息
          </button>
        </div>
        
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/teacher/dashboard" className="flex items-center text-[var(--scratch-blue)] mb-2">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回仪表盘
            </Link>
            <h1 className="text-2xl font-bold dark:text-white">录制课程内容</h1>
          </div>
        </div>
        
        {/* 课程信息卡片 */}
        <div className="bg-white rounded-lg shadow-lg mb-6 dark:bg-gray-800">
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-2 dark:text-white">
                  {selectedCourse ? `为课程 #${selectedCourse} 添加课时` : '录制新课时'}
                </h2>
                <p className="text-gray-600 mb-4 dark:text-gray-300">
                  在下方的编辑器中进行操作，系统将录制您的操作过程和语音讲解
                </p>
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="输入课时标题"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="mb-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 录制控制和编辑器 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">录制控制</h3>
                {showDownloadButton && (
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-[var(--scratch-green)] text-white rounded-md hover:bg-green-600 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    下载所有文件
                  </button>
                )}
              </div>
              {/* 录制时间 */}
              <div className="bg-gray-100 p-3 rounded-md mb-4 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm dark:text-gray-300">录制时间:</span>
                  <span className="font-mono text-[var(--scratch-blue)] font-bold">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </div>

              {/* 录制类型选择 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">录制选项</label>
                
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="enableMicrophone"
                    checked={isMicrophoneEnabled}
                    onChange={() => setIsMicrophoneEnabled(!isMicrophoneEnabled)}
                    className="mr-2 h-4 w-4 text-[var(--scratch-blue)] focus:ring-[var(--scratch-blue)]"
                  />
                  <label htmlFor="enableMicrophone" className="text-sm text-gray-700 dark:text-gray-300">启用麦克风录制</label>
                </div>
                
                {isScreenShareSupported ? (
                  <button
                    className={`w-full px-4 py-2 text-sm rounded-md text-white ${
                      isScreenRecording ? 'bg-[var(--scratch-red)]' : 'bg-[var(--scratch-green)]'
                    }`}
                    onClick={isScreenRecording ? stopScreenRecording : startScreenRecording}
                    disabled={!isScreenShareSupported}
                  >
                    {isScreenRecording ? '停止屏幕录制' : '开始屏幕录制'}
                  </button>
                ) : (
                  <div className="text-[var(--scratch-red)] text-sm">
                    您的浏览器不支持屏幕录制功能
                  </div>
                )}
              </div>

              {/* 录制的文件 */}
              {recordedBlob && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">录制的视频</h4>
                  <button
                    className="w-full px-4 py-2 text-sm bg-[var(--scratch-blue)] text-white rounded-md hover:bg-blue-600"
                    onClick={downloadRecording}
                  >
                    下载视频
                  </button>
                  <video 
                    className="mt-2 w-full rounded-md border dark:border-gray-700" 
                    src={URL.createObjectURL(recordedBlob)} 
                    controls
                  />
                </div>
              )}
            </div>

            {/* 已记录的操作 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium dark:text-white">已记录的操作</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{operations.length} 个操作</div>
                </div>
              </div>
              <div className="p-4 overflow-auto" style={{ maxHeight: '300px' }}>
                {operations.length > 0 ? (
                  <div className="space-y-2">
                    {operations.map((op, index) => (
                      <div key={index} className="p-2 text-sm border-l-2 border-[var(--scratch-blue)] bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500">
                        <div className="flex justify-between">
                          <span className="font-medium dark:text-white">{op.type === 'command' ? op.command : op.type}</span>
                          <span className="text-gray-500 dark:text-gray-400">{formatTime(op.timestamp)}</span>
                        </div>
                        {op.code && (
                          <div className="mt-1 text-xs font-mono bg-gray-100 p-1 rounded dark:bg-gray-700 dark:text-gray-300">
                            {op.code}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    没有记录的操作
                  </div>
                )}
              </div>
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 text-sm bg-[var(--scratch-blue)] text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex-1"
                    disabled={operations.length === 0}
                    onClick={handleSaveOperations}
                  >
                    保存操作记录
                  </button>
                  <button 
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    onClick={() => setOperations([])}
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧编辑器区域 */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col dark:bg-gray-800">
            {/* 编辑器加载状态 */}
            {isEditorLoading && (
              <div className="editor-loading bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--scratch-blue)]"></div>
                  <p className="mt-2 text-[var(--scratch-blue)]">加载中...</p>
                </div>
              </div>
            )}
            
            {/* 编辑器容器 */}
            <div className="flex-1 h-[500px] min-h-[500px] editor-container relative mx-auto w-2/3">
              <iframe 
                ref={scratchIframeRef}
                src="https://leetzeyew.github.io/scratch-editor"
                className="w-full h-full border-none"
                title="Scratch 编辑器"
              />
            </div>
            
            {/* 录制提示 */}
            {isRecording && (
              <div className="bg-[var(--scratch-red)] text-white p-2 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse mr-2"></div>
                  <span>正在录制中 - {formatTime(recordingTime)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 保存和发布按钮 */}
        <div className="flex justify-end space-x-4 mb-8">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => window.history.back()}
          >
            取消
          </button>
          <button 
            className="px-6 py-2 bg-[var(--scratch-green)] text-white rounded-md hover:bg-green-600"
            onClick={handleSaveRecording}
            disabled={operations.length === 0}
          >
            保存课时
          </button>
        </div>
        
        {/* 录制错误提示 */}
        {recordingError && (
          <div className="bg-red-50 border-l-4 border-[var(--scratch-red)] p-4 mb-6 dark:bg-red-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[var(--scratch-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-[var(--scratch-red)]">
                  {recordingError}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
} 