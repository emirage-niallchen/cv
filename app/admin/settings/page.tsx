"use client";

import { useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');

  const updateTheme = async (newTheme: string) => {
    await fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ theme: newTheme })
    });
  };

  return (
    <div>
      <select 
        value={theme} 
        onChange={(e) => {
          setTheme(e.target.value);
          updateTheme(e.target.value);
        }}
      >
        <option value="light">浅色主题</option>
        <option value="dark">深色主题</option>
      </select>
    </div>
  );
} 

//todo 增加功能，自动生成链接，读取自己的IP，弹出窗口，允许选择tag,然后自动生成