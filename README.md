# Scratch 编程学习平台

一个现代化的 Scratch 编程教育平台，帮助孩子们学习编程并培养创造力。

## 功能特点

- 🎨 直观的可视化编程界面
- 📚 丰富的课程内容
- 👥 互动学习社区
- 🎮 游戏化学习体验
- 🌙 支持深色模式
- 📱 响应式设计

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- React
- Blockly
- Prisma
- PostgreSQL

## 开始使用

1. 克隆仓库
```bash
git clone https://github.com/你的用户名/scratch-web.git
cd scratch-web
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入必要的环境变量
```

4. 启动开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 http://localhost:3000

## 开发指南

### 分支管理

- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于开发环境
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复问题
- `release/*`: 发布分支，用于版本发布

### 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type 类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 代码审查

1. 创建 Pull Request 前确保代码通过所有测试
2. 遵循项目的代码风格指南
3. 提供清晰的 PR 描述
4. 请求至少一个团队成员进行代码审查

## 部署

项目使用 Vercel 进行部署，每次推送到 main 分支都会自动部署。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目负责人：[你的名字]
- 邮箱：[你的邮箱]
- 项目链接：[GitHub 仓库链接]
