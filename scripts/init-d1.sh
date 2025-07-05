#!/bin/bash

# Cloudflare D1 数据库初始化脚本
# 使用方法: ./scripts/init-d1.sh [数据库名称]
# cd /root/code/nextjsProject/TrackResume/scripts
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查是否安装了 wrangler
check_wrangler() {
    if ! command -v wrangler &> /dev/null; then
        print_error "Wrangler CLI 未安装。请先运行: npm install -g wrangler"
        exit 1
    fi
    print_message "Wrangler CLI 已安装"
}

# 检查是否已登录 Cloudflare
check_login() {
    if ! wrangler whoami &> /dev/null; then
        print_warning "未登录 Cloudflare，正在尝试登录..."
        wrangler login
    fi
    print_message "已登录 Cloudflare"
}

# 创建数据库
create_database() {
    local db_name=$1
    
    print_step "创建 D1 数据库: $db_name"
    
    # 检查数据库是否已存在
    if wrangler d1 list | grep -q "$db_name"; then
        print_warning "数据库 '$db_name' 已存在"
        return 0
    fi
    
    # 创建数据库
    wrangler d1 create "$db_name"
    print_message "数据库 '$db_name' 创建成功"
}

# 执行初始化脚本（在远程数据库上）
init_database() {
    local db_name=$1
    
    print_step "在远程数据库上执行初始化脚本"
    
    if [ ! -f "./scripts/init-d1-database.sql" ]; then
        print_error "初始化脚本文件不存在: ./scripts/init-d1-database.sql"
        exit 1
    fi
    
    # 在远程数据库上执行脚本
    wrangler d1 execute "$db_name" --remote --file=./scripts/init-d1-database.sql
    print_message "远程数据库初始化完成"
}

# 验证数据库结构（在远程数据库上）
verify_database() {
    local db_name=$1
    
    print_step "验证远程数据库结构"
    
    # 获取远程数据库中的表列表
    tables=$(wrangler d1 execute "$db_name" --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%';" --json | jq -r '.[0].results[].name' | sort)
    
    print_message "远程数据库中的表:"
    echo "$tables" | while read -r table; do
        if [ -n "$table" ]; then
            echo "  - $table"
        fi
    done
    
    # 检查关键表是否存在
    expected_tables=("Admin" "Session" "Link" "CustomField" "File" "Location" "Tech" "Tag" "Project" "Page" "Resume")
    
    for table in "${expected_tables[@]}"; do
        if echo "$tables" | grep -q "^$table$"; then
            print_message "✓ 表 '$table' 存在"
        else
            print_warning "⚠ 表 '$table' 不存在"
        fi
    done
}

# 显示配置信息
show_config_info() {
    local db_name=$1
    
    print_step "获取数据库配置信息"
    
    # 获取数据库 ID
    db_info=$(wrangler d1 list --json | jq -r ".[] | select(.name == \"$db_name\")")
    
    if [ -n "$db_info" ]; then
        db_id=$(echo "$db_info" | jq -r '.uuid')
        print_message "数据库名称: $db_name"
        print_message "数据库 ID: $db_id"
        
        echo
        print_message "请在 wrangler.toml 中添加以下配置:"
        echo
        echo "[[d1_databases]]"
        echo "binding = \"DB\""
        echo "database_name = \"$db_name\""
        echo "database_id = \"$db_id\""
        echo
    else
        print_error "无法获取数据库信息"
    fi
}

# 主函数
main() {
    local db_name=${1:-"track_resume"}
    
    echo "=========================================="
    echo "Cloudflare D1 数据库初始化工具"
    echo "=========================================="
    echo
    
    print_message "数据库名称: $db_name"
    echo
    
    # 检查依赖
    check_wrangler
    check_login
    
    # 创建数据库
    create_database "$db_name"
    
    # 初始化远程数据库
    init_database "$db_name"
    
    # 验证远程数据库结构
    verify_database "$db_name"
    
    # 显示配置信息
    show_config_info "$db_name"
    
    echo
    print_message "数据库初始化完成！"
    echo
    print_message "下一步操作:"
    echo "1. 将上述配置添加到 wrangler.toml 文件中"
    echo "2. 更新环境变量 SQLITE_DATABASE_URL"
    echo "3. 运行 wrangler dev 启动开发服务器"
    echo
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [数据库名称]"
    echo
    echo "参数:"
    echo "  数据库名称    可选，默认为 'track_resume'"
    echo
    echo "示例:"
    echo "  $0                    # 使用默认数据库名称"
    echo "  $0 my-resume-db      # 使用自定义数据库名称"
    echo
}

# 检查参数
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# 执行主函数
main "$@" 