'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // 登录逻辑
      console.log('登录', { email, password });
      alert('登录成功！实际应用中会重定向到对应的页面');
    } else {
      // 注册逻辑
      console.log('注册', { email, password, username, role });
      alert('注册成功！实际应用中会重定向到登录页面');
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--scratch-blue)] via-[var(--scratch-purple)] to-[var(--scratch-orange)]"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--scratch-blue)] opacity-5 rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--scratch-orange)] opacity-5 rounded-full"></div>
          
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{isLogin ? '欢迎回来' : '创建账号'}</h1>
            <p className="text-gray-600">
              {isLogin ? '登录您的账号继续学习之旅' : '加入我们的交互式编程学习平台'}
            </p>
          </div>
          
          {/* 表单 */}
          <form onSubmit={handleSubmit}>
            {/* 注册时需要用户名 */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  id="username"
                  className="scratch-input"
                  placeholder="请输入您的用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
              <input
                type="email"
                id="email"
                className="scratch-input"
                placeholder="请输入您的电子邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                id="password"
                className="scratch-input"
                placeholder={isLogin ? "请输入您的密码" : "请设置密码（至少8位）"}
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* 注册时选择角色 */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">您是？</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      role === 'student' ? 'border-[var(--scratch-blue)] bg-blue-50' : 'border-gray-300'
                    }`}
                    onClick={() => setRole('student')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role-student" 
                        name="role" 
                        className="mr-2"
                        checked={role === 'student'}
                        onChange={() => setRole('student')}
                      />
                      <label htmlFor="role-student" className="font-medium">学生</label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">我想学习编程</p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      role === 'teacher' ? 'border-[var(--scratch-green)] bg-green-50' : 'border-gray-300'
                    }`}
                    onClick={() => setRole('teacher')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role-teacher" 
                        name="role" 
                        className="mr-2"
                        checked={role === 'teacher'}
                        onChange={() => setRole('teacher')}
                      />
                      <label htmlFor="role-teacher" className="font-medium">教师</label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">我想教授编程</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 登录时的忘记密码链接 */}
            {isLogin && (
              <div className="flex justify-end mb-6">
                <a href="#" className="text-sm text-[var(--scratch-blue)] hover:underline">
                  忘记密码？
                </a>
              </div>
            )}
            
            <button 
              type="submit" 
              className={`w-full py-3 font-bold rounded-full transition-all ${
                isLogin 
                  ? 'bg-[var(--scratch-blue)] text-white hover:bg-blue-600' 
                  : 'bg-[var(--scratch-green)] text-white hover:bg-green-600'
              }`}
            >
              {isLogin ? '登录' : '注册'}
            </button>
          </form>
          
          {/* 切换登录/注册 */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button 
                type="button"
                className="ml-1 text-[var(--scratch-blue)] hover:underline font-medium"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? '立即注册' : '登录'}
              </button>
            </p>
          </div>
          
          {/* 分割线 */}
          <div className="relative flex items-center mt-8">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">或者</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* 社交登录 */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors flex justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H12.7031V13.0516H16.9569C16.7241 14.0743 16.1099 14.9852 15.2407 15.5958V17.6536H17.9564C19.5601 16.1664 20.3081 13.8056 20.3081 10.2303Z" fill="#4285F4"/>
                <path d="M12.7031 20.6262C15.0047 20.6262 16.9571 19.8514 17.9564 17.6536L15.2407 15.5958C14.5034 16.0855 13.6648 16.3516 12.7031 16.3516C10.6089 16.3516 8.83019 14.9458 8.28147 13.0516H5.49121V15.1817C6.48376 18.3746 9.34938 20.6262 12.7031 20.6262Z" fill="#34A853"/>
                <path d="M8.28148 13.0516C8.1399 12.55 8.06244 12.0145 8.06244 11.4634C8.06244 10.9123 8.1399 10.3768 8.28148 9.87512V7.74512H5.49121C4.91991 8.85313 4.59119 10.124 4.59119 11.4634C4.59119 12.8028 4.91991 14.0736 5.49121 15.1816L8.28148 13.0516Z" fill="#FBBC04"/>
                <path d="M12.7031 6.57521C13.9566 6.57521 15.0916 7.03392 15.9629 7.86838L18.3805 5.45081C16.9576 4.11982 14.9634 3.32068 12.7031 3.32068C9.34937 3.32068 6.48376 5.57232 5.49121 8.76517L8.28148 10.8952C8.83019 9.00076 10.609 7.59493 12.7031 7.59493V6.57521Z" fill="#EA4335"/>
              </svg>
            </button>
            
            <button className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors flex justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.8928 0H1.10716C0.495594 0 0 0.495594 0 1.10716V18.8928C0 19.5044 0.495594 20 1.10716 20H10.6369V12.2571H8.08036V9.23214H10.6369V7.01272C10.6369 4.4325 12.2175 3.02083 14.5064 3.02083C15.5997 3.02083 16.532 3.10312 16.7889 3.13996V5.83928H15.1419C13.8453 5.83928 13.5975 6.45982 13.5975 7.36607V9.23214H16.6958L16.3119 12.2571H13.5975V20H18.8928C19.5044 20 20 19.5044 20 18.8928V1.10716C20 0.495594 19.5044 0 18.8928 0Z" fill="#1877F2"/>
              </svg>
            </button>
            
            <button className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors flex justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12.0328C22.5 10.8565 22.4117 9.67422 22.2352 8.5H12V14.2425H17.9883C17.6992 16.1627 16.1758 18.0105 13.8609 19.0059V21.5807H16.6406C18.5016 19.8328 22.5 16.9298 22.5 12.0328Z" fill="#4285F4"/>
                <path d="M12 24.0001C14.7 24.0001 16.9594 22.9565 18.6398 21.5814L15.8602 19.0065C14.7773 19.7448 13.4289 20.1954 12 20.1954C9.13594 20.1954 6.71016 18.202 5.84531 15.5001H2.97188V18.1561C4.73906 21.7682 8.24062 24.0001 12 24.0001Z" fill="#34A853"/>
                <path d="M5.84375 15.5001C5.625 14.7433 5.625 13.9339 5.625 13.1251C5.625 12.3158 5.625 11.507 5.84375 10.7501V8.09412H2.97031C2.02031 9.94843 1.5 11.9845 1.5 13.1251C1.5 15.267 2.02031 17.302 2.97031 19.1564L5.84375 15.5001Z" fill="#FBBC05"/>
                <path d="M12 6.05472C13.3734 6.05472 14.7469 6.55098 15.7953 7.55941L18.2578 5.1188C16.5187 3.46449 14.2687 2.25 12 2.25C8.24062 2.25 4.73906 4.48129 2.97188 8.09409L5.84531 11.75C6.7125 9.03488 9.13594 6.05472 12 6.05472Z" fill="#EA4335"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 