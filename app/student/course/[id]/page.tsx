'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import BackToTop from '../../../../components/BackToTop';

// 定义操作类型接口
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

export default function CoursePage({ params }: { params: { id: string } }) {
  // 直接访问params.id，虽然有警告但目前可行
  const courseId = params.id;
  
  const [activeTab, setActiveTab] = useState('content');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  const [isScratchReady, setIsScratchReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [lastExecutedTime, setLastExecutedTime] = useState(-1);
  const [lastActionTime, setLastActionTime] = useState<number | null>(null);
  const [showSyncIndicator, setShowSyncIndicator] = useState(false);
  const [syncIndicatorMessage, setSyncIndicatorMessage] = useState('');
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [operations, setOperations] = useState<EditorOperation[]>([]);
  
  // 操作回放相关状态
  const [operationLog, setOperationLog] = useState<EditorOperation[]>([]);
  const [executedOperations, setExecutedOperations] = useState<Set<number>>(new Set());
  const [isOperationsLoaded, setIsOperationsLoaded] = useState(false);
  const [loadingOperations, setLoadingOperations] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scratchIframeRef = useRef<HTMLIFrameElement>(null);
  
  // 模拟的课程数据
  const course = {
    id: courseId,
    title: 'Scratch编程基础入门',
    instructor: '李明老师',
    description: '本课程将介绍Scratch编程的基本概念和积木使用方法，适合零基础学习者。通过学习，您将理解程序的构建和逻辑概念，为今后的编程学习打下基础。',
    currentLesson: 1,
    totalLessons: 10,
    progress: 10,
    rating: 4.8,
    students: 128,
    comments: [
      { id: 1, user: '小明', content: '老师讲得很清楚，特别适合我这种编程零基础的学生。', time: '2024-04-18' },
      { id: 2, user: '小红', content: '学习了第一课，已经能做出简单的动画了，太棒了！', time: '2024-04-17' },
    ]
  };
  
  // 模拟的操作数据，与教师录制页面保持一致
  const actions: Action[] = [
    { timestamp: 2, action: 'run', code: 'say "欢迎来到Scratch编程课程!"' },
    { timestamp: 5, action: 'run', code: 'move 10 steps' },
    { timestamp: 8, action: 'run', code: 'turn right 90 degrees' },
    { timestamp: 12, action: 'run', code: 'turn left 90 degrees' },
    { timestamp: 15, action: 'run', code: 'move 20 steps' },
    { timestamp: 18, action: 'run', code: 'say "这是我们的第一个动画!"' }
  ];
  
  // 加载操作记录
  useEffect(() => {
    const loadOperationLog = async () => {
      try {
        setLoadingOperations(true);
        setLoadingError(null);
        
        // 实际项目中，这里应该是从服务器加载数据
        // 这里使用模拟数据演示功能
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟的操作记录，实际应从API获取
        const mockOperations: EditorOperation[] = [
          { type: 'command', command: 'run', code: 'say "欢迎来到Scratch编程课程!"', timestamp: 2 },
          { type: 'command', command: 'run', code: 'move 10 steps', timestamp: 5 },
          { type: 'command', command: 'run', code: 'turn right 90 degrees', timestamp: 8 },
          { type: 'command', command: 'run', code: 'turn left 90 degrees', timestamp: 12 },
          { type: 'command', command: 'run', code: 'move 20 steps', timestamp: 15 },
          { type: 'command', command: 'run', code: 'say "这是我们的第一个动画!"', timestamp: 18 }
        ];
        
        setOperationLog(mockOperations);
        setIsOperationsLoaded(true);
        console.log(`加载了${mockOperations.length}个操作记录`);
        
      } catch (error) {
        console.error('加载操作记录失败:', error);
        setLoadingError('无法加载操作记录，请刷新页面重试');
      } finally {
        setLoadingOperations(false);
      }
    };
    
    loadOperationLog();
  }, [courseId]);
  
  // 处理编辑器加载完成
  const handleEditorLoad = () => {
    setIsEditorLoading(false);
  };
  
  // 监听Scratch编辑器加载完成
  useEffect(() => {
    const iframe = scratchIframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        console.log('Scratch 编辑器已加载');
        // 添加延迟以确保编辑器完全渲染
        setTimeout(() => {
          handleEditorLoad();
          // 设置Scratch编辑器就绪状态
          setIsScratchReady(true);
          
          // 初始化编辑器
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'init',
              isRecording: false
            }, '*');
          }
        }, 1000);
      };
      
      iframe.onload = handleLoad;
      return () => {
        iframe.onload = null;
      };
    }
  }, []);
  
  // 发送命令到Scratch编辑器
  const sendScratchCommand = (command: string, code: string) => {
    const iframe = scratchIframeRef.current;
    if (iframe && iframe.contentWindow) {
      console.log('发送Scratch命令:', command, code);
      iframe.contentWindow.postMessage({
        type: 'command',
        command: command,
        code: code
      }, '*');
      
      // 更新同步状态
      setSyncStatus('syncing');
      setSyncIndicatorMessage(`执行命令: ${command}`);
      setShowSyncIndicator(true);
    }
  };
  
  // 更新播放状态处理函数
  const handlePlay = () => {
    // 检查操作记录是否已加载
    if (!isOperationsLoaded) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      alert('操作记录正在加载中，请稍候...');
      return;
    }
    
    setIsSyncing(true);
    setSyncStatus('syncing');
    setSyncIndicatorMessage('开始同步');
    setShowSyncIndicator(true);
    // 5秒后自动隐藏同步指示器
    setTimeout(() => setShowSyncIndicator(false), 5000);
  };

  const handlePause = () => {
    setIsSyncing(false);
    setSyncStatus('synced');
    setSyncIndicatorMessage('同步已暂停');
    setShowSyncIndicator(true);
    setTimeout(() => setShowSyncIndicator(false), 2000);
  };

  // 更新时间更新处理函数
  const handleTimeUpdate = () => {
    if (!isSyncing || !videoRef.current || !isOperationsLoaded) return;
    
    const video = videoRef.current;
    const currentTime = Math.floor(video.currentTime);
    
    // 查找所有应该在当前时间执行的操作
    operationLog.forEach(operation => {
      // 检查是否到达操作时间点且尚未执行
      if (Math.floor(operation.timestamp) === currentTime && 
          !executedOperations.has(operation.timestamp)) {
        
        console.log(`执行操作: ${operation.type} ${operation.command || ''} 在 ${currentTime}秒`);
        
        // 根据操作类型执行相应命令
        if (operation.type === 'move' && operation.blockId && operation.position) {
          // 移动积木操作
          sendScratchCommand('moveBlock', JSON.stringify({
            blockId: operation.blockId,
            position: operation.position
          }));
        } else if (operation.type === 'create') {
          // 创建积木操作
          sendScratchCommand('createBlock', JSON.stringify({
            blockType: operation.blockId,
            position: operation.position
          }));
        } else if (operation.type === 'change') {
          // 修改积木属性操作
          sendScratchCommand('setField', JSON.stringify({
            blockId: operation.blockId,
            field: operation.field,
            value: operation.newValue
          }));
        } else if (operation.type === 'delete') {
          // 删除积木操作
          sendScratchCommand('deleteBlock', JSON.stringify({
            blockId: operation.blockId
          }));
        } else if (operation.command) {
          // 执行命令操作
          sendScratchCommand(operation.command, operation.code || '');
        }
        
        // 标记操作为已执行
        setExecutedOperations(prev => {
          const newSet = new Set(prev);
          newSet.add(operation.timestamp);
          return newSet;
        });
        
        // 更新同步状态
        setLastActionTime(Date.now());
        setSyncStatus('syncing');
        setSyncIndicatorMessage(`执行: ${operation.command || operation.type}`);
        setShowSyncIndicator(true);
        
        // 1秒后更新状态
        setTimeout(() => {
          setSyncStatus('synced');
          setTimeout(() => setShowSyncIndicator(false), 1000);
        }, 1000);
      }
    });
    
    // 更新最后执行的时间
    if (currentTime !== lastExecutedTime) {
      setLastExecutedTime(currentTime);
    }
  };
  
  // 监听视频事件
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isSyncing, isScratchReady, operationLog, executedOperations, isOperationsLoaded]);
  
  // 重置编辑器和执行状态
  const handleResetEditor = () => {
    // 重置已执行操作记录
    setExecutedOperations(new Set());
    
    // 重置最后执行时间
    setLastExecutedTime(-1);
    
    // 执行Scratch编辑器重置
    if (isScratchReady) {
      sendScratchCommand('reset', '');
    }
  };
  
  // 删除切换编辑器的函数，改为仅初始化Scratch编辑器
  const initializeScratchEditor = () => {
    setIsEditorLoading(true);
    
    // 重置执行状态
    setExecutedOperations(new Set());
    setLastExecutedTime(-1);
    
    // 如果视频正在播放，暂停它
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该处理评论提交逻辑
    setComment('');
  };
  
  // 添加导入操作的处理函数
  const handleImportOperations = (operations: any[]) => {
    console.log('导入操作记录:', operations);
    
    // 按时间戳排序操作
    operations.sort((a, b) => a.timestamp - b.timestamp);
    
    // 重置当前时间
    setCurrentTime(0);
    
    // 清空现有操作记录
    setOperationLog([]);
    setExecutedOperations(new Set());
    
    // 添加导入的操作到操作记录
    setOperationLog(operations);
    
    // 通知Scratch编辑器重置
    if (scratchIframeRef.current?.contentWindow) {
      scratchIframeRef.current.contentWindow.postMessage({
        type: 'command',
        command: 'reset'
      }, '*');
    }
    
    // 开始播放
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // 添加导入文本的处理函数
  const handleImportText = (content: string) => {
    console.log('导入文本内容:', content);
    
    // 解析文本内容中的操作
    const lines = content.split('\n');
    const operations: EditorOperation[] = [];
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('//')) {
        // 解析操作行
        const match = line.match(/(\w+)\((.*)\)/);
        if (match) {
          const [_, command, params] = match;
          const args = params.split(',').map(arg => arg.trim().replace(/['"]/g, ''));
          
          const operation: EditorOperation = {
            type: command,
            timestamp: parseFloat(args[args.length - 1]) || 0,
            blockId: args[0],
            command: command,
            code: line
          };
          
          // 根据命令类型添加额外属性
          if (command === 'moveBlock') {
            operation.position = {
              x: parseFloat(args[1]),
              y: parseFloat(args[2])
            };
          } else if (command === 'changeBlock') {
            operation.command = 'setField';
            operation.code = `setField('${args[0]}', '${args[1]}', '${args[2]}')`;
          }
          
          operations.push(operation);
        }
      }
    });
    
    // 处理解析出的操作
    handleImportOperations(operations);
  };
  
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 container mx-auto p-4 w-full">
        <div className="w-full">
          {/* 返回链接 */}
          <Link href="/student/dashboard" className="flex items-center text-[var(--scratch-blue)] mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回仪表盘
          </Link>
          
          {/* 进度条 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="text-sm text-gray-600">
                进度: {course.progress}% | 当前课时: {course.currentLesson}/{course.totalLessons}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[var(--scratch-blue)] h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>
          
          {/* 主内容区 - 修改为更有利于编辑器的布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* 左侧主要内容区，减小宽度 */}
            <div className="lg:col-span-1">
              {/* 内容标签页 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="flex border-b">
                  <button 
                    className={`px-4 py-3 font-medium text-sm ${activeTab === 'content' ? 'border-b-2 border-[var(--scratch-blue)] text-[var(--scratch-blue)]' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('content')}
                  >
                    视频内容
                  </button>
                  <button 
                    className={`px-4 py-3 font-medium text-sm ${activeTab === 'materials' ? 'border-b-2 border-[var(--scratch-blue)] text-[var(--scratch-blue)]' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('materials')}
                  >
                    课程资料
                  </button>
                  <button 
                    className={`px-4 py-3 font-medium text-sm ${activeTab === 'quiz' ? 'border-b-2 border-[var(--scratch-blue)] text-[var(--scratch-blue)]' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('quiz')}
                  >
                    练习题
                  </button>
                </div>
                
                <div className="p-4">
                  {activeTab === 'content' && (
                    <div>
                      {/* 添加导入代码按钮 */}
                      <div className="flex justify-end mb-4">
                        <label className="px-4 py-2 bg-[var(--scratch-blue)] text-white rounded-md hover:bg-blue-600 cursor-pointer flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          导入代码
                          <input
                            type="file"
                            accept=".txt,.json"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const content = event.target?.result as string;
                                  try {
                                    // 尝试解析为JSON
                                    const jsonData = JSON.parse(content);
                                    if (jsonData.operations) {
                                      // 处理JSON格式的操作记录
                                      handleImportOperations(jsonData.operations);
                                    }
                                  } catch {
                                    // 如果不是JSON，则作为文本处理
                                    handleImportText(content);
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      
                      <div className="mb-4">
                        <div className="relative">
                          <video 
                            ref={videoRef} 
                            className="w-full rounded-lg" 
                            controls
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onTimeUpdate={handleTimeUpdate}
                          >
                            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                            您的浏览器不支持视频标签
                          </video>
                          
                          {/* 同步状态指示器 */}
                          {showSyncIndicator && (
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs text-white flex items-center ${
                              syncStatus === 'synced' ? 'bg-green-500' : 
                              syncStatus === 'syncing' ? 'bg-blue-500' : 
                              'bg-red-500'
                            }`}>
                              {syncStatus === 'synced' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {syncIndicatorMessage || '已同步'}
                                </>
                              ) : syncStatus === 'syncing' ? (
                                <>
                                  <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  {syncIndicatorMessage || '同步中'}
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {syncIndicatorMessage || '同步错误'}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <h2 className="text-lg font-semibold">第1课：Scratch界面介绍</h2>
                          <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-gray-700">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-[var(--scratch-blue)] pl-4 py-2">
                        <h3 className="font-medium text-gray-900">本节内容</h3>
                        <p className="text-gray-700 text-sm mt-1">在本课时中，我们将介绍Scratch编辑器的基本界面和功能区域，包括舞台区、角色区、积木区等。通过本课学习，您将熟悉编辑环境，为后续的编程实践打下基础。</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'materials' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">课程资料</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center p-2 rounded hover:bg-gray-50">
                          <svg className="w-6 h-6 text-[var(--scratch-blue)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">Scratch基础操作指南.pdf</span>
                          <button className="ml-auto text-[var(--scratch-blue)] text-sm">下载</button>
                        </li>
                        <li className="flex items-center p-2 rounded hover:bg-gray-50">
                          <svg className="w-6 h-6 text-[var(--scratch-green)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span className="text-gray-700">第一课练习素材.zip</span>
                          <button className="ml-auto text-[var(--scratch-blue)] text-sm">下载</button>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {activeTab === 'quiz' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">第1课练习题</h3>
                      <div className="space-y-4">
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">1. Scratch编辑器中，用于演示程序运行效果的区域是？</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input type="radio" id="q1-a" name="q1" className="mr-2" />
                              <label htmlFor="q1-a">积木区</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="q1-b" name="q1" className="mr-2" />
                              <label htmlFor="q1-b">舞台区</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="q1-c" name="q1" className="mr-2" />
                              <label htmlFor="q1-c">角色区</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border rounded-lg">
                          <p className="font-medium">2. 在Scratch中，以下哪种积木负责控制角色移动？</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input type="radio" id="q2-a" name="q2" className="mr-2" />
                              <label htmlFor="q2-a">外观类积木</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="q2-b" name="q2" className="mr-2" />
                              <label htmlFor="q2-b">声音类积木</label>
                            </div>
                            <div className="flex items-center">
                              <input type="radio" id="q2-c" name="q2" className="mr-2" />
                              <label htmlFor="q2-c">动作类积木</label>
                            </div>
                          </div>
                        </div>
                        
                        <button className="scratch-button-blue">提交答案</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 讨论区 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium">课程讨论</h3>
                  <button 
                    className="text-sm text-[var(--scratch-blue)] hover:underline"
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  >
                    {isCommentsOpen ? '收起讨论' : '展开讨论'}
                  </button>
                </div>
                
                {isCommentsOpen && (
                  <div className="p-4">
                    {/* 评论列表 */}
                    <div className="space-y-4 mb-4">
                      {course.comments.map(comment => (
                        <div key={comment.id} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between">
                            <div className="font-medium">{comment.user}</div>
                            <div className="text-sm text-gray-500">{comment.time}</div>
                          </div>
                          <p className="text-gray-700 mt-1">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* 评论表单 */}
                    <form onSubmit={handleSubmitComment}>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)]"
                        placeholder="输入您的问题或评论..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button type="submit" className="scratch-button-blue">
                          发表评论
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
            
            {/* 右侧编辑器区域 */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              {/* 编辑器加载状态 */}
              {isEditorLoading && (
                <div className="editor-loading bg-white bg-opacity-70">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--scratch-blue)]"></div>
                    <p className="mt-2 text-[var(--scratch-blue)]">加载中...</p>
                  </div>
                </div>
              )}
              
              {/* 编辑器容器 - 调整为2/3宽度 */}
              <div className="flex-1 h-[500px] min-h-[500px] editor-container relative mx-auto w-2/3">
                {/* Scratch 编辑器 iframe */}
                <iframe 
                  ref={scratchIframeRef}
                  src="https://leetzeyew.github.io/scratch-editor"
                  className="w-full h-full border-none"
                  title="Scratch 编辑器"
                />
              </div>
            </div>
          </div>
          
          {/* 课程目录 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">课程目录</h3>
            <div className="space-y-2">
              <div className="flex items-center p-2 bg-blue-50 border-l-4 border-[var(--scratch-blue)] rounded">
                <div className="w-8 h-8 rounded-full bg-[var(--scratch-blue)] text-white flex items-center justify-center mr-2">1</div>
                <div className="flex-1">
                  <div className="font-medium">Scratch界面介绍</div>
                  <div className="text-sm text-gray-500">15分钟 • 当前学习</div>
                </div>
                <div className="text-[var(--scratch-blue)]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">2</div>
                <div className="flex-1">
                  <div className="font-medium">认识角色和积木</div>
                  <div className="text-sm text-gray-500">20分钟</div>
                </div>
                <button className="text-[var(--scratch-blue)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2">3</div>
                <div className="flex-1">
                  <div className="font-medium">创建你的第一个动画</div>
                  <div className="text-sm text-gray-500">25分钟</div>
                </div>
                <button className="text-[var(--scratch-blue)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加操作加载状态指示器 */}
      {loadingOperations && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          正在加载操作记录...
        </div>
      )}
      
      {/* 添加错误提示 */}
      {loadingError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {loadingError}
        </div>
      )}
      
      {/* 操作状态指示器 */}
      {isOperationsLoaded && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm my-2">
          已加载 {operationLog.length} 个操作，可以开始播放视频查看同步效果
        </div>
      )}
      
      <Footer />
      <BackToTop />
    </main>
  );
} 