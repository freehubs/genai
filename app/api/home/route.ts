import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // 读取static-home.html文件
    const htmlPath = join(process.cwd(), 'public', 'static-home.html')
    let html = readFileSync(htmlPath, 'utf-8')
    
    // 获取环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // 替换占位符
    html = html.replace(
      "const SUPABASE_URL = 'https://your-project.supabase.co'",
      `const SUPABASE_URL = '${supabaseUrl || ''}'`
    )
    html = html.replace(
      "const SUPABASE_ANON_KEY = 'your-anon-key'",
      `const SUPABASE_ANON_KEY = '${supabaseAnonKey || ''}'`
    )
    
    // 返回HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error serving home page:', error)
    return new NextResponse('Error loading page', { status: 500 })
  }
}
