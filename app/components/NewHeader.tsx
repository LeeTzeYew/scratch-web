'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeSwitcher from './theme-switcher';
import NotificationCenter from './NotificationCenter';
import UserProfileMenu from './UserProfileMenu';
import SearchBar from './SearchBar';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function NewHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 检测页面滚动来改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // 检查当前路径是否活跃
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  // 关闭移动菜单的处理函数
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-effect shadow-md' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 w-auto transform transition-transform duration-300 hover:scale-110"
            />
            <span className="font-bold text-xl gradient-text">Scratch学习平台</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/">首页</NavLink>
            <NavLink href="/courses">课程</NavLink>
            <NavLink href="/student">学生中心</NavLink>
            <NavLink href="/teacher">教师中心</NavLink>
            <NavLink href="/community">学习社区</NavLink>
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="py-2 glass-effect rounded-lg mt-2 shadow-lg">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>首页</MobileNavLink>
            <MobileNavLink href="/courses" onClick={() => setIsOpen(false)}>课程</MobileNavLink>
            <MobileNavLink href="/student" onClick={() => setIsOpen(false)}>学生中心</MobileNavLink>
            <MobileNavLink href="/teacher" onClick={() => setIsOpen(false)}>教师中心</MobileNavLink>
            <MobileNavLink href="/community" onClick={() => setIsOpen(false)}>学习社区</MobileNavLink>
            
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <span>切换到亮色模式</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>切换到暗色模式</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

// 桌面端导航链接组件
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`relative px-3 py-2 transition-colors duration-300 hover:text-[var(--scratch-blue)] ${
        isActive ? 'text-[var(--scratch-blue)]' : 'text-gray-600 dark:text-gray-300'
      } group`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--scratch-blue)] transform origin-left transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0'
      } group-hover:scale-x-100`} />
    </Link>
  );
}

// 移动端导航链接组件
function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 text-lg transition-colors duration-300 ${
        isActive 
          ? 'text-[var(--scratch-blue)] bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
} 