import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { File ,Tag} from '@prisma/client';
import { File as FileIcon, FileText, FileImage } from "lucide-react";
import { PdfIcon } from '@/components/icons/pdf-icon';
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

/**
 * 根据文件类型返回对应的图标组件
 * @param type 文件的 MIME 类型
 */
export function getFileIcon(type: string) {
  // PDF 文件
  if (type === "application/pdf") return PdfIcon;
  // Word 文档
  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return FileText;
  // PNG、JPEG、JPG、GIF 等图片
  if (
    type === "image/png" ||
    type === "image/jpeg" ||
    type === "image/jpg" ||
    type === "image/gif" ||
    type.startsWith("image/")
  ) return FileImage;
  // 其他类型
  return FileIcon;
} 