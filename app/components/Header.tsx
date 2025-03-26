'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from './theme-switcher';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header className="bg-[var(--scratch-blue)] text-white p-4 shadow-md dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="hidden md:inline">Scratch交互式编程学习平台</span>
            <span className="md:hidden">Scratch编程</span>
          </Link>
        </div>
        
        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/" className={`hover:underline ${isActive('/') ? 'font-bold' : ''}`}>
                首页
              </Link>
            </li>
            <li>
              <Link href="/student/dashboard" className={`hover:underline ${isActive('/student/dashboard') ? 'font-bold' : ''}`}>
                学生中心
              </Link>
            </li>
            <li>
              <Link href="/teacher/dashboard" className={`hover:underline ${isActive('/teacher/dashboard') ? 'font-bold' : ''}`}>
                教师中心
              </Link>
            </li>
            <li>
              <Link href="/community" className={`hover:underline ${isActive('/community') ? 'font-bold' : ''}`}>
                学习社区
              </Link>
            </li>
            <li>
              <ThemeSwitcher />
            </li>
            <li>
              <Link href="/login" className="scratch-button-orange py-1 px-4 text-sm rounded-full hover:bg-orange-600">
                登录/注册
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* 移动端菜单按钮和主题切换器 */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeSwitcher />
          <button 
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2">
          <ul className="flex flex-col space-y-3 p-4">
            <li>
              <Link href="/" className={`block ${isActive('/') ? 'font-bold' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                首页
              </Link>
            </li>
            <li>
              <Link href="/student/dashboard" className={`block ${isActive('/student/dashboard') ? 'font-bold' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                学生中心
              </Link>
            </li>
            <li>
              <Link href="/teacher/dashboard" className={`block ${isActive('/teacher/dashboard') ? 'font-bold' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                教师中心
              </Link>
            </li>
            <li>
              <Link href="/community" className={`block ${isActive('/community') ? 'font-bold' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                学习社区
              </Link>
            </li>
            <li>
              <Link href="/login" className="scratch-button-orange inline-block py-1 px-4 text-sm rounded-full" onClick={() => setMobileMenuOpen(false)}>
                登录/注册
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
} 