# 贡献指南

## 开发流程

### 1. 分支管理
- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于开发环境
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复问题
- `release/*`: 发布分支，用于版本发布

### 2. 开发步骤
1. 从 `develop` 分支创建新的功能分支
```bash
git checkout develop
git pull origin develop
git checkout -b feature/你的功能名称
```

2. 开发完成后提交代码
```bash
git add .
git commit -m "feat: 添加新功能"
git push origin feature/你的功能名称
```

3. 在 GitHub 上创建 Pull Request
   - 选择从功能分支合并到 `develop` 分支
   - 添加详细的描述
   - 请求团队成员审查代码

### 3. 代码规范
- 使用 TypeScript 进行开发
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 提交信息遵循 Conventional Commits 规范

### 4. 提交信息规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

### 5. 代码审查
- 所有代码必须经过至少一名团队成员审查
- 解决所有审查意见后才能合并
- 确保代码符合项目规范

### 6. 发布流程
1. 从 `develop` 创建 `release` 分支
2. 进行测试和修复
3. 合并到 `main` 分支
4. 创建版本标签
5. 合并回 `develop` 分支

## 项目结构
```
scratch-web/
├── app/                # Next.js 应用目录
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面组件
│   └── styles/        # 样式文件
├── public/            # 静态资源
├── prisma/            # 数据库模型
└── types/             # TypeScript 类型定义
```

## 开发环境设置
1. 安装依赖
```bash
npm install
```

2. 设置环境变量
```bash
cp .env.example .env
```

3. 启动开发服务器
```bash
npm run dev
```

## 常见问题
1. 如果遇到依赖问题，尝试删除 `node_modules` 并重新安装
2. 确保本地环境变量配置正确
3. 定期同步主分支的更新

## 联系方式
- 项目负责人：[你的名字]
- 邮箱：[你的邮箱]
- GitHub：[你的 GitHub 主页] 