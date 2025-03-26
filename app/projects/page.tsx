'use client';

import React from 'react';
import Header from '../components/Header';

interface Project {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  imageUrl: string;
  difficulty: '初级' | '中级' | '高级';
}

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1,
    title: '绘制彩色螺旋',
    description: '使用循环创建一个不断变化颜色的漂亮螺旋图案。',
    author: '小明',
    date: '2024-03-20',
    imageUrl: 'https://via.placeholder.com/300x200',
    difficulty: '初级'
  },
  {
    id: 2,
    title: '弹跳小球游戏',
    description: '创建一个简单的弹跳小球游戏，学习基本的物理模拟。',
    author: '小红',
    date: '2024-03-18',
    imageUrl: 'https://via.placeholder.com/300x200',
    difficulty: '中级'
  },
  {
    id: 3,
    title: '分形树绘制',
    description: '利用递归概念绘制一棵美丽的分形树。',
    author: '小张',
    date: '2024-03-15',
    imageUrl: 'https://via.placeholder.com/300x200',
    difficulty: '高级'
  },
  {
    id: 4,
    title: '简易计算器',
    description: '创建一个具有基本运算功能的计算器。',
    author: '小李',
    date: '2024-03-10',
    imageUrl: 'https://via.placeholder.com/300x200',
    difficulty: '中级'
  },
  {
    id: 5,
    title: '星空模拟',
    description: '创建一个动态的星空模拟，包含闪烁的星星和移动的彗星。',
    author: '小王',
    date: '2024-03-05',
    imageUrl: 'https://via.placeholder.com/300x200',
    difficulty: '中级'
  },
  {
    id: 6,
    title: '简单迷宫游戏',
    description: '创建一个简单的迷宫游戏，控制角色找到出口。',
    author: '小陈',
    date: '2024-03-01',
    imageUrl: 'https://via.placeholder.com/300x200',
    difficulty: '高级'
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">项目库</h1>
          <button className="scratch-button-orange">创建新项目</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PROJECTS.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span className={`
                    text-sm font-medium rounded-full px-2 py-1
                    ${project.difficulty === '初级' ? 'bg-green-100 text-green-800' : 
                      project.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>作者: {project.author}</span>
                  <span>{project.date}</span>
                </div>
                <button className="mt-4 w-full scratch-button-blue">
                  查看项目
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-700">
        <p>© 2024 Scratch交互式编程 - 让编程更简单</p>
      </footer>
    </main>
  );
} 