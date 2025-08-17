import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { ConfigStatus } from '@/components/config-status'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'GenAI Platform - 智能应用集合',
  description: '基于 AI 的应用集合平台，包含时间线管理、心智模型卡片等功能',
  keywords: 'AI, 智能应用, 时间线, 心智模型, 知识管理',
  authors: [{ name: 'GenAI Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <div className="min-h-screen bg-white">
            {children}
          </div>
          <ConfigStatus />
        </ErrorBoundary>
      </body>
    </html>
  )
}
