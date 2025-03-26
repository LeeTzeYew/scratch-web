'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import NewHeader from './components/NewHeader';
import CoursesSection from './components/CoursesSection';
import GradientBackground from './components/GradientBackground';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50/80 dark:bg-gray-900/80">
      <GradientBackground />
      <NewHeader />
      
      <div className="flex-1 container mx-auto py-8 mt-24">
        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 英雄区域 */}
          <div className="py-32 text-center relative fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold mb-8 leading-tight">
                <span className="gradient-text">创造性思维</span>
                <br className="hidden sm:block" />
                <span className="text-gray-900 dark:text-white">与编程教育平台</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                通过Scratch编程激发创造力，培养孩子的逻辑思维和问题解决能力，开启编程学习之旅
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="/student/dashboard" 
                  className="scratch-button-blue hover:scale-105 transform transition-transform text-lg px-8 py-4"
                >
                  开始学习
                </a>
                <a 
                  href="/courses" 
                  className="scratch-button-outline hover:scale-105 transform transition-transform text-lg px-8 py-4"
                >
                  探索课程
                </a>
              </div>
            </div>
          </div>
          
          {/* 特色区域 */}
          <div className="py-24">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="gradient-text">平台特色</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* 特色卡片1 */}
              <div className="glass-effect rounded-2xl shadow-lg overflow-hidden hover-card group">
                <div className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-[var(--scratch-blue)] transition-colors">
                    启发创造力
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    通过可视化编程激发孩子的想象力和创造力，让编程学习变得有趣而充满挑战
                  </p>
                </div>
              </div>
              
              {/* 特色卡片2 */}
              <div className="glass-effect rounded-2xl shadow-lg overflow-hidden hover-card group">
                <div className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-[var(--scratch-green)] transition-colors">
                    互动课程
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    精心设计的互动课程，循序渐进地引导学生掌握编程概念和技能，实时反馈学习进展
                  </p>
                </div>
              </div>
              
              {/* 特色卡片3 */}
              <div className="glass-effect rounded-2xl shadow-lg overflow-hidden hover-card group">
                <div className="p-8">
                  <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-8 h-8 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-[var(--scratch-orange)] transition-colors">
                    社区分享
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    在学习社区中展示和分享作品，与其他学习者交流经验，获得反馈和灵感
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 课程区块 */}
          <div className="fade-in py-16">
            <CoursesSection />
          </div>
          
          {/* 呼吁行动区域 */}
          <div className="py-24 text-center">
            <div className="max-w-4xl mx-auto glass-effect rounded-3xl p-12 hover-card transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-4xl font-bold mb-8">
                <span className="gradient-text">准备好开始你的编程之旅了吗？</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                加入我们的平台，探索编程的乐趣，培养未来所需的核心技能
              </p>
              <a 
                href="/auth/register" 
                className="scratch-button-orange hover:scale-105 transform transition-transform text-lg px-10 py-4 rounded-xl"
              >
                立即注册免费账号
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
}
