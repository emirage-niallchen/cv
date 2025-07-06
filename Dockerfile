FROM node:20.11.1-alpine AS base
# RUN apk update && apk upgrade --no-cache

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制package.json和package-lock.json文件
COPY package.json package-lock.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm config set proxy http://192.168.0.103:48246 && \
    npm config set https-proxy http://192.168.0.103:48246

ENV NPM_CONFIG_CACHE=/app/.npm NPM_CONFIG_PREFER_OFFLINE=true NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false 

# 安装依赖（使用并行安装和缓存）
RUN npm install --prefer-offline --no-audit --no-fund --loglevel=error

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置网络代理
ENV HTTP_PROXY=http://192.168.0.103:48246
ENV HTTPS_PROXY=http://192.168.0.103:48246

# 生成Prisma客户端并初始化数据库
RUN npx prisma generate --schema=./prisma/schema.prisma

# 不要向Vercel发送消息
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物和必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

# 创建数据存储目录并设置权限
RUN mkdir -p /app/public/uploads /app/public/project
RUN chown -R nextjs:nodejs /app

# 切换到非root用户
USER nextjs

# 暴露3000端口
EXPOSE 3000

LABEL author="Artithm" author_email="admin@artithm.com" author_url="https://artithm.com" author_github="https://github.com/emirage-niallchen"

ENV PORT=3000 HOSTNAME=0.0.0.0

# 设置命令以启动应用
CMD ["node", "server.js"] 