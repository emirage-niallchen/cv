import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const admin = await prisma.admin.findFirst()
    return NextResponse.json({ exists: !!admin })
  } catch (error) {
    return NextResponse.json(
      { error: '检查管理员失败' },
      { status: 500 }
    )
  }
} 