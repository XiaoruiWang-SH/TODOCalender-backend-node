# TodoCalendar 后端 - Node.js

[English](README.md) | 中文

一个基于 Node.js、Express 和 TypeScript 构建的强大 TodoCalendar 应用后端 API 服务。该服务提供用户认证、任务管理和日历功能，支持 MySQL 数据库。

## 🚀 功能特性

- **用户认证**: 注册、登录，支持 JWT 令牌认证
- **OAuth2 集成**: Google OAuth2 登录支持
- **任务管理**: 基于日期的任务创建、查询、更新、删除功能
- **数据库集成**: MySQL 数据库连接池支持
- **输入验证**: 全面的请求数据验证
- **容器化部署**: Docker 和 Docker Compose 支持
- **测试框架**: Jest 单元测试框架
- **环境支持**: 开发和生产环境配置

## 🛠 技术栈

- **运行时**: Node.js 22
- **框架**: Express.js 5.x
- **语言**: TypeScript
- **数据库**: MySQL 8.0
- **认证**: JWT + Google OAuth2
- **测试**: Jest
- **包管理器**: pnpm
- **容器化**: Docker

## 📋 环境要求

- Node.js 22 或更高版本
- pnpm 包管理器
- MySQL 8.0
- Docker（可选）

## 🔧 安装部署

### 本地开发

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd TODOCalender-backend-node
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   在 `env/` 目录下创建环境变量文件：
   
   **env/.env.dev**（开发环境）
   ```env
   ENV=dev
   MYSQL_HOST=localhost
   MYSQL_DATABASE=todocalendar_dev
   MYSQL_ROOT_USER=root
   MYSQL_ROOT_PASSWORD=你的root密码
   MYSQL_USER=user
   MYSQL_PASSWORD=你的用户密码
   JWT_SECRET=你的JWT密钥
   GOOGLE_CLIENT_ID=你的Google客户端ID
   GOOGLE_CLIENT_SECRET=你的Google客户端密钥
   FRONTEND_URL=http://localhost:5173
   ```

4. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

### Docker 部署

1. **开发环境**
   ```bash
   ./run.sh dev
   ```

2. **生产环境**
   ```bash
   ./run.sh prod
   ```

应用访问地址：
- 开发环境: `http://localhost:8081`
- 生产环境: `http://localhost:8080`

## 📁 项目结构

```
TODOCalender-backend-node/
├── src/
│   ├── api/                # API 路由处理器
│   │   ├── auth.ts        # 认证路由
│   │   ├── oauth.ts       # OAuth2 路由
│   │   ├── tasks.ts       # 任务管理路由
│   │   └── user.ts        # 用户路由
│   ├── data/
│   │   └── db.ts          # 数据库连接和操作
│   ├── model/
│   │   ├── taskModel.ts   # 任务模型和操作
│   │   └── userModel.ts   # 用户模型和操作
│   ├── app.ts             # Express 应用配置
│   └── utils.ts           # 工具函数和验证
├── __tests__/             # 测试文件
├── env/                   # 环境配置文件
├── docker-compose.yml     # Docker Compose 配置
├── Dockerfile            # Docker 配置
└── run.sh                # 部署脚本
```

## 🔗 API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/user` - 获取当前用户信息
- `POST /api/auth/logout` - 用户登出

### OAuth2
- `GET /api/oauth2/authorize/google` - 发起 Google OAuth2 流程
- `GET /api/oauth2/callback/google` - Google OAuth2 回调

### 任务管理
- `POST /api/tasks/all` - 按日期获取任务列表
- `POST /api/tasks/create` - 创建新任务
- `POST /api/tasks/update/:id` - 更新任务
- `POST /api/tasks/delete/:id` - 删除任务

### 用户管理
- 用户管理路由（占位符）

## 📊 数据库结构

### 用户表
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    providerId VARCHAR(255)
);
```

### 日历表
```sql
CREATE TABLE calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    details VARCHAR(255),
    checked BOOLEAN NOT NULL,
    important BOOLEAN NOT NULL,
    createTime DATETIME NOT NULL,
    expireTime DATETIME,
    updateTime DATETIME NOT NULL,
    createDate DATE NOT NULL,
    userName VARCHAR(255) NOT NULL
);
```

## 🧪 测试

运行所有测试：
```bash
pnpm test
```

测试套件包括：
- 数据库操作测试
- 工具函数测试
- API 接口测试

## 🔐 身份认证

应用支持两种认证方式：

1. **JWT 认证**: 传统的邮箱/密码登录，使用 JWT 令牌
2. **Google OAuth2**: 通过 Google 账户社交登录

JWT 令牌存储在 HTTP-only Cookie 中以确保安全，有效期为 24 小时。

## 🐳 Docker 配置

应用包含完整的 Docker 支持：

- **多阶段构建**: 优化的生产环境镜像
- **健康检查**: MySQL 数据库健康检查
- **资源限制**: CPU 和内存使用限制
- **网络隔离**: 自定义桥接网络
- **数据持久化**: MySQL 数据卷持久化

## 🚀 部署方式

### 开发环境
```bash
./run.sh dev
```

### 生产环境
```bash
./run.sh prod
```

### 手动 Docker 命令
```bash
# 开发环境
ENV_FILE=env/.env.dev docker compose --project-name myapp_dev up --build -d

# 生产环境  
ENV_FILE=env/.env.prod APP_PORT=8080 docker compose --project-name myapp_prod up --build -d
```

## 📝 环境变量

| 变量名 | 描述 | 默认值 | 是否必需 |
|--------|------|---------|----------|
| `ENV` | 环境类型 (dev/prod) | - | 是 |
| `APP_PORT` | 应用端口 | 8081 | 否 |
| `MYSQL_HOST` | MySQL 主机地址 | localhost | 是 |
| `MYSQL_DATABASE` | 数据库名称 | todocalendar_dev | 是 |
| `MYSQL_ROOT_USER` | 根用户名 | root | 是 |
| `MYSQL_ROOT_PASSWORD` | 根用户密码 | - | 是 |
| `MYSQL_USER` | 应用用户名 | user | 是 |
| `MYSQL_PASSWORD` | 应用用户密码 | - | 是 |
| `JWT_SECRET` | JWT 密钥 | - | 是 |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | - | 是 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 | - | 是 |
| `FRONTEND_URL` | 前端应用 URL | http://localhost:5173 | 是 |

## 📄 API 响应格式

所有 API 响应都遵循统一格式：

```json
{
  "result": true,
  "message": "操作成功",
  "data": {
    // 响应数据
  }
}
```

## 🔍 监控运维

查看应用日志：
```bash
# 开发环境
docker compose -p myapp_dev logs -f app

# 生产环境
docker compose -p myapp_prod logs -f app
```

访问 MySQL：
```bash
# 开发环境
docker exec -it myapp_dev-mysql-1 bash

# 生产环境
docker exec -it myapp_prod-mysql-1 bash
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目采用 [MIT 协议](LICENSE) 开源。

## 🆘 故障排除

### 常见问题

1. **数据库连接失败**
   - 确保 MySQL 运行正常且可访问
   - 检查环境变量配置
   - 验证 Docker 网络连通性

2. **认证问题**
   - 验证 JWT_SECRET 是否设置
   - 检查 Google OAuth2 凭据
   - 确保浏览器启用了 Cookie

3. **端口冲突**
   - 检查端口 8080/8081 是否可用
   - 在环境文件中修改 APP_PORT

### 调试模式

在环境文件中设置 `ENV=dev` 启用调试日志。

## 📞 技术支持

如需支持和帮助，请在仓库中提交 issue。