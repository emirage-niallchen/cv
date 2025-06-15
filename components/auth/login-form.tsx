"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (formData: FormData) => Promise<void>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {


      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      
      if (!response.ok) {
        throw new Error(data.error || '登录失败');
      }
      
      toast.success('登录成功');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : '登录失败');
    }
  };

  return (
    <Card className="w-[400px] bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle>管理员登录</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="用户名"
            required
          />
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="密码"
            required
          />
          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 