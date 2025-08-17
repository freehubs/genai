'use client'

import { motion } from 'framer-motion'
import { Clock, Brain, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/components/auth/auth-button'



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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="leading-tight">
                <span className="block text-lg md:text-xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  GenAI Platform
                </span>
                <span className="block text-xs md:text-sm text-gray-600">智能应用集合</span>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-20"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                智能应用
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  集合平台
                </span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                基于现代技术栈构建的应用集合，帮助你更好地管理时间线、整理知识和提升效率
              </p>
            </div>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-fr"
            style={{ gridTemplateRows: 'repeat(3, minmax(200px, auto))' }}
          >
            {/* Timeline App - Large */}
            <motion.div variants={itemVariants} className="col-span-12 md:col-span-8 row-span-2">
              <Link href="/timeline" className="block h-full">
                <div className="h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Clock className="w-8 h-8" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold">时间线</h3>
                      <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                        管理你的主题与事件，支持多端同步与搜索筛选
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Mind Cards App - Medium */}
            <motion.div variants={itemVariants} className="col-span-12 md:col-span-4 row-span-2">
              <Link href="/mindcards" className="block h-full">
                <div className="h-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Brain className="w-8 h-8" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">心智模型卡片</h3>
                      <p className="text-purple-100 text-base leading-relaxed">
                        收集和整理心智模型，提升思维能力
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Coming Soon - Small */}
            <motion.div variants={itemVariants} className="col-span-12 md:col-span-6 row-span-1">
              <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 flex items-center justify-center group">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">更多应用</h3>
                    <p className="text-sm text-gray-500">敬请期待</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Grid - Small */}
            <motion.div variants={itemVariants} className="col-span-12 md:col-span-6 row-span-1">
              <div className="h-full grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-emerald-300 rounded-xl flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h4 className="text-sm font-semibold text-emerald-800">统一认证</h4>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-amber-300 rounded-xl flex items-center justify-center mb-2">
                    <Brain className="w-5 h-5 text-amber-700" />
                  </div>
                  <h4 className="text-sm font-semibold text-amber-800">响应式设计</h4>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div variants={itemVariants} className="text-center space-y-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">平台特性</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                精心设计的用户体验，让每个功能都触手可及
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">统一认证</h4>
                <p className="text-gray-600 leading-relaxed">所有应用共享统一的用户账户系统，一次登录，畅享所有功能</p>
              </div>
              <div className="group p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">响应式设计</h4>
                <p className="text-gray-600 leading-relaxed">完美适配移动端和桌面端，无论在哪里都能获得最佳体验</p>
              </div>
              <div className="group p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">可扩展架构</h4>
                <p className="text-gray-600 leading-relaxed">支持快速添加新的应用模块，让平台随着你的需求不断成长</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}


