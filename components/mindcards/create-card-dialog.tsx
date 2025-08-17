'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

interface CreateCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topicId?: string
  onSuccess: () => void
}

interface CardData {
  title: string
  definition: string
  key_points: string[]
  examples: string[]
  conclusion: string
  tags: string[]
  source: string
}

export function CreateCardDialog({ open, onOpenChange, topicId, onSuccess }: CreateCardDialogProps) {
  const [activeTab, setActiveTab] = useState('form')
  const [jsonInput, setJsonInput] = useState('')
  const [formData, setFormData] = useState<CardData>({
    title: '',
    definition: '',
    key_points: [''],
    examples: [''],
    conclusion: '',
    tags: [''],
    source: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !topicId) return

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('请先登录')
        return
      }

      const cardData = {
        topic_id: topicId,
        user_id: user.id,
        title: formData.title.trim(),
        definition: formData.definition.trim() || null,
        key_points: formData.key_points.filter(p => p.trim()).length > 0 
          ? formData.key_points.filter(p => p.trim()) 
          : null,
        examples: formData.examples.filter(e => e.trim()).length > 0 
          ? formData.examples.filter(e => e.trim()) 
          : null,
        conclusion: formData.conclusion.trim() || null,
        tags: formData.tags.filter(t => t.trim()).length > 0 
          ? formData.tags.filter(t => t.trim()) 
          : null,
        source: formData.source.trim() || null,
      }

      const { error: insertError } = await supabase
        .from('mind_cards')
        .insert(cardData)

      if (insertError) {
        setError('创建卡片失败: ' + insertError.message)
      } else {
        resetForm()
        onSuccess()
      }
    } catch (err) {
      setError('创建卡片失败')
    } finally {
      setLoading(false)
    }
  }

  const handleJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jsonInput.trim() || !topicId) return

    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('请先登录')
        return
      }

      let parsedData
      try {
        parsedData = JSON.parse(jsonInput)
      } catch (parseError) {
        setError('JSON 格式错误，请检查语法')
        setLoading(false)
        return
      }

      // 支持单个对象或数组
      const cardsArray = Array.isArray(parsedData) ? parsedData : [parsedData]
      
      const cardsToInsert = cardsArray.map(card => ({
        topic_id: topicId,
        user_id: user.id,
        title: card.title || '',
        definition: card.definition || null,
        key_points: Array.isArray(card.key_points) ? card.key_points : null,
        examples: Array.isArray(card.examples) ? card.examples : null,
        conclusion: card.conclusion || null,
        tags: Array.isArray(card.tags) ? card.tags : null,
        source: card.source || null,
      }))

      const { error: insertError } = await supabase
        .from('mind_cards')
        .insert(cardsToInsert)

      if (insertError) {
        setError('创建卡片失败: ' + insertError.message)
      } else {
        setJsonInput('')
        onSuccess()
      }
    } catch (err) {
      setError('创建卡片失败')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      definition: '',
      key_points: [''],
      examples: [''],
      conclusion: '',
      tags: [''],
      source: '',
    })
    setJsonInput('')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const updateFormArray = (field: keyof Pick<CardData, 'key_points' | 'examples' | 'tags'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addFormArrayItem = (field: keyof Pick<CardData, 'key_points' | 'examples' | 'tags'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeFormArrayItem = (field: keyof Pick<CardData, 'key_points' | 'examples' | 'tags'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const exampleJson = {
    title: "🧠 第一性原理",
    definition: "🔹 将问题拆解到最基础的不可分要素，再自上而下重建。",
    key_points: [
      "⚡ 要点一：拆解问题到最基本要素。",
      "💡 要点二：不要被现有假设束缚。",
      "🚀 要点三：自上而下重建解决方案。"
    ],
    examples: [
      "🔧 示例一：埃隆·马斯克拆解电池成本。",
      "📈 示例二：创业前分析商业模式基本假设。",
      "📝 示例三：做决策前拆解所有前提条件。"
    ],
    conclusion: "🏆 一句话总结价值或行动建议。",
    tags: ["思维模型", "决策", "创新"],
    source: "https://zh.wikipedia.org/wiki/第一性原理"
  }

  if (!topicId) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新建心智模型卡片</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">表单输入</TabsTrigger>
            <TabsTrigger value="json">JSON 输入</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="例如：🧠 第一性原理"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="definition">定义</Label>
                <Textarea
                  id="definition"
                  value={formData.definition}
                  onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                  placeholder="简洁地定义这个心智模型..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>关键要点</Label>
                {formData.key_points.map((point, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={point}
                      onChange={(e) => updateFormArray('key_points', index, e.target.value)}
                      placeholder={`要点 ${index + 1}`}
                    />
                    {formData.key_points.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFormArrayItem('key_points', index)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormArrayItem('key_points')}
                >
                  添加要点
                </Button>
              </div>

              <div className="space-y-2">
                <Label>应用示例</Label>
                {formData.examples.map((example, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={example}
                      onChange={(e) => updateFormArray('examples', index, e.target.value)}
                      placeholder={`示例 ${index + 1}`}
                    />
                    {formData.examples.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFormArrayItem('examples', index)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormArrayItem('examples')}
                >
                  添加示例
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conclusion">总结</Label>
                <Textarea
                  id="conclusion"
                  value={formData.conclusion}
                  onChange={(e) => setFormData(prev => ({ ...prev, conclusion: e.target.value }))}
                  placeholder="一句话总结价值或行动建议..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>标签</Label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={tag}
                      onChange={(e) => updateFormArray('tags', index, e.target.value)}
                      placeholder={`标签 ${index + 1}`}
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFormArrayItem('tags', index)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormArrayItem('tags')}
                >
                  添加标签
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">来源</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="来源链接或引用..."
                />
              </div>

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
                <Button type="submit" disabled={loading || !formData.title.trim()}>
                  {loading ? '创建中...' : '创建卡片'}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4">
            <form onSubmit={handleJsonSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">JSON 数据</Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`支持单个对象或数组，例如：\n${JSON.stringify(exampleJson, null, 2)}`}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-600">
                  支持单个卡片对象或卡片数组。可以批量导入多张卡片。
                </p>
              </div>

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
                <Button type="submit" disabled={loading || !jsonInput.trim()}>
                  {loading ? '导入中...' : '导入卡片'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
