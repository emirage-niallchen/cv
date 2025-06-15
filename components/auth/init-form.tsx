"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface InitFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

export function InitForm() {
  const [formData, setFormData] = useState<InitFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '初始化失败');
      }
      
      toast.success('管理员账户创建成功');
      window.location.reload(); // 刷新页面以显示登录表单
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '创建失败');
    }
  };

  return (
    <Card className="w-[400px] bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle>初始化管理员账户</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="用户名"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            required
          />
          <Input
            type="password"
            placeholder="密码"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
          />
          <Input
            type="password"
            placeholder="确认密码"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />
          <Input
            type="email"
            placeholder="邮箱（可选）"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            placeholder="姓名（可选）"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <Button type="submit" className="w-full">
            创建账户
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 