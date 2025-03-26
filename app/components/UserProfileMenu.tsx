'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserMenuProps {
  userName?: string;
  userAvatar?: string;
  isLoggedIn?: boolean;
}

export default function UserProfileMenu({ 
  userName = '学生用户', 
  userAvatar = '/images/default-avatar.png', 
  isLoggedIn = true 
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // 模拟登出逻辑
    console.log('用户登出');
    // 重定向到登录页面或首页
  };

  // 点击菜单外部关闭菜单
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.user-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!isLoggedIn) {
    return (
      <div className="flex space-x-2">
        <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          登录
        </Link>
        <span className="text-gray-500">|</span>
        <Link href="/register" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
          注册
        </Link>
      </div>
    );
  }

  return (
    <div className="relative user-menu-container">
      <button 
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden relative">
          <Image 
            src={userAvatar} 
            alt={userName} 
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userName}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">已登录为</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userName}</p>
          </div>

          <div className="py-1">
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              个人资料
            </Link>
            <Link 
              href="/settings" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              设置
            </Link>
            <Link 
              href="/my-courses" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              我的课程
            </Link>
          </div>

          <div className="py-1 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
            >
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 