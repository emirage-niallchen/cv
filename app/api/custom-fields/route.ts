import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get('label');
    
    // 确保数据库连接
    await prisma.$connect();
    
    const customFields = await prisma.customField.findMany({
      where: {
        isPublished: true,
        ...(label && { label: { contains: label } }),
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    return NextResponse.json(customFields);
  } catch (error) {
    console.error('获取自定义字段失败:', error);
    
    // 检查是否是连接错误
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      return NextResponse.json({ 
        error: '数据库连接失败，请检查网络连接或数据库服务器状态',
        details: 'Connection timeout or server unreachable'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: '获取自定义字段失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    // 不要在这里断开连接，让Prisma管理连接池
    // await prisma.$disconnect();
  }
}
