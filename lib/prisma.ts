import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

// 创建Prisma客户端实例
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.MYSQL_DATABASE_URL,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });
};

// 带重试机制的Prisma客户端
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 连接重试函数
const connectWithRetry = async (maxRetries = 3, delay = 2000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All database connection attempts failed');
        throw error;
      }
    }
  }
};

// 初始化连接
connectWithRetry().catch(console.error);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 