'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件，控制按钮显示/隐藏
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg glass-effect 
        hover:bg-gray-100 dark:hover:bg-gray-800 
        transition-all duration-300 transform hover:scale-110
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        focus:outline-none focus:ring-2 focus:ring-[var(--scratch-blue)] focus:ring-opacity-50
        z-50`}
      aria-label="回到顶部"
    >
      <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />
    </button>
  );
}
