import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { hash } from 'bcryptjs';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// 创建签名密钥
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const encoder = new TextEncoder();
  return encoder.encode(secret);
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = loginSchema.parse(data);

    const admin = await prisma.admin.findUnique({
      where: { username: validated.username },
    });

    const hashedPassword = await hash(validated.password, 12);


    if (!admin) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const isValid = await compare(validated.password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 使用 jose 生成 token
    const token = await new SignJWT({ 
      id: admin.id,
      username: admin.username 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(getJwtSecretKey());



    const { password: _, ...adminWithoutPassword } = admin;
    const response = NextResponse.json({ 
      user: adminWithoutPassword,
      status: 'success',
      message: '登录成功'
    });

    response.headers.set('X-Login-Success', 'true');


    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}

// 登出接口
export async function DELETE() {
  try {
    const response = NextResponse.json({ 
      status: 'success',
      message: '登出成功' 
    });
    
    response.cookies.delete('token');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { status: 'error', error: '登出失败' },
      { status: 500 }
    );
  }
} 