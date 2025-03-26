'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackToTop from '../../components/BackToTop';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'article' | 'project';
  url: string;
  thumbnail?: string;
  date?: string;
  author?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // 模拟搜索结果
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      title: 'Scratch基础入门',
      description: '学习Scratch编程的基本概念和积木使用方法，适合零基础学习者。',
      type: 'course',
      url: '/student/course/1',
      thumbnail: 'https://via.placeholder.com/200?text=Scratch基础',
      author: '编程老师'
    },
    {
      id: '2',
      title: '制作你的第一个动画',
      description: '使用Scratch创建有趣的动画效果，学习角色移动和外观变化。',
      type: 'course',
      url: '/student/course/2',
      thumbnail: 'https://via.placeholder.com/200?text=动画制作',
      author: '动画讲师'
    },
    {
      id: '3',
      title: '如何使用Scratch编写故事',
      description: '学习如何使用Scratch创建交互式故事，包括对话、场景切换和角色互动。',
      type: 'article',
      url: '/community/article/1',
      date: '2024-03-15',
      author: '故事创作者'
    },
    {
      id: '4',
      title: '迷宫大冒险游戏分享',
      description: '一个用Scratch制作的迷宫冒险游戏，包含多个关卡和计分系统。',
      type: 'project',
      url: '/community/project/1',
      thumbnail: 'https://via.placeholder.com/200?text=迷宫游戏',
      date: '2024-03-10',
      author: '小明'
    },
    {
      id: '5',
      title: '游戏设计基础',
      description: '学习如何设计和开发简单的游戏，包括计分系统和关卡设计。',
      type: 'course',
      url: '/student/course/3',
      thumbnail: 'https://via.placeholder.com/200?text=游戏设计',
      author: '游戏设计师'
    },
    {
      id: '6',
      title: 'Scratch编程技巧和窍门',
      description: '分享一些使用Scratch编程的高级技巧和窍门，帮助提高编程效率和项目质量。',
      type: 'article',
      url: '/community/article/2',
      date: '2024-03-05',
      author: '编程专家'
    },
    {
      id: '7',
      title: '音乐创作工具',
      description: '使用Scratch创建的音乐创作工具，可以演奏不同的乐器并录制音乐。',
      type: 'project',
      url: '/community/project/2',
      thumbnail: 'https://via.placeholder.com/200?text=音乐工具',
      date: '2024-02-28',
      author: '音乐爱好者'
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    // 模拟搜索延迟
    const timer = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
      } else {
        const filtered = mockSearchResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) || 
          result.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // 过滤结果
  const filteredResults = activeFilter === 'all' 
    ? results 
    : results.filter(result => result.type === activeFilter);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">{`"${query}" 的搜索结果`}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            找到 {filteredResults.length} 个结果
          </p>

          {/* 过滤器 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'course', 'article', 'project'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-[var(--scratch-blue)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? '全部' : 
                 filter === 'course' ? '课程' : 
                 filter === 'article' ? '文章' : '项目'}
              </button>
            ))}
          </div>

          {/* 加载状态 */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-[var(--scratch-blue)]"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">搜索中...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-700 mt-4 mb-2 dark:text-white">
                未找到相关结果
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                尝试使用其他关键词或更广泛的搜索条件
              </p>
              <Link href="/" className="scratch-button-blue inline-block">
                返回首页
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResults.map((result) => (
                <div key={result.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <Link href={result.url} className="block hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                      {result.thumbnail && (
                        <div className="w-full md:w-48 h-36 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                          <img 
                            src={result.thumbnail} 
                            alt={result.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            result.type === 'course' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                              : result.type === 'article'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          }`}>
                            {result.type === 'course' ? '课程' : result.type === 'article' ? '文章' : '项目'}
                          </span>
                          {result.date && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {result.date}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                          {result.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {result.description}
                        </p>
                        
                        {result.author && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            作者: {result.author}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* 分页 */}
          {!isLoading && filteredResults.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <span className="px-4 py-2 rounded-l-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                  上一页
                </span>
                <span className="px-4 py-2 bg-[var(--scratch-blue)] text-white border border-[var(--scratch-blue)]">
                  1
                </span>
                <span className="px-4 py-2 rounded-r-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed">
                  下一页
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <BackToTop />
    </main>
  );
} 