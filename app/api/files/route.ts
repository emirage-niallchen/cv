

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { File ,Tag} from '@prisma/client';

export type FileVO = File&{
  tags: Tag[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll('tags');

    const files = await prisma.file.findMany({
      where: {
        isPublished: true,
        ...(tags.length > 0 && {
          tags: {
            some: {
              tag: { name: { in: tags } }
            }
          }
        }),
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
    });
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('获取文件数据失败:', error);
    return NextResponse.json({ error: '获取文件数据失败' }, { status: 500 });
  }
} 