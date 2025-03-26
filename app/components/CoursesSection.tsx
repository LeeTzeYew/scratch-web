'use client';

import React from 'react';
import CourseCard, { CourseProps } from './CourseCard';

const sampleCourses: CourseProps[] = [
  {
    id: 1,
    title: "Scratch编程入门",
    level: "初级",
    lessons: 12,
    duration: "6小时",
    thumbnail: "/images/courses/scratch-basics.jpg",
    description: "从零开始学习Scratch编程，掌握基础概念和编程思维。"
  },
  {
    id: 2,
    title: "游戏开发进阶",
    level: "中级",
    lessons: 15,
    duration: "8小时",
    thumbnail: "/images/courses/game-dev.jpg",
    description: "学习使用Scratch开发有趣的游戏，提升编程技能。"
  },
  {
    id: 3,
    title: "动画制作专题",
    level: "中级",
    lessons: 10,
    duration: "5小时",
    thumbnail: "/images/courses/animation.jpg",
    description: "探索Scratch动画制作的奥秘，创作精彩的动画作品。"
  }
];

export default function CoursesSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            精选课程
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            探索我们精心设计的课程，开启编程学习之旅
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCourses.map((course, index) => (
            <div 
              key={course.id}
              className="transform hover:-translate-y-1 transition-all duration-300"
              style={{
                animationDelay: `${index * 200}ms`,
                opacity: 0,
                animation: 'fade-in-up 0.6s ease forwards'
              }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/courses" 
            className="scratch-button-blue inline-flex items-center group"
          >
            浏览全部课程
            <svg 
              className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
} 