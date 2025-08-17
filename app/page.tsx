'use client'

import { motion } from 'framer-motion'
import { Clock, Brain, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/components/auth/auth-button'

const apps = [
  {
    id: 'timeline',
    title: '时间线',
    description: '管理你的主题与事件，支持多端同步与搜索筛选',
    icon: Clock,
    href: '/timeline',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
  },
  {
    id: 'mindcards',
    title: '心智模型卡片',
    description: '收集和整理心智模型，提升思维能力',
    icon: Brain,
    href: '/mindcards',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    id: 'coming-soon',
    title: '更多应用',
    description: '敬请期待更多智能应用',
    icon: Plus,
    href: '#',
    gradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-50 to-gray-100',
    disabled: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">GenAI Platform</h1>
                <p className="text-sm text-gray-600">智能应用集合</p>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              智能应用
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                集合平台
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              基于现代技术栈构建的应用集合，帮助你更好地管理时间线、整理知识和提升效率
            </p>
          </motion.div>

          {/* Apps Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {apps.map((app, index) => (
              <motion.div key={app.id} variants={itemVariants}>
                <Card className={`bento-card h-full ${app.disabled ? 'opacity-60' : 'hover:scale-105'} transition-all duration-300`}>
                  <CardContent className="p-0">
                    {app.disabled ? (
                      <div className={`h-full bg-gradient-to-br ${app.bgGradient} p-8 rounded-3xl`}>
                        <AppCardContent app={app} />
                      </div>
                    ) : (
                      <Link href={app.href} className="block h-full">
                        <div className={`h-full bg-gradient-to-br ${app.bgGradient} p-8 rounded-3xl hover:shadow-lg transition-all duration-300`}>
                          <AppCardContent app={app} />
                        </div>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">平台特性</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">统一认证</h4>
                <p className="text-gray-600">所有应用共享统一的用户账户系统</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">响应式设计</h4>
                <p className="text-gray-600">完美适配移动端和桌面端</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">可扩展架构</h4>
                <p className="text-gray-600">支持快速添加新的应用模块</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

function AppCardContent({ app }: { app: typeof apps[0] }) {
  const Icon = app.icon
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {!app.disabled && (
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{app.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{app.description}</p>
      </div>
    </div>
  )
}
