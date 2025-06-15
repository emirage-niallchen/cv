import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 清理现有数据
  await prisma.inbox.deleteMany()
  await prisma.project.deleteMany()
  await prisma.tech.deleteMany()
  await prisma.file.deleteMany()

  // 创建一些测试数据
  await prisma.inbox.createMany({
    data: [
      {
        type: 'email',
        value: 'test@example.com',
        description: '测试消息1',
        isRead: false
      },
      {
        type: 'phone',
        value: '13800138000',
        description: '测试消息2',
        isRead: false
      }
    ]
  })

  // ... 其余数据创建保持不变 ...

  console.log('数据库初始化完成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 