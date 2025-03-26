'use client';

import React, { useEffect, useState } from 'react';

interface StageProps {
  code: string;
  isRunning: boolean;
  onRunComplete: () => void;
}

interface TurtleState {
  x: number;
  y: number;
  angle: number;
}

export default function ScratchStage({ code, isRunning, onRunComplete }: StageProps) {
  const [turtle, setTurtle] = useState<TurtleState>({
    x: 300,
    y: 300,
    angle: 0
  });
  const [log, setLog] = useState<string[]>([]);

  // 当代码或运行状态改变时执行
  useEffect(() => {
    if (isRunning) {
      // 重置状态
      setTurtle({ x: 300, y: 300, angle: 0 });
      setLog([]);
      
      // 延迟一点开始执行
      const timer = setTimeout(() => {
        // 记录执行日志
        setLog(prev => [...prev, "开始执行代码..."]);
        
        if (code.includes("moveForward")) {
          setLog(prev => [...prev, "执行: 向前移动"]);
          setTurtle(prev => ({
            ...prev,
            x: prev.x + 50 * Math.cos(prev.angle * Math.PI / 180),
            y: prev.y + 50 * Math.sin(prev.angle * Math.PI / 180)
          }));
        }
        
        if (code.includes("turnRight")) {
          setLog(prev => [...prev, "执行: 向右转"]);
          setTurtle(prev => ({
            ...prev,
            angle: prev.angle + 90
          }));
        }
        
        if (code.includes("turnLeft")) {
          setLog(prev => [...prev, "执行: 向左转"]);
          setTurtle(prev => ({
            ...prev,
            angle: prev.angle - 90
          }));
        }
        
        if (code.includes("for")) {
          setLog(prev => [...prev, "执行: 循环"]);
        }
        
        // 执行完成
        setTimeout(() => {
          setLog(prev => [...prev, "执行完成!"]);
          onRunComplete();
        }, 1000);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [code, isRunning, onRunComplete]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col h-full">
      <div className="flex-1 relative">
        {/* 简化的舞台，使用普通HTML元素绘制 */}
        <div className="w-full h-full bg-gray-50 relative">
          {/* 网格背景 */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* 小乌龟 */}
          <div 
            className="absolute w-6 h-6 bg-[var(--scratch-blue)] rounded-full border-2 border-gray-800 transition-all duration-500"
            style={{
              left: `${turtle.x - 12}px`,
              top: `${turtle.y - 12}px`,
              transform: `rotate(${turtle.angle}deg)`
            }}
          >
            {/* 乌龟的头部指向 */}
            <div className="absolute top-0 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-black -mt-6 -ml-2"></div>
          </div>
        </div>
      </div>
      
      {/* 执行日志 */}
      <div className="h-32 bg-gray-100 p-2 border-t border-gray-300 overflow-y-auto">
        <h4 className="text-sm font-bold mb-1">执行日志:</h4>
        <div className="text-xs">
          {log.map((entry, index) => (
            <div key={index} className="mb-1">{entry}</div>
          ))}
          {isRunning && log.length === 0 && (
            <div className="text-gray-500">等待执行...</div>
          )}
        </div>
      </div>
    </div>
  );
} 