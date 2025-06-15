FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制package.json和package-lock.json文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 数据库迁移
RUN npx prisma generate

# 构建应用
ENV NODE_ENV production
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# 创建数据存储目录并设置权限
RUN mkdir -p /app/uploads
RUN chown -R nextjs:nodejs /app

# 切换到非root用户
USER nextjs

# 暴露3000端口
EXPOSE 3000

# 设置命令以启动应用
CMD ["node", "server.js"] 