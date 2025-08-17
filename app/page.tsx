import { redirect } from 'next/navigation'

export default function HomePage() {
  // 重定向到API路由，获取动态注入Supabase配置的HTML
  redirect('/api/home')
}
