'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // 监听滚动事件，调整导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md backdrop-blur-sm bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-90 dark:shadow-gray-900' 
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo 和网站名称 */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 relative overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg">
              <div className="w-full h-full bg-gradient-to-r from-[var(--scratch-orange)] to-[var(--scratch-blue)] flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                S
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 group-hover:text-[var(--scratch-blue)] transition-colors duration-300 dark:text-white">Scratch编程</span>
              <span className="text-xs text-gray-500 hidden sm:inline-block dark:text-gray-400">交互式学习平台</span>
            </div>
          </Link>
          
          {/* 导航链接 - 桌面版 */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={isActive('/')}>首页</NavLink>
            <NavLink href="/courses" active={isActive('/courses')}>课程</NavLink>
            <NavLink href="/student/dashboard" active={isActive('/student/dashboard')}>学生中心</NavLink>
            <NavLink href="/teacher/dashboard" active={isActive('/teacher/dashboard')}>教师中心</NavLink>
            <NavLink href="/community" active={isActive('/community')}>学习社区</NavLink>
          </nav>
          
          {/* 用户信息/登录按钮 */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/auth/login" className="text-gray-600 hover:text-[var(--scratch-blue)] px-3 py-2 rounded-md transition-colors duration-200 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700">
              登录
            </Link>
            <Link href="/auth/register" className="scratch-button-blue">
              免费注册
            </Link>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="flex items-center p-1 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col space-y-2 pb-6">
            <MobileNavLink href="/" active={isActive('/')} onClick={() => setMobileMenuOpen(false)}>
              首页
            </MobileNavLink>
            <MobileNavLink href="/courses" active={isActive('/courses')} onClick={() => setMobileMenuOpen(false)}>
              课程
            </MobileNavLink>
            <MobileNavLink href="/student/dashboard" active={isActive('/student/dashboard')} onClick={() => setMobileMenuOpen(false)}>
              学生中心
            </MobileNavLink>
            <MobileNavLink href="/teacher/dashboard" active={isActive('/teacher/dashboard')} onClick={() => setMobileMenuOpen(false)}>
              教师中心
            </MobileNavLink>
            <MobileNavLink href="/community" active={isActive('/community')} onClick={() => setMobileMenuOpen(false)}>
              学习社区
            </MobileNavLink>
            
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Link 
                href="/auth/login" 
                className="text-center py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:border-[var(--scratch-blue)] hover:text-[var(--scratch-blue)] transition-colors duration-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-[var(--scratch-blue)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                登录
              </Link>
              <Link 
                href="/auth/register" 
                className="text-center py-2 px-4 bg-[var(--scratch-blue)] text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                注册
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

// 桌面端导航链接组件
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        active 
          ? 'text-[var(--scratch-blue)] bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 hover:text-[var(--scratch-blue)] hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
}

// 移动端导航链接组件
function MobileNavLink({ href, active, onClick, children }: { href: string; active: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`py-2 px-3 rounded-md font-medium ${
        active 
          ? 'text-[var(--scratch-blue)] bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 hover:text-[var(--scratch-blue)] hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
} 