'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface EventData {
  time: string
  title: string
  description?: string
  tags?: string[]
  source?: string
}

export function CreateTopicDialog({ open, onOpenChange, onSuccess }: CreateTopicDialogProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [title, setTitle] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('请先登录')
        return
      }

      // 创建主题
      const { data: topicData, error: topicError } = await supabase
        .from('timeline_topics')
        .insert({
          user_id: user.id,
          title: title.trim(),
        })
        .select()
        .single()

      if (topicError) {
        setError('创建主题失败: ' + topicError.message)
        return
      }

      // 如果有事件 JSON，解析并创建事件
      if (jsonInput.trim()) {
        try {
          let parsedEvents
          try {
            parsedEvents = JSON.parse(jsonInput)
          } catch (parseError) {
            setError('事件 JSON 格式错误，请检查语法')
            return
          }

          const eventsArray = Array.isArray(parsedEvents) ? parsedEvents : [parsedEvents]
          
          const eventsToInsert = eventsArray.map((event: EventData) => ({
            topic_id: topicData.id,
            user_id: user.id,
            time: event.time || '',
            title: event.title || '',
            description: event.description || null,
            tags: Array.isArray(event.tags) ? event.tags : null,
            source: event.source || null,
          }))

          const { error: eventsError } = await supabase
            .from('timeline_events')
            .insert(eventsToInsert)

          if (eventsError) {
            setError('创建事件失败: ' + eventsError.message)
            return
          }
        } catch (err) {
          setError('处理事件数据失败')
          return
        }
      }

      resetForm()
      onSuccess()
    } catch (err) {
      setError('创建主题失败')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setJsonInput('')
    setError('')
    setActiveTab('basic')
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const exampleJson = [
    {
      time: "2024",
      title: "示例事件",
      description: "这是一个示例事件的描述",
      tags: ["标签1", "标签2"],
      source: "https://example.com"
    }
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新建时间线主题</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">主题名称 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：我的人生轨迹"
              required
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="events">批量导入事件</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p>创建主题后，您可以在主题详情页面添加时间线事件。</p>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">事件 JSON 数据（可选）</Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`支持单个对象或数组，例如：\n${JSON.stringify(exampleJson, null, 2)}`}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-600">
                  可以批量导入事件。时间格式支持：2024、2024-01、2024-01-15 等。
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? '创建中...' : '创建主题'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
