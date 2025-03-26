'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackToTop from '../../components/BackToTop';
import CourseCard, { CourseProps } from '../components/CourseCard';

// 模拟课程数据
const allCourses: CourseProps[] = [
  {
    id: 1,
    title: "Scratch基础入门",
    level: "初级",
    lessons: 5,
    duration: "2小时",
    thumbnail: "/images/scratch-blocks.png",
    description: "学习Scratch编程的基本概念和积木使用方法，适合零基础学习者。"
  },
  {
    id: 2,
    title: "制作你的第一个动画",
    level: "初级",
    lessons: 4,
    duration: "1.5小时",
    thumbnail: "/images/scratch-cat.png",
    description: "使用Scratch创建有趣的动画效果，学习角色移动和外观变化。"
  },
  {
    id: 3,
    title: "游戏设计基础",
    level: "中级",
    lessons: 6,
    duration: "3小时",
    thumbnail: "/images/scratch-stage.png",
    description: "学习如何设计和开发简单的游戏，包括计分系统和关卡设计。"
  },
  {
    id: 4,
    title: "交互式故事创作",
    level: "中级",
    lessons: 5,
    duration: "2.5小时",
    thumbnail: "/images/scratch-book.png",
    description: "学习如何创建交互式故事，包括场景切换、对话和分支剧情。"
  },
  {
    id: 5,
    title: "高级游戏开发",
    level: "高级",
    lessons: 8,
    duration: "4小时",
    thumbnail: "/images/scratch-friends.png",
    description: "学习高级游戏开发技巧，包括多角色交互、物理引擎和游戏AI。"
  },
  {
    id: 6,
    title: "数据可视化入门",
    level: "中级",
    lessons: 5,
    duration: "2小时",
    thumbnail: "/images/scratch-data.png",
    description: "使用Scratch处理和展示数据，创建动态图表和可视化效果。"
  },
  {
    id: 7,
    title: "音乐与声音设计",
    level: "初级",
    lessons: 4,
    duration: "1.5小时",
    thumbnail: "/images/scratch-music.png",
    description: "探索Scratch的音乐功能，创作原创音乐和声音效果。"
  },
  {
    id: 8,
    title: "物理模拟实验",
    level: "高级",
    lessons: 6,
    duration: "3小时",
    thumbnail: "/images/scratch-physics.png",
    description: "使用Scratch模拟物理现象，创建交互式科学实验。"
  }
];

export default function CoursesPage() {
  const [activeFilters, setActiveFilters] = useState({
    level: "全部",
    category: "全部",
    search: ""
  });
  
  // 处理过滤器变化
  const handleFilterChange = (type: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  // 过滤课程
  const filteredCourses = allCourses.filter(course => {
    // 应用难度级别过滤
    if (activeFilters.level !== "全部" && course.level !== activeFilters.level) {
      return false;
    }
    
    // 应用搜索过滤
    if (activeFilters.search && !course.title.toLowerCase().includes(activeFilters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 dark:text-white">我们的课程</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              探索我们精心设计的Scratch编程课程，从入门到高级，满足不同层次的学习需求
            </p>
          </div>
          
          {/* 课程过滤器 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12 dark:bg-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 dark:text-white">课程筛选</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 搜索框 */}
                <div>
                  <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300">关键词搜索</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      className="block w-full rounded-lg border-gray-300 border py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="搜索课程..."
                      value={activeFilters.search}
                      onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* 难度级别过滤器 */}
                <div>
                  <label htmlFor="level" className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300">难度级别</label>
                  <div className="flex flex-wrap gap-2">
                    {["全部", "初级", "中级", "高级"].map((level) => (
                      <button
                        key={level}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          activeFilters.level === level
                            ? 'bg-[var(--scratch-blue)] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => handleFilterChange('level', level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 分类过滤器 */}
                <div>
                  <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300">课程分类</label>
                  <select
                    id="category"
                    className="block w-full rounded-lg border-gray-300 border py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={activeFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    {["全部", "基础", "动画", "游戏", "故事", "音乐", "艺术"].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* 课程列表 */}
          <h2 className="text-2xl font-bold mb-6 dark:text-white">所有课程 ({filteredCourses.length})</h2>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center dark:bg-gray-800">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2 dark:text-white">没有找到匹配的课程</h3>
              <p className="text-gray-500 dark:text-gray-400">尝试调整筛选条件或搜索关键词</p>
              <button 
                className="mt-4 scratch-button-outline"
                onClick={() => {
                  setActiveFilters({
                    level: "全部",
                    category: "全部",
                    search: ""
                  });
                }}
              >
                重置筛选条件
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
} 