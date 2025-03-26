'use client';

import React from 'react';

export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-80" />
      
      {/* 动态渐变球 */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-[var(--scratch-blue)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-[var(--scratch-orange)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[var(--scratch-green)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      <div className="absolute -bottom-8 right-20 w-72 h-72 bg-[var(--scratch-purple)] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000" />
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25 dark:bg-[size:3rem_3rem]" />
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .bg-grid-slate-100 {
          background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px),
                          linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
        .bg-grid-slate-700 {
          background-image: linear-gradient(to right, #334155 1px, transparent 1px),
                          linear-gradient(to bottom, #334155 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
} 