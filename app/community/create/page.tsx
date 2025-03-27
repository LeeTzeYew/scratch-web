'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BackToTop from '../../../components/BackToTop';

export default function CreateProjectPage() {
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const [isScratchReady, setIsScratchReady] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('games');
  const [isSaving, setIsSaving] = useState(false);
  const [importedVideo, setImportedVideo] = useState<string | null>(null);
  const [importedOperations, setImportedOperations] = useState<any[]>([]);
  
  const scratchIframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
        setTimeout(() => {
          handleEditorLoad();
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
  
  // 处理保存项目
  const handleSaveProject = async () => {
    if (!projectTitle.trim()) {
      alert('请输入项目标题');
      return;
    }
    
    setIsSaving(true);
    try {
      // 获取Scratch编辑器的项目数据
      if (scratchIframeRef.current?.contentWindow) {
        scratchIframeRef.current.contentWindow.postMessage({
          type: 'command',
          command: 'getProjectData'
        }, '*');
      }
      
      // 这里应该添加保存项目到服务器的逻辑
      // 暂时模拟保存成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('项目保存成功！');
      // 跳转回社区页面
      window.location.href = '/community';
    } catch (error) {
      console.error('保存项目失败:', error);
      alert('保存项目失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };
  
  // 处理导入文件
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    if (file.type.startsWith('video/')) {
      // 处理视频文件
      const videoUrl = URL.createObjectURL(file);
      setImportedVideo(videoUrl);
    } else if (file.type === 'application/json') {
      // 处理JSON文件（操作记录）
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data.operations) {
            setImportedOperations(data.operations);
            // 通知Scratch编辑器重置并执行导入的操作
            if (scratchIframeRef.current?.contentWindow) {
              scratchIframeRef.current.contentWindow.postMessage({
                type: 'command',
                command: 'reset'
              }, '*');
              
              // 按时间顺序执行操作
              data.operations.sort((a: any, b: any) => a.timestamp - b.timestamp);
              data.operations.forEach((op: any) => {
                setTimeout(() => {
                  if (scratchIframeRef.current?.contentWindow) {
                    scratchIframeRef.current.contentWindow.postMessage({
                      type: 'command',
                      command: op.type,
                      data: op
                    }, '*');
                  }
                }, op.timestamp * 1000);
              });
            }
          }
        } catch (error) {
          console.error('解析操作记录失败:', error);
          alert('导入的操作记录格式不正确');
        }
      };
      reader.readAsText(file);
    } else {
      alert('请导入视频文件或操作记录文件');
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 container mx-auto p-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--scratch-blue)] mb-2">创建新项目</h1>
            <p className="text-gray-600 dark:text-gray-300">使用Scratch编辑器创建你的创意项目</p>
          </div>
          
          {/* 项目信息表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {/* 添加导入按钮 */}
              <div className="flex justify-end mb-4">
                <label className="px-4 py-2 bg-[var(--scratch-blue)] text-white rounded-md hover:bg-blue-600 cursor-pointer flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  导入文件
                  <input
                    type="file"
                    accept="video/*,.json"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                </label>
              </div>
              
              {/* 视频预览 */}
              {importedVideo && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    导入的视频预览
                  </label>
                  <video
                    ref={videoRef}
                    src={importedVideo}
                    controls
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  项目标题
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入项目标题..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  项目描述
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="描述你的项目..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  项目分类
                </label>
                <select
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="games">游戏</option>
                  <option value="animation">动画</option>
                  <option value="story">故事</option>
                  <option value="music">音乐</option>
                  <option value="art">艺术</option>
                  <option value="tutorial">教程</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Scratch编辑器 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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
            <div className="flex-1 h-[600px] min-h-[600px] editor-container relative mx-auto w-2/3">
              <iframe 
                ref={scratchIframeRef}
                src="https://leetzeyew.github.io/scratch-editor"
                className="w-full h-full border-none"
                title="Scratch 编辑器"
              />
            </div>
            
            {/* 保存按钮 */}
            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={handleSaveProject}
                disabled={isSaving || !isScratchReady}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  isSaving || !isScratchReady
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--scratch-blue)] hover:bg-blue-600'
                }`}
              >
                {isSaving ? '保存中...' : '保存项目'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
} 