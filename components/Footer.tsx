'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo和简介 */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 relative overflow-hidden rounded-lg bg-gradient-to-r from-[var(--scratch-orange)] to-[var(--scratch-blue)] flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800 dark:text-white">Scratch编程</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">交互式学习平台</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
              我们致力于为孩子们提供有趣、互动的编程学习体验，激发创造力和解决问题的能力。
            </p>
          </div>

          {/* 网站导航 */}
          <div className="md:col-span-1">
            <h3 className="text-gray-800 font-bold mb-4 dark:text-white">网站导航</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">首页</Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">课程</Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">学生中心</Link>
              </li>
              <li>
                <Link href="/teacher/dashboard" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">教师中心</Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">学习社区</Link>
              </li>
            </ul>
          </div>

          {/* 资源链接 */}
          <div className="md:col-span-1">
            <h3 className="text-gray-800 font-bold mb-4 dark:text-white">学习资源</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tutorials" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">教程</Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">项目展示</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">常见问题</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[var(--scratch-blue)] text-sm dark:text-gray-400">关于我们</Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div className="md:col-span-1">
            <h3 className="text-gray-800 font-bold mb-4 dark:text-white">联系我们</h3>
            <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
              邮箱：contact@scratch-interactive.com<br />
              电话：400-123-4567<br />
            </p>
            {/* 社交媒体图标 */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[var(--scratch-blue)] dark:hover:text-[var(--scratch-blue)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--scratch-blue)] dark:hover:text-[var(--scratch-blue)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v2h-2zm0 4h2v6h-2z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--scratch-blue)] dark:hover:text-[var(--scratch-blue)]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-9h2v5h-2zm0-6h2v2h-2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 底部分割线 */}
        <div className="border-t border-gray-200 mt-8 pt-6 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0 dark:text-gray-400">© 2024 Scratch交互式编程学习平台 - 让编程学习更简单</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-500 hover:text-[var(--scratch-blue)] text-xs dark:text-gray-400 dark:hover:text-[var(--scratch-blue)]">隐私政策</Link>
              <Link href="/terms" className="text-gray-500 hover:text-[var(--scratch-blue)] text-xs dark:text-gray-400 dark:hover:text-[var(--scratch-blue)]">使用条款</Link>
              <Link href="/support" className="text-gray-500 hover:text-[var(--scratch-blue)] text-xs dark:text-gray-400 dark:hover:text-[var(--scratch-blue)]">帮助中心</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 