'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface CourseProps {
  id: number;
  title: string;
  level: string;
  lessons: number;
  duration: string;
  progress?: number;
  thumbnail: string;
  description: string;
}

interface CourseCardProps {
  course: CourseProps;
  showProgress?: boolean;
}

export default function CourseCard({ course, showProgress = false }: CourseCardProps) {
  return (
    <Link href={`/student/course/${course.id}`}>
      <div className="glass-effect rounded-xl shadow-md overflow-hidden hover-card h-full flex flex-col">
        <div className="relative pt-[56.25%] bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transform transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 right-2 glass-effect py-1 px-3 rounded-full text-xs font-medium">
            {course.level}
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white hover:text-[var(--scratch-blue)] transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 flex-1 dark:text-gray-300">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mt-2 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{course.lessons} 节课</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{course.duration}</span>
            </div>
          </div>
          
          {showProgress && course.progress && course.progress > 0 ? (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[var(--scratch-blue)] bg-blue-100 dark:bg-blue-900/30">
                      进行中
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-[var(--scratch-blue)]">
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100 dark:bg-blue-900/20">
                  <div 
                    style={{ width: `${course.progress}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--scratch-blue)] transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <span className="inline-block py-1 px-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 transition-colors duration-300 hover:bg-[var(--scratch-blue)] hover:text-white">
                {showProgress ? '未开始' : '了解更多'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 