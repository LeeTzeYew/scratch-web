'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 重定向到登录页面，并设置为注册模式
    router.push('/login');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">正在跳转到注册页面...</p>
    </div>
  );
} 