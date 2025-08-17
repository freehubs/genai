'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Plus, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthButton } from '@/components/auth/auth-button'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { CreateTopicDialog } from '@/components/timeline/create-topic-dialog'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type TimelineTopic = Database['public']['Tables']['timeline_topics']['Row']
type TimelineEvent = Database['public']['Tables']['timeline_events']['Row']

export default function TimelinePage() {
  const [topics, setTopics] = useState<TimelineTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<TimelineTopic | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [searchYear, setSearchYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showCreateTopic, setShowCreateTopic] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        loadTopics()
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadTopics()
        } else {
          setTopics([])
          setEvents([])
          setSelectedTopic(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadTopics = async () => {
    const { data, error } = await supabase
      .from('timeline_topics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading topics:', error)
    } else {
      setTopics(data || [])
    }
  }

  const loadEvents = async (topicId: string) => {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('topic_id', topicId)
      .order('time', { ascending: true })

    if (error) {
      console.error('Error loading events:', error)
    } else {
      setEvents(data || [])
    }
  }

  const searchEventsByYear = async (year: string) => {
    if (!year) {
      if (selectedTopic) {
        loadEvents(selectedTopic.id)
      }
      return
    }

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .ilike('time', `%${year}%`)
      .order('time', { ascending: true })

    if (error) {
      console.error('Error searching events:', error)
    } else {
      setEvents(data || [])
    }
  }

  const handleTopicSelect = (topic: TimelineTopic) => {
    setSelectedTopic(topic)
    setSearchYear('')
    loadEvents(topic.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>请先登录</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">您需要登录才能使用时间线功能</p>
            <AuthButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">时间线</h1>
                  <p className="text-sm text-gray-600">管理你的主题与事件</p>
                </div>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">主题</CardTitle>
                  <Button size="sm" onClick={() => setShowCreateTopic(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    新建
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map((topic) => (
                  <motion.button
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTopicSelect(topic)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTopic?.id === topic.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{topic.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(topic.created_at).toLocaleDateString()}
                    </div>
                  </motion.button>
                ))}
                
                {topics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>还没有主题</p>
                    <p className="text-sm">点击"新建"创建第一个主题</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索年份（如：2024）"
                      value={searchYear}
                      onChange={(e) => setSearchYear(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button onClick={() => searchEventsByYear(searchYear)}>
                    搜索
                  </Button>
                  {searchYear && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchYear('')
                        if (selectedTopic) {
                          loadEvents(selectedTopic.id)
                        }
                      }}
                    >
                      清除
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="space-y-6">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-16 text-center">
                            <div className="text-sm font-medium text-blue-600 bg-blue-100 rounded-lg px-2 py-1">
                              {event.time}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-gray-600 mb-3">{event.description}</p>
                            )}
                            <div className="flex items-center space-x-4">
                              {event.tags && event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {event.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {event.source && (
                                <a
                                  href={event.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  来源
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedTopic ? '暂无事件' : '选择一个主题'}
                    </h3>
                    <p className="text-gray-600">
                      {selectedTopic
                        ? '这个主题还没有事件，点击"新建"添加第一个事件'
                        : '从左侧选择一个主题来查看时间线事件'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Topic Dialog */}
      <CreateTopicDialog
        open={showCreateTopic}
        onOpenChange={setShowCreateTopic}
        onSuccess={() => {
          loadTopics()
          setShowCreateTopic(false)
        }}
      />
    </div>
  )
}
