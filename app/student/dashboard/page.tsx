'use client';

import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BackToTop from '../../../components/BackToTop';
import Image from 'next/image';
import Link from 'next/link';
import SkillRadarChart from "@/app/components/SkillRadarChart";

// 模拟课程数据
const courses = [
  {
    id: 1,
    title: "Scratch基础入门",
    level: "初级",
    lessons: 5,
    duration: "2小时",
    progress: 20,
    thumbnail: "/images/scratch-blocks.png",
    description: "学习Scratch编程的基本概念和积木使用方法，适合零基础学习者。"
  },
  {
    id: 2,
    title: "制作你的第一个动画",
    level: "初级",
    lessons: 4,
    duration: "1.5小时",
    progress: 0,
    thumbnail: "/images/scratch-cat.png",
    description: "使用Scratch创建有趣的动画效果，学习角色移动和外观变化。"
  },
  {
    id: 3,
    title: "游戏设计基础",
    level: "中级",
    lessons: 6,
    duration: "3小时",
    progress: 0,
    thumbnail: "/images/scratch-stage.png",
    description: "学习如何设计和开发简单的游戏，包括计分系统和关卡设计。"
  },
  {
    id: 4,
    title: "交互式故事创作",
    level: "中级",
    lessons: 5,
    duration: "2.5小时",
    progress: 0,
    thumbnail: "/images/scratch-book.png",
    description: "学习如何创建交互式故事，包括场景切换、对话和分支剧情。"
  },
  {
    id: 5,
    title: "高级游戏开发",
    level: "高级",
    lessons: 8,
    duration: "4小时",
    progress: 0,
    thumbnail: "/images/scratch-friends.png",
    description: "学习高级游戏开发技巧，包括多角色交互、物理引擎和游戏AI。"
  }
];

// 课程过滤器选项
const filters = {
  levels: ["全部", "初级", "中级", "高级"],
  categories: ["全部", "基础", "动画", "游戏", "故事", "音乐", "艺术"]
};

export default function StudentDashboard({ params }: { params: { id: string } }) {
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
  const filteredCourses = courses.filter(course => {
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
      
      <div className="flex-1 container mx-auto p-4">
        <div className="max-w-7xl mx-auto py-6">
          {/* 欢迎区域 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 dark:bg-gray-800">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">👋 你好，小程序员！</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    欢迎回到你的Scratch学习旅程。今天想学习什么新技能呢？
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
                  <Link href="/student/course/1" className="scratch-button-blue">
                    继续学习
                  </Link>
                  <Link href="/tutorials" className="scratch-button-outline">
                    浏览教程
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* 学习进度统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--scratch-blue)] bg-opacity-20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--scratch-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">已完成课程</p>
                  <p className="text-2xl font-bold dark:text-white">2</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--scratch-green)] bg-opacity-20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--scratch-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">进行中课程</p>
                  <p className="text-2xl font-bold dark:text-white">1</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--scratch-orange)] bg-opacity-20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--scratch-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">学习时长</p>
                  <p className="text-2xl font-bold dark:text-white">5.5小时</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 技能雷达图和学习建议 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <SkillRadarChart 
                skills={[
                  { name: '逻辑思维', value: 85, color: 'var(--scratch-blue, #4C97FF)' },
                  { name: '创造力', value: 72, color: 'var(--scratch-green, #4CAF50)' },
                  { name: '动画设计', value: 78, color: 'var(--scratch-orange, #FF9800)' },
                  { name: '算法', value: 65, color: 'var(--scratch-purple, #9C27B0)' },
                  { name: '交互设计', value: 80, color: 'var(--scratch-pink, #E91E63)' },
                ]}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800">
              <h3 className="text-lg font-bold mb-4 dark:text-white">学习建议</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 dark:bg-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm dark:text-white">基于你的技能分布，建议提高算法能力，尝试更多算法相关的项目练习。</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 dark:bg-green-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm dark:text-white">你的动画设计能力表现优秀，可以尝试参加创意编程比赛来进一步发挥潜力。</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 dark:bg-purple-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <p className="text-sm dark:text-white">推荐学习"高级游戏开发"课程，将帮助你平衡发展各项技能。</p>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 课程过滤器 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 dark:bg-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">课程筛选</h2>
              
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
                    {filters.levels.map((level) => (
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
                    {filters.categories.map((category) => (
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
          <h2 className="text-2xl font-bold mb-6 dark:text-white">我的课程 ({filteredCourses.length})</h2>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link href={`/student/course/${course.id}`} key={course.id}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer h-full flex flex-col dark:bg-gray-800">
                    <div className="relative pt-[56.25%] bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white py-1 px-3 rounded-full text-xs font-medium shadow-sm dark:bg-gray-800 dark:text-white">
                        {course.level}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 dark:text-white">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1 dark:text-gray-300">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-2 dark:text-gray-400">
                        <span>{course.lessons} 节课</span>
                        <span>{course.duration}</span>
                      </div>
                      
                      {course.progress > 0 ? (
                        <div className="mt-4">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[var(--scratch-blue)] bg-blue-100 dark:bg-blue-900/30">
                                  进行中
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-[var(--scratch-blue)]">
                                  {course.progress}%
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100 dark:bg-blue-900/20">
                              <div style={{ width: `${course.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--scratch-blue)]"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <span className="inline-block py-1 px-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            未开始
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
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