"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      } else {
        console.error("登出失败");
      }
    } catch (error) {
      console.error("登出错误:", error);
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="destructive"
    >
      登出
    </Button>
  );
} 