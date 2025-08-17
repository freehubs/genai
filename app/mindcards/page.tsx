'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Plus, Search, ArrowLeft, Tag, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { AuthButton } from '@/components/auth/auth-button'
import { CreateTopicDialog } from '@/components/mindcards/create-topic-dialog'
import { CreateCardDialog } from '@/components/mindcards/create-card-dialog'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type MindTopic = Database['public']['Tables']['mind_topics']['Row']
type MindCard = Database['public']['Tables']['mind_cards']['Row']

export default function MindCardsPage() {
  const [topics, setTopics] = useState<MindTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<MindTopic | null>(null)
  const [cards, setCards] = useState<MindCard[]>([])
  const [filteredCards, setFilteredCards] = useState<MindCard[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const [showCreateCard, setShowCreateCard] = useState(false)

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
          setCards([])
          setSelectedTopic(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    filterCards()
  }, [cards, searchQuery, selectedTags])

  const loadTopics = async () => {
    const { data, error } = await supabase
      .from('mind_topics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading topics:', error)
    } else {
      setTopics(data || [])
    }
  }

  const loadCards = async (topicId: string) => {
    const { data, error } = await supabase
      .from('mind_cards')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading cards:', error)
    } else {
      setCards(data || [])
      // 提取所有标签
      const tags = new Set<string>()
      data?.forEach(card => {
        card.tags?.forEach(tag => tags.add(tag))
      })
      setAllTags(Array.from(tags).sort())
    }
  }

  const filterCards = () => {
    let filtered = cards

    // 按搜索词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(query) ||
        card.definition?.toLowerCase().includes(query) ||
        card.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 按标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter(card =>
        selectedTags.every(tag => card.tags?.includes(tag))
      )
    }

    setFilteredCards(filtered)
  }

  const handleTopicSelect = (topic: MindTopic) => {
    setSelectedTopic(topic)
    setSearchQuery('')
    setSelectedTags([])
    setExpandedCard(null)
    loadCards(topic.id)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCard(prev => prev === cardId ? null : cardId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
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
            <p className="text-gray-600 mb-4">您需要登录才能使用心智模型卡片功能</p>
            <AuthButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">心智模型卡片</h1>
                  <p className="text-sm text-gray-600">收集和整理心智模型</p>
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
                        ? 'bg-purple-100 text-purple-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{topic.title}</div>
                    {topic.description && (
                      <div className="text-sm text-gray-500 mt-1">{topic.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(topic.created_at).toLocaleDateString()}
                    </div>
                  </motion.button>
                ))}
                
                {topics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>还没有主题</p>
                    <p className="text-sm">点击"新建"创建第一个主题</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTopic ? (
              <>
                {/* Search and Filter Bar */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="搜索卡片标题、定义或标签..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <Button onClick={() => setShowCreateCard(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          新建卡片
                        </Button>
                      </div>
                      
                      {/* Tags Filter */}
                      {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            标签筛选:
                          </span>
                          {allTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                selectedTags.includes(tag)
                                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                          {selectedTags.length > 0 && (
                            <button
                              onClick={() => setSelectedTags([])}
                              className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              清除筛选
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MindCardComponent
                          card={card}
                          isExpanded={expandedCard === card.id}
                          onToggleExpansion={() => toggleCardExpansion(card.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredCards.length === 0 && cards.length > 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的卡片</h3>
                      <p className="text-gray-600">尝试调整搜索条件或标签筛选</p>
                    </CardContent>
                  </Card>
                )}

                {cards.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无卡片</h3>
                      <p className="text-gray-600 mb-4">这个主题还没有心智模型卡片</p>
                      <Button onClick={() => setShowCreateCard(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        创建第一张卡片
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">选择一个主题</h3>
                  <p className="text-gray-600">从左侧选择一个主题来查看心智模型卡片</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateTopicDialog
        open={showCreateTopic}
        onOpenChange={setShowCreateTopic}
        onSuccess={() => {
          loadTopics()
          setShowCreateTopic(false)
        }}
      />
      
      <CreateCardDialog
        open={showCreateCard}
        onOpenChange={setShowCreateCard}
        topicId={selectedTopic?.id}
        onSuccess={() => {
          if (selectedTopic) {
            loadCards(selectedTopic.id)
          }
          setShowCreateCard(false)
        }}
      />
    </div>
  )
}

function MindCardComponent({ 
  card, 
  isExpanded, 
  onToggleExpansion 
}: { 
  card: MindCard
  isExpanded: boolean
  onToggleExpansion: () => void
}) {
  return (
    <Card className="bento-card h-fit hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {card.title}
            </h3>
            <button
              onClick={onToggleExpansion}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Definition */}
          {card.definition && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {card.definition}
            </p>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border-t border-gray-100 pt-4"
              >
                {/* Key Points */}
                {card.key_points && card.key_points.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">关键要点</h4>
                    <ul className="space-y-1">
                      {card.key_points.map((point, index) => (
                        <li key={index} className="text-sm text-gray-600 leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {card.examples && card.examples.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">应用示例</h4>
                    <ul className="space-y-1">
                      {card.examples.map((example, index) => (
                        <li key={index} className="text-sm text-gray-600 leading-relaxed">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conclusion */}
                {card.conclusion && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">总结</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {card.conclusion}
                    </p>
                  </div>
                )}

                {/* Source */}
                {card.source && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">来源:</span>
                    {card.source.startsWith('http') ? (
                      <a
                        href={card.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                      >
                        <span>查看原文</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-600">{card.source}</span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
