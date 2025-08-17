# GenAI Platform - 智能应用集合平台

基于 Next.js + Supabase 构建的现代化应用集合平台，采用 Apple 风格 + Bento 卡片设计，支持响应式布局和流畅动效。

## ✨ 特性

- 🎨 **Apple 风格设计** - 极简美观的用户界面
- 📱 **响应式布局** - 完美适配移动端和桌面端
- 🎭 **Framer Motion 动效** - 流畅的交互动画
- 🔐 **统一认证系统** - 基于 Supabase Auth 的用户管理
- 🧩 **模块化架构** - 易于扩展新的应用模块
- ⚡ **现代技术栈** - Next.js 14 + TypeScript + TailwindCSS

## 🚀 应用模块

### 📅 时间线应用 (Timeline)
- 创建和管理主题
- 批量导入时间线事件
- 支持灵活的时间粒度（年/月/日）
- 按年份搜索事件
- 标签分类和来源链接

### 🧠 心智模型卡片 (Mind Cards)
- 创建心智模型主题
- 结构化的卡片信息（定义、要点、示例、结论）
- Bento 风格卡片展示
- 标签搜索和筛选
- 卡片详情展开动效

## 🛠 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式框架**: TailwindCSS
- **UI 组件**: shadcn/ui + Radix UI
- **动效库**: Framer Motion
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **部署**: Vercel

## 📦 安装和运行

### 1. 克隆项目

```bash
git clone https://github.com/your-username/genai-platform.git
cd genai-platform
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

复制 `env.example` 为 `.env.local` 并填入你的 Supabase 配置：

```bash
cp env.example .env.local
```

编辑 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 配置 Supabase

#### 4.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 等待数据库初始化完成

#### 4.2 执行数据库 Schema

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/schema.sql` 文件内容。

#### 4.3 配置认证

1. 在 Supabase Dashboard 中进入 Authentication → Providers
2. 启用 GitHub Provider
3. 配置 GitHub OAuth:
   - 在 GitHub Settings → Developer settings → OAuth Apps 创建新应用
   - Homepage URL: `http://localhost:3000` (开发环境)
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - 将 Client ID 和 Client Secret 填入 Supabase

### 5. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🚀 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. 在 Vercel 中导入项目

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 更新 Supabase 认证配置

在 Supabase Dashboard 中更新认证配置：
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

## 📁 项目结构

```
genai-platform/
├── app/                    # Next.js App Router
│   ├── auth/              # 认证相关页面
│   ├── timeline/          # 时间线应用
│   ├── mindcards/         # 心智模型卡片应用
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 可复用组件
│   ├── ui/               # shadcn/ui 组件
│   └── auth/             # 认证组件
├── lib/                  # 工具库
│   ├── supabase/         # Supabase 配置和类型
│   └── utils.ts          # 工具函数
├── supabase/             # 数据库相关
│   └── schema.sql        # 数据库表结构
├── public/               # 静态资源
└── ...配置文件
```

## 🗄 数据库设计

### Timeline 相关表

- `timeline_topics` - 时间线主题
- `timeline_events` - 时间线事件

### Mind Cards 相关表

- `mind_topics` - 心智模型主题
- `mind_cards` - 心智模型卡片

所有表都启用了 RLS (Row Level Security)，确保用户只能访问自己的数据。

## 🎨 设计系统

- **颜色方案**: 基于 TailwindCSS 默认调色板
- **字体**: Inter (Google Fonts)
- **圆角**: 统一使用 `rounded-lg` 和 `rounded-2xl`
- **阴影**: 柔和的 `shadow-sm` 和 `shadow-md`
- **动效**: 使用 Framer Motion 实现页面转场和交互动效

## 🔧 开发指南

### 添加新的应用模块

1. 在 `app/` 目录下创建新的路由文件夹
2. 在 `lib/supabase/types.ts` 中添加对应的数据库类型
3. 在 `supabase/schema.sql` 中添加数据库表结构
4. 在首页 `app/page.tsx` 中添加新的 Bento 卡片入口

### 自定义组件

所有 UI 组件基于 shadcn/ui，可以通过以下命令添加新组件：

```bash
npx shadcn-ui@latest add [component-name]
```

### 样式规范

- 使用 TailwindCSS 类名
- 遵循移动端优先的响应式设计
- 使用 `cn()` 函数合并类名
- 保持组件的可复用性

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 后端即服务
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Framer Motion](https://www.framer.com/motion/) - 动效库