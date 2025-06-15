import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

// 创建用于验证的密钥
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const encoder = new TextEncoder();
  return encoder.encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware check:', {
    path: pathname,
    hasToken: !!token,
    tokenValue: token?.substring(0, 20) + '...'
  });

  // 管理员路由保护
  if (pathname.startsWith('/admin')) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const verified = await jwtVerify(token, getJwtSecretKey());
      console.log('Token verified for admin route:', verified.payload);
      return NextResponse.next();
    } catch (error) {
      console.log('Token verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 如果已登录用户访问登录页，重定向到管理面板
  if (pathname === '/login') {
    if (token) {
      try {
        const verified = await jwtVerify(token, getJwtSecretKey());
        console.log('Token verified for login page:', verified.payload);
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (error) {
        console.log('Login page token verification failed:', error);
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}; 