#!/bin/bash
set -e

# 显示帮助信息
show_help() {
  echo "简历项目Docker部署脚本"
  echo "用法: $0 [选项]"
  echo "选项:"
  echo "  -h, --help     显示帮助信息"
  echo "  -b, --build    构建Docker镜像"
  echo "  -u, --up       启动Docker容器"
  echo "  -d, --down     停止并移除Docker容器"
  echo "  -r, --restart  重启Docker容器"
  echo "  -l, --logs     查看容器日志"
}

# 构建Docker镜像
build_image() {
  echo "构建Docker镜像..."
  docker-compose build
}

# 启动Docker容器
start_containers() {
  echo "启动Docker容器..."
  docker-compose up -d
  echo "容器启动完成，可以通过 http://localhost:3000 访问"
}

# 停止并移除Docker容器
stop_containers() {
  echo "停止并移除Docker容器..."
  docker-compose down
}

# 重启Docker容器
restart_containers() {
  echo "重启Docker容器..."
  docker-compose restart
}

# 查看容器日志
view_logs() {
  echo "查看容器日志..."
  docker-compose logs -f app
}

# 如果没有传入参数，显示帮助信息
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# 处理命令行参数
while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help)
      show_help
      exit 0
      ;;
    -b|--build)
      build_image
      ;;
    -u|--up)
      start_containers
      ;;
    -d|--down)
      stop_containers
      ;;
    -r|--restart)
      restart_containers
      ;;
    -l|--logs)
      view_logs
      ;;
    *)
      echo "未知选项: $1"
      show_help
      exit 1
      ;;
  esac
  shift
done

exit 0 