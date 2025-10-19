# Plugin Marketplace - 完整项目下载

## 📦 项目信息
- **压缩包大小**: 382KB
- **包含内容**: 所有源代码文件
- **排除内容**: node_modules, 构建文件, 日志文件

## 🗂️ 项目结构
```
plugin-marketplace/
├── backend/     # Express + TypeORM + PostgreSQL (端口3000)
├── frontend/    # Vue.js市场界面 (端口3001)  
├── publisher/   # 发布者仪表板 (端口3002)
├── README.md    # 详细项目文档
├── package.json # 根目录配置
└── download.md  # 本下载说明
```

## 📥 下载方式

### 选项1: 直接下载压缩包
文件位置: `/home/z/plugin-marketplace.tar.gz`

### 选项2: 使用命令行下载
```bash
# 如果您有服务器访问权限
scp username@server:/home/z/plugin-marketplace.tar.gz ./
```

## 🚀 使用说明

### 1. 解压项目
```bash
tar -xzf plugin-marketplace.tar.gz
cd plugin-marketplace
```

### 2. 数据库配置
```bash
# 创建PostgreSQL数据库
createdb plugin_marketplace

# 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，配置数据库连接
```

### 3. 安装依赖
```bash
npm run install:all
```

### 4. 启动项目
```bash
# 同时启动所有服务
npm run dev:all

# 或单独启动
npm run dev:backend    # 后端API (3000)
npm run dev:frontend   # 前端市场 (3001)
npm run dev:publisher  # 发布端 (3002)
```

## 🔧 环境要求
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

## 🌐 访问地址
- **API文档**: http://localhost:3000/api-docs
- **市场界面**: http://localhost:3001
- **发布者中心**: http://localhost:3002

## 📚 更多信息
请参考项目根目录的 `README.md` 文件获取详细文档。

---
*生成时间: $(date)*