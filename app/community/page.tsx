'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackToTop from '../../components/BackToTop';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('popular');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'games', name: '游戏' },
    { id: 'animation', name: '动画' },
    { id: 'story', name: '故事' },
    { id: 'art', name: '艺术' },
    { id: 'music', name: '音乐' },
    { id: 'tutorial', name: '教程' }
  ];
  
  // 模拟项目数据
  const projects = [
    {
      id: '1',
      title: '迷宫大冒险',
      author: '小明',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=迷宫大冒险',
      likes: 156,
      views: 2435,
      comments: 36,
      category: 'games',
      date: '2024-03-15',
      description: '控制小猫穿越迷宫，收集星星并找到出口。使用方向键移动，空格键跳跃。'
    },
    {
      id: '2',
      title: '四季变换动画',
      author: '小红',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=四季变换',
      likes: 243,
      views: 3152,
      comments: 42,
      category: 'animation',
      date: '2024-03-10',
      description: '展示春夏秋冬四季变化的动画，点击屏幕可以切换季节，欣赏不同的美景。'
    },
    {
      id: '3',
      title: '太空射击游戏',
      author: '小李',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=太空射击',
      likes: 312,
      views: 4273,
      comments: 58,
      category: 'games',
      date: '2024-03-05',
      description: '驾驶飞船射击外星人，躲避陨石。使用鼠标控制，点击发射激光。'
    },
    {
      id: '4',
      title: '小红帽历险记',
      author: '小张',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=小红帽历险记',
      likes: 187,
      views: 2856,
      comments: 32,
      category: 'story',
      date: '2024-03-01',
      description: '小红帽在去外婆家的路上遇到了大灰狼，会发生什么呢？点击屏幕继续故事。'
    },
    {
      id: '5',
      title: '音乐创作工具',
      author: '小王',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=音乐创作工具',
      likes: 276,
      views: 3765,
      comments: 45,
      category: 'music',
      date: '2024-02-25',
      description: '点击不同的乐器图标，创作你自己的音乐。可以录制并分享你的作品。'
    },
    {
      id: '6',
      title: 'Scratch基础教程',
      author: '老师张',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=Scratch基础教程',
      likes: 423,
      views: 7634,
      comments: 87,
      category: 'tutorial',
      date: '2024-02-20',
      description: '学习Scratch的基本积木和功能，跟随教程一步步创建你的第一个项目。'
    },
    {
      id: '7',
      title: '分形树绘制',
      author: '小李',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=分形树绘制',
      likes: 198,
      views: 2987,
      comments: 29,
      category: 'art',
      date: '2024-02-15',
      description: '使用递归算法绘制漂亮的分形树，可以调整角度和分支数量。'
    },
    {
      id: '8',
      title: '猫咪钢琴家',
      author: '小明',
      authorAvatar: 'https://via.placeholder.com/40',
      thumbnail: 'https://via.placeholder.com/300x200?text=猫咪钢琴家',
      likes: 267,
      views: 3421,
      comments: 41,
      category: 'music',
      date: '2024-02-10',
      description: '点击钢琴键，让可爱的猫咪演奏美妙的音乐。包含多种乐曲示例。'
    }
  ];
  
  // 根据当前选择的标签和分类过滤项目
  const filteredProjects = projects.filter(project => {
    if (activeCategory !== 'all' && project.category !== activeCategory) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (activeTab === 'popular') {
      return b.likes - a.likes;
    } else if (activeTab === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (activeTab === 'trending') {
      return (b.views / 100 + b.likes) - (a.views / 100 + a.likes);
    }
    return 0;
  });
  
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="relative overflow-hidden">
        {/* Scratch风格的装饰元素 */}
        <div className="absolute top-20 left-5 w-28 h-28 opacity-20 z-0">
          <img src="/images/scratch-cat.png" alt="Scratch猫" className="w-full h-full" />
        </div>
        <div className="absolute bottom-40 right-5 w-32 h-20 opacity-15 z-0 rotate-12">
          <img src="/images/scratch-blocks.png" alt="Scratch积木" className="w-full h-full" />
        </div>
        <div className="absolute top-60 right-1/4 w-24 h-24 opacity-10 z-0 -rotate-6">
          <img src="/images/scratch-stage.png" alt="Scratch舞台" className="w-full h-full" />
        </div>
        
        <div className="container mx-auto p-4">
          <div className="max-w-7xl mx-auto py-8">
            {/* 页面标题 - 使用Scratch风格 */}
            <div className="text-center mb-12 relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-14 w-20 h-20 opacity-80">
                <img src="/images/scratch-cat-face.png" alt="Scratch猫脸" className="w-full h-full" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4D97FF] relative dark:text-[#5AA9FF]">
                学习社区
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#4D97FF] dark:bg-[#5AA9FF]"></div>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">探索和分享创意项目，与其他学习者互动交流，获得灵感和帮助</p>
            </div>
            
            {/* 搜索和过滤器 - 更新为Scratch风格 */}
            <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-grow max-w-xl">
                <input 
                  type="text" 
                  placeholder="搜索项目..." 
                  className="w-full px-4 py-3 pl-10 rounded-md border-2 border-[#4D97FF] focus:outline-none focus:shadow-[0_0_0_2px_rgba(77,151,255,0.3)] focus:border-[#4D97FF] dark:bg-gray-800 dark:border-[#5AA9FF] dark:text-white"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <Link href="/community/create" className="bg-[#FF8C1A] hover:bg-[#FF9933] text-white font-medium py-3 px-5 rounded-md flex items-center transition-colors shadow-md">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                创建新项目
              </Link>
            </div>
            
            {/* 标签和分类过滤器 - Scratch积木风格 */}
            <div className="mb-10">
              <div className="flex flex-wrap gap-2 mb-6">
                <button 
                  className={`py-2 px-5 font-medium rounded-t-md transition-colors border-t-2 border-l-2 border-r-2 ${activeTab === 'popular' ? 'bg-[#4D97FF] text-white border-[#4D97FF]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('popular')}
                >
                  热门
                </button>
                <button 
                  className={`py-2 px-5 font-medium rounded-t-md transition-colors border-t-2 border-l-2 border-r-2 ${activeTab === 'recent' ? 'bg-[#4D97FF] text-white border-[#4D97FF]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  最新
                </button>
                <button 
                  className={`py-2 px-5 font-medium rounded-t-md transition-colors border-t-2 border-l-2 border-r-2 ${activeTab === 'trending' ? 'bg-[#4D97FF] text-white border-[#4D97FF]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('trending')}
                >
                  趋势
                </button>
              </div>
              
              <div className="flex overflow-x-auto pb-2 hide-scrollbar space-x-2 bg-white p-3 rounded-md shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? 'bg-[#4D97FF] text-white'
                        : 'bg-[#E9F1FC] text-[#4D97FF] hover:bg-[#D9E5F9] dark:bg-gray-700 dark:text-[#5AA9FF] dark:hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 项目网格 - Scratch风格卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <div key={project.id} className="bg-white border border-gray-200 shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow group dark:bg-gray-800 dark:border-gray-700">
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-[#4D97FF] text-white">
                          {project.category === 'games' ? '游戏' :
                           project.category === 'animation' ? '动画' :
                           project.category === 'story' ? '故事' :
                           project.category === 'art' ? '艺术' :
                           project.category === 'music' ? '音乐' :
                           project.category === 'tutorial' ? '教程' : '项目'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <img 
                          src={project.authorAvatar} 
                          alt={project.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{project.author}</span>
                      </div>
                      <h3 className="font-bold text-lg truncate mb-1 dark:text-white">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">{project.description}</p>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {project.likes}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {project.views}
                          </span>
                        </div>
                        <span>{project.date.slice(5)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center bg-white p-8 rounded-md shadow-md dark:bg-gray-800">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2 dark:text-white">没有找到匹配的项目</h3>
                  <p className="text-gray-500 dark:text-gray-400">尝试调整筛选条件或搜索关键词</p>
                </div>
              )}
            </div>
            
            {/* 分页 */}
            <div className="flex justify-center mb-12">
              <nav className="flex items-center space-x-1">
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                  上一页
                </button>
                <button className="px-3 py-2 rounded-md bg-[#4D97FF] text-white">1</button>
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">2</button>
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">3</button>
                <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">10</button>
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                  下一页
                </button>
              </nav>
            </div>
            
            {/* CTA区域 */}
            <div className="bg-gradient-to-r from-[#4D97FF] to-[#9966FF] rounded-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">加入Scratch学习社区</h2>
              <p className="mb-6">分享您的项目，获取反馈，探索更多创意作品</p>
              <div className="flex justify-center space-x-4">
                <Link href="/register" className="bg-white text-[#4D97FF] font-medium py-2 px-6 rounded-md hover:bg-gray-100">
                  注册账号
                </Link>
                <Link href="/tutorials" className="bg-transparent border-2 border-white text-white font-medium py-2 px-6 rounded-md hover:bg-white/10">
                  学习教程
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
} 