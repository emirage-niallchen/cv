import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const label = searchParams.get('label');
    
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
    return NextResponse.json({ error: '获取自定义字段失败' }, { status: 500 });
  }
}
