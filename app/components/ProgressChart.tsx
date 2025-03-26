'use client';

import React, { useEffect, useState } from 'react';

interface ProgressChartProps {
  dailyData: number[];
  weeklyData: number[];
  monthlyData: number[];
}

export default function ProgressChart({ 
  dailyData = [2, 5, 3, 6, 4, 7, 5],
  weeklyData = [12, 19, 15, 22, 18], 
  monthlyData = [45, 52, 68, 59]
}: ProgressChartProps) {
  const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartWidth, setChartWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // 设置客户端渲染标记，避免水合错误
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      const chartContainer = document.getElementById('chart-container');
      if (chartContainer) {
        setChartWidth(chartContainer.offsetWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getCurrentData = () => {
    switch (activeView) {
      case 'daily':
        return {
          data: dailyData,
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          maxValue: Math.max(...dailyData),
          unit: '小时'
        };
      case 'weekly':
        return {
          data: weeklyData,
          labels: ['第1周', '第2周', '第3周', '第4周', '第5周'],
          maxValue: Math.max(...weeklyData),
          unit: '小时'
        };
      case 'monthly':
        return {
          data: monthlyData,
          labels: ['1月', '2月', '3月', '4月'],
          maxValue: Math.max(...monthlyData),
          unit: '小时'
        };
      default:
        return {
          data: dailyData,
          labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          maxValue: Math.max(...dailyData),
          unit: '小时'
        };
    }
  };
  
  const { data, labels, maxValue, unit } = getCurrentData();
  
  const getBarColor = (index: number) => {
    const colors = [
      'var(--scratch-blue)',
      'var(--scratch-green)',
      'var(--scratch-orange)',
      'var(--scratch-purple)'
    ];
    
    return colors[index % colors.length];
  };
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold dark:text-white">学习进度</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeView === 'daily'
                ? 'bg-[var(--scratch-blue)] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveView('daily')}
          >
            每日
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeView === 'weekly'
                ? 'bg-[var(--scratch-blue)] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveView('weekly')}
          >
            每周
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeView === 'monthly'
                ? 'bg-[var(--scratch-blue)] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveView('monthly')}
          >
            每月
          </button>
        </div>
      </div>
      
      <div id="chart-container" className="h-64 relative">
        {/* Y轴 */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{maxValue} {unit}</span>
          <span>{Math.floor(maxValue * 0.75)} {unit}</span>
          <span>{Math.floor(maxValue * 0.5)} {unit}</span> 
          <span>{Math.floor(maxValue * 0.25)} {unit}</span>
          <span>0 {unit}</span>
        </div>
        
        {/* 网格线 */}
        <div className="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between">
          <div className="border-t border-gray-100 w-full h-0 dark:border-gray-700"></div>
          <div className="border-t border-gray-100 w-full h-0 dark:border-gray-700"></div>
          <div className="border-t border-gray-100 w-full h-0 dark:border-gray-700"></div>
          <div className="border-t border-gray-100 w-full h-0 dark:border-gray-700"></div>
          <div className="border-t border-gray-100 w-full h-0 dark:border-gray-700"></div>
        </div>
        
        {/* 柱状图 */}
        <div className="absolute left-12 right-0 top-0 bottom-5 flex items-end justify-between">
          {data.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ 
                width: `${100 / data.length - 5}%`,
                height: '100%' 
              }}
            >
              <div 
                className="w-full rounded-t-md transition-all duration-500 ease-in-out" 
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  backgroundColor: getBarColor(index),
                  minHeight: '4px'
                }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* X轴标签 */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {labels.map((label, index) => (
            <div
              key={index}
              className="flex justify-center"
              style={{ width: `${100 / labels.length - 5}%` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          总学习时长: {data.reduce((acc, curr) => acc + curr, 0)} {unit}
        </span>
        <span className="text-gray-600 dark:text-gray-300">
          平均: {(data.reduce((acc, curr) => acc + curr, 0) / data.length).toFixed(1)} {unit}/{activeView === 'daily' ? '天' : activeView === 'weekly' ? '周' : '月'}
        </span>
      </div>
    </div>
  );
} 