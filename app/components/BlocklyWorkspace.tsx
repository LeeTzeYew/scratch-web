'use client';

import React, { useState } from 'react';

interface BlocklyWorkspaceProps {
  onCodeChange: (code: string) => void;
}

export default function ScratchBlocklyWorkspace({ onCodeChange }: BlocklyWorkspaceProps) {
  // 模拟代码生成，不使用Blockly
  const handleBlockClick = () => {
    // 生成简单的示例代码
    const sampleCode = `
    // 这是一个示例代码
    moveForward(10);
    turnRight(90);
    moveForward(20);
    turnLeft(45);
    moveForward(15);
    
    for (let i = 0; i < 4; i++) {
      moveForward(5);
      turnRight(90);
    }
    `;
    
    onCodeChange(sampleCode);
  };

  return (
    <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-col h-full p-4 bg-white">
        <h3 className="text-xl font-bold mb-4">积木编程区</h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            className="scratch-block bg-[var(--scratch-green)]"
            onClick={handleBlockClick}
          >
            开始程序
          </button>
          
          <button className="scratch-block bg-[var(--scratch-blue)]">
            向前移动 10 步
          </button>
          
          <button className="scratch-block bg-[var(--scratch-blue)]">
            向右转 90 度
          </button>
          
          <button className="scratch-block bg-[var(--scratch-blue)]">
            向左转 90 度
          </button>
          
          <button className="scratch-block bg-[var(--scratch-purple)]">
            重复 4 次
          </button>
          
          <button className="scratch-block bg-[var(--scratch-orange)]">
            等待 1 秒
          </button>
        </div>
        
        <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-gray-500 text-sm">拖动积木到此处创建程序...</p>
          <p className="mt-4 text-xs text-gray-400">提示：点击任意积木可生成示例代码</p>
        </div>
      </div>
    </div>
  );
} 