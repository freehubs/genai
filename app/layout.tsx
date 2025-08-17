import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { ConfigStatus } from '@/components/config-status'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GenAI Platform - 智能应用集合',
  description: '基于 AI 的应用集合平台，包含时间线管理、心智模型卡片等功能',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {children}
          </div>
          <ConfigStatus />
        </ErrorBoundary>
      </body>
    </html>
  )
}
