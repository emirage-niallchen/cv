import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Tech } from '@prisma/client';
import { Tag } from '@prisma/client';

export type TechVO= Tech & {
  tags: Tag[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tags = searchParams.getAll('tags'); // 获取所有tags参数
    
    const techs = await prisma.tech.findMany({
      where: {
        isPublished: true,
        ...(tags.length > 0 && {
          tags: {
            some: {
              tag: {
                name: {
                  in: tags
                }
              }
            }
          }
        }),
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    return NextResponse.json(techs);
  } catch (error) {
    console.error('获取技术栈数据失败:', error);
    return NextResponse.json({ error: '获取技术栈数据失败' }, { status: 500 });
  }
} 