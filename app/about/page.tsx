'use client';

import React from 'react';
import Header from '../components/Header';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">关于Scratch交互式编程</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Scratch交互式编程是一个为编程初学者设计的可视化编程平台，旨在让编程变得简单、有趣且易于理解。
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">我们的理念</h2>
          <p className="mb-4">
            我们相信编程应该是一种创造性的表达方式，而不仅仅是一种技术技能。通过使用积木式的编程接口，
            我们希望降低编程的学习门槛，让更多人能够体验到创造软件的乐趣。
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">平台特点</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">直观的拖放式编程界面，无需记忆复杂的语法</li>
            <li className="mb-2">实时可视化执行结果，帮助理解代码逻辑</li>
            <li className="mb-2">自动生成JavaScript代码，辅助学习真实编程语言</li>
            <li className="mb-2">丰富的示例项目和教程资源</li>
            <li className="mb-2">完全免费且开源的平台</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">适用人群</h2>
          <p className="mb-4">
            我们的平台适合：
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">编程初学者和学生</li>
            <li className="mb-2">对编程感兴趣但没有技术背景的人</li>
            <li className="mb-2">教育工作者和家长</li>
            <li className="mb-2">想要以有趣方式学习编程概念的任何人</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">联系我们</h2>
          <p className="mb-4">
            如果您有任何问题、建议或反馈，请随时联系我们：
          </p>
          <p className="mb-4">
            邮箱：contact@scratch-interactive.com<br />
            GitHub：<a href="https://github.com/scratch-interactive" className="text-blue-600 hover:underline">github.com/scratch-interactive</a>
          </p>
        </div>
      </div>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-700">
        <p>© 2024 Scratch交互式编程 - 让编程更简单</p>
      </footer>
    </main>
  );
} 