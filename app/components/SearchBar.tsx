'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 模拟搜索结果
  const mockSearchResults = [
    { id: 1, title: 'Scratch基础入门', type: 'course', url: '/student/course/1' },
    { id: 2, title: '制作你的第一个动画', type: 'course', url: '/student/course/2' },
    { id: 3, title: '游戏设计基础', type: 'course', url: '/student/course/3' },
    { id: 4, title: '如何分享你的作品', type: 'article', url: '/community/articles/1' },
    { id: 5, title: '编程基础知识', type: 'article', url: '/community/articles/2' },
    { id: 6, title: '迷宫大冒险', type: 'project', url: '/community/projects/1' },
  ];

  // 模拟搜索请求
  const performSearch = (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    // 模拟API延迟
    setTimeout(() => {
      const results = mockSearchResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  // 监听搜索输入
  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  // 点击搜索结果
  const handleResultClick = (url: string) => {
    router.push(url);
    setIsOpen(false);
    setSearchQuery('');
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Command+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Escape key
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="搜索"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-start justify-center z-50 p-4 md:p-8">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-xl overflow-hidden mt-16">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-4 text-gray-900 border-0 focus:ring-0 dark:bg-gray-800 dark:text-white"
                  placeholder="搜索课程、文章或项目..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-[var(--scratch-blue)]"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">搜索中...</p>
                </div>
              ) : searchQuery.trim() !== '' && searchResults.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">未找到相关结果</p>
                </div>
              ) : (
                searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleResultClick(result.url)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-[var(--scratch-blue)] bg-opacity-10 rounded-full flex items-center justify-center">
                        {result.type === 'course' && (
                          <svg className="w-4 h-4 text-[var(--scratch-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        )}
                        {result.type === 'article' && (
                          <svg className="w-4 h-4 text-[var(--scratch-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        )}
                        {result.type === 'project' && (
                          <svg className="w-4 h-4 text-[var(--scratch-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{result.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {result.type === 'course' ? '课程' : result.type === 'article' ? '文章' : '项目'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between items-center">
                  <span>按 <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd> 查看更多结果</span>
                  <span>按 <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Esc</kbd> 关闭</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 