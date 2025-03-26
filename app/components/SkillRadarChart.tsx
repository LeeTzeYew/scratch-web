'use client';

import React, { useEffect, useState } from 'react';

interface Skill {
  name: string;
  value: number;
  color: string;
}

interface SkillRadarChartProps {
  skills: Skill[];
  maxValue?: number;
  size?: number;
}

export default function SkillRadarChart({
  skills = [
    { name: '逻辑思维', value: 80, color: 'var(--scratch-blue)' },
    { name: '创造力', value: 65, color: 'var(--scratch-green)' },
    { name: '动画设计', value: 70, color: 'var(--scratch-orange)' },
    { name: '算法', value: 50, color: 'var(--scratch-purple)' },
    { name: '交互设计', value: 75, color: 'var(--scratch-pink)' },
  ],
  maxValue = 100,
  size = 300
}: SkillRadarChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  
  // 计算多边形的顶点
  const calculatePoint = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  
  const numberOfSkills = skills.length;
  const angleStep = 360 / numberOfSkills;
  
  // 绘制技能多边形路径
  const getSkillsPolygonPath = () => {
    const points = skills.map((skill, index) => {
      const angle = index * angleStep;
      const skillRadius = (skill.value / maxValue) * radius;
      return calculatePoint(centerX, centerY, skillRadius, angle);
    });
    
    return points.map((point, index) => (
      index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    )).join(' ') + ' Z';
  };
  
  // 绘制底层多边形网格
  const getGridPolygonPath = (level: number) => {
    const gridRadius = (level / 5) * radius;
    const points = Array.from({ length: numberOfSkills }).map((_, index) => {
      const angle = index * angleStep;
      return calculatePoint(centerX, centerY, gridRadius, angle);
    });
    
    return points.map((point, index) => (
      index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    )).join(' ') + ' Z';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 dark:bg-gray-800">
      <h3 className="text-lg font-bold mb-4 dark:text-white">编程技能雷达图</h3>
      
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 绘制网格线 */}
          {[1, 2, 3, 4, 5].map(level => (
            <path
              key={`grid-${level}`}
              d={getGridPolygonPath(level)}
              fill="none"
              stroke={level === 5 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(209, 213, 219, 0.5)'}
              strokeWidth={level === 5 ? 2 : 1}
              className="dark:stroke-gray-700"
            />
          ))}
          
          {/* 绘制径向线 */}
          {skills.map((skill, index) => {
            const angle = index * angleStep;
            const point = calculatePoint(centerX, centerY, radius, angle);
            return (
              <line
                key={`line-${index}`}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="rgba(209, 213, 219, 0.5)"
                strokeWidth={1}
                className="dark:stroke-gray-700"
              />
            );
          })}
          
          {/* 绘制技能多边形 */}
          <path
            d={getSkillsPolygonPath()}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth={2}
            className="dark:fill-blue-900/30 dark:stroke-blue-500"
          />
          
          {/* 绘制技能点 */}
          {skills.map((skill, index) => {
            const angle = index * angleStep;
            const skillRadius = (skill.value / maxValue) * radius;
            const point = calculatePoint(centerX, centerY, skillRadius, angle);
            return (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={skill.color}
                stroke="white"
                strokeWidth={2}
                className="dark:stroke-gray-800"
              />
            );
          })}
          
          {/* 绘制技能标签 */}
          {skills.map((skill, index) => {
            const angle = index * angleStep;
            const labelPoint = calculatePoint(centerX, centerY, radius + 20, angle);
            
            // 调整标签位置以避免重叠
            const textAnchor = angle > 0 && angle < 180 ? 'start' : angle > 180 && angle < 360 ? 'end' : 'middle';
            const dy = angle > 45 && angle < 135 ? '0.8em' : angle > 225 && angle < 315 ? '-0.5em' : '0.3em';
            
            return (
              <text
                key={`label-${index}`}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                dy={dy}
                fontSize="12"
                fill="currentColor"
                className="dark:fill-gray-300"
              >
                {skill.name}
              </text>
            );
          })}
        </svg>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div key={`skill-detail-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: skill.color }}
            ></div>
            <div className="flex flex-col text-sm">
              <span className="font-medium dark:text-white">{skill.name}</span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 dark:bg-gray-700">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${skill.value}%`,
                    backgroundColor: skill.color
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 