'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'

export function ConfigStatus() {
  const [configStatus, setConfigStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
    ready: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    ready: false,
  })

  useEffect(() => {
    const checkConfig = () => {
      const supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setConfigStatus({
        supabaseUrl,
        supabaseKey,
        ready: supabaseUrl && supabaseKey,
      })
    }

    checkConfig()
  }, [])

  if (configStatus.ready) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span>配置检查</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Supabase URL:</span>
              {configStatus.supabaseUrl ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Supabase Key:</span>
              {configStatus.supabaseKey ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
            <p className="mb-1">需要在 Vercel 环境变量中配置：</p>
            <code className="block bg-white p-1 rounded text-xs">
              NEXT_PUBLIC_SUPABASE_URL<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open('https://vercel.com/docs/projects/environment-variables', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            查看配置说明
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
