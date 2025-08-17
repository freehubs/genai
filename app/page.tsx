'use client'

import { motion } from 'framer-motion'
import { Clock, Brain, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { AuthButton } from '@/components/auth/auth-button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.8,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">GenAI</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="pt-20 pb-16"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="text-center space-y-6 mb-20">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight tracking-tight">
              智能应用
              <br />
              <span className="font-medium">集合平台</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              基于现代技术栈构建，帮助你更好地管理时间线、整理知识和提升效率
            </p>
          </motion.div>

          {/* App Cards */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Timeline Card */}
            <motion.div variants={cardVariants}>
              <Link href="/timeline" className="block group">
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">时间线</h2>
                        <p className="text-gray-600 max-w-md">
                          管理你的主题与事件，支持多端同步与搜索筛选
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-500 group-hover:text-blue-600 transition-colors">
                      <span className="text-sm font-medium">进入应用</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Mind Cards */}
            <motion.div variants={cardVariants}>
              <Link href="/mindcards" className="block group">
                <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">心智模型卡片</h2>
                        <p className="text-gray-600 max-w-md">
                          收集和整理心智模型，提升思维能力
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-500 group-hover:text-purple-600 transition-colors">
                      <span className="text-sm font-medium">进入应用</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">平台特性</h2>
              <p className="text-gray-600">精心设计的用户体验，让每个功能都触手可及</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={cardVariants} className="group">
                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-white hover:shadow-md">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">统一认证</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    所有应用共享统一的用户账户系统，一次登录，畅享所有功能
                  </p>
                </div>
              </motion.div>

              <motion.div variants={cardVariants} className="group">
                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-white hover:shadow-md">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">响应式设计</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    完美适配移动端和桌面端，无论在哪里都能获得最佳体验
                  </p>
                </div>
              </motion.div>

              <motion.div variants={cardVariants} className="group">
                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-white hover:shadow-md">
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">可扩展架构</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    支持快速添加新的应用模块，让平台随着你的需求不断成长
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Coming Soon */}
          <motion.div variants={itemVariants} className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <span className="text-sm">更多应用开发中</span>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}


