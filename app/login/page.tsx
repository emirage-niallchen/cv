"use client";

import { useState, useEffect } from 'react';
import { LoginForm } from "@/components/auth/login-form";
import Image from 'next/image';
import { InitForm } from "@/components/auth/init-form";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isInitialSetup, setIsInitialSetup] = useState(false);

  const checkAdminExists = async () => {
    try {
      const response = await fetch('/api/admin/check');
      const data = await response.json();
      setIsInitialSetup(!data.exists);
    } catch (error) {
      console.error('检查管理员失败:', error);
      setIsInitialSetup(true);
    }
  };

  useEffect(() => {
    checkAdminExists();
  }, []);

  const handleLogin = async (formData: FormData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.status === 'success') {
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/admin/dashboard');
      } else {
        alert(data.error || '密码错误');
      }
    } catch (error) {
      alert('登录请求失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pattern">
      <div className="mb-8">
        <Image
          src="/Track-Resume.svg"
          alt="Track Resume Logo"
          width={600}
          height={240}
          priority
        />
      </div>
      {isInitialSetup ? <InitForm /> : <LoginForm onLogin={handleLogin} />}
    </div>
  );
} 