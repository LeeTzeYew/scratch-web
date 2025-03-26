'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BackToTop from '../../../components/BackToTop';

export default function TeacherDashboardPage() {
  // 模拟课程数据
  const courses = [
    { id: '1', title: 'Scratch基础入门', lessons: 12, students: 48, lastUpdated: '2024-05-01', description: '学习Scratch编程的基本概念和积木使用方法，适合零基础学习者。' },
    { id: '2', title: '制作你的第一个动画', lessons: 8, students: 36, lastUpdated: '2024-04-28', description: '使用Scratch创建有趣的动画效果，学习角色移动和外观变化。' },
    { id: '3', title: '条件语句与循环', lessons: 10, students: 24, lastUpdated: '2024-04-15', description: '学习程序控制流程，包括条件判断和循环结构，为编程打下坚实基础。' },
  ];
  
  // 搜索和过滤
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // 过滤课程
  const filteredCourses = courses.filter(course => {
    // 应用搜索过滤
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
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
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">👋 教师控制面板</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    管理您的课程和学生，录制新课时，查看学习数据
                  </p>
                </div>
                <Link 
                  href="/teacher/record" 
                  className="scratch-button-green flex items-center mt-4 md:mt-0 w-full md:w-auto justify-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  录制新课程
                </Link>
              </div>
            </div>
          </div>
          
          {/* 课程统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--scratch-blue)] bg-opacity-20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--scratch-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">总课程数</p>
                  <p className="text-2xl font-bold dark:text-white">{courses.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--scratch-green)] bg-opacity-20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--scratch-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">总学生数</p>
                  <p className="text-2xl font-bold dark:text-white">{courses.reduce((sum, course) => sum + course.students, 0)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[var(--scratch-orange)] bg-opacity-20 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--scratch-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm dark:text-gray-400">总课时数</p>
                  <p className="text-2xl font-bold dark:text-white">{courses.reduce((sum, course) => sum + course.lessons, 0)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 课程筛选和搜索 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 dark:bg-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">课程管理</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 搜索框 */}
                <div>
                  <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300">关键词搜索</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      className="block w-full rounded-lg border-gray-300 border py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="搜索课程..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* 过滤器 */}
                <div>
                  <label htmlFor="status" className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300">课程状态</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'active', 'draft'].map((status) => (
                      <button
                        key={status}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          filterStatus === status
                            ? 'bg-[var(--scratch-blue)] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setFilterStatus(status)}
                      >
                        {status === 'all' ? '全部' : status === 'active' ? '已发布' : '草稿'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 课程列表 */}
          <h2 className="text-2xl font-bold mb-6 dark:text-white">我的课程 ({filteredCourses.length})</h2>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col dark:bg-gray-800">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 dark:text-gray-300">{course.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4 dark:text-gray-400">
                      <div className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {course.lessons} 课时
                      </div>
                      <div className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {course.students} 学生
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {course.lastUpdated}
                      </div>
                    </div>
                    
                    <div className="flex mt-4 gap-3">
                      <Link href={`/teacher/course/${course.id}`} className="flex-1">
                        <button className="w-full scratch-button-blue">查看课程</button>
                      </Link>
                      <Link href={`/teacher/record?course=${course.id}`} className="flex-1">
                        <button className="w-full scratch-button-green">添加课时</button>
                      </Link>
                    </div>
                  </div>
                </div>
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
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
              >
                重置筛选条件
              </button>
            </div>
          )}
          
          {/* 添加新课程按钮 */}
          <div className="flex justify-center">
            <button className="scratch-button-blue flex items-center px-6 py-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加新课程
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
} 