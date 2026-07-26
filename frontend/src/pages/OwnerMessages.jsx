import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ArrowLeft, Send, Loader2, Building2, User, Clock } from 'lucide-react'

const OwnerMessages = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeConv, setActiveConv] = useState(null) // { boarding_id, student_id, student_name, boarding_title }
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const pollRef = useRef(null)

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login')
      return
    }
    fetchInbox()
  }, [user, navigate])

  const fetchInbox = async () => {
    try {
      const res = await axios.get('/api/messages.php?inbox=true')
      if (res.data.success) setConversations(res.data.data)
    } catch (_) {}
    setLoading(false)
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    await loadMessages(conv)
    // Mark as read
    await axios.put(
      `/api/messages.php?boarding_id=${conv.boarding_id}&other_user_id=${conv.student_id}`
    )
    fetchInbox()
  }

  const loadMessages = async (conv) => {
    try {
      const res = await axios.get(
        `/api/messages.php?boarding_id=${conv.boarding_id}&other_user_id=${conv.student_id}`
      )
      if (res.data.success) setMessages(res.data.data)
    } catch (_) {}
  }

  // Poll active conversation
  useEffect(() => {
    if (activeConv) {
      clearInterval(pollRef.current)
      pollRef.current = setInterval(() => loadMessages(activeConv), 3000)
    }
    return () => clearInterval(pollRef.current)
  }, [activeConv])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || !activeConv) return
    setSending(true)
    try {
      const res = await axios.post('/api/messages.php', {
        boarding_id: activeConv.boarding_id,
        receiver_id: activeConv.student_id,
        message: input.trim()
      })
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data])
        setInput('')
        fetchInbox()
      }
    } catch (_) {}
    setSending(false)
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    const diffDays = Math.floor((now - d) / 86400000)
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (diffDays === 1) return 'Yesterday'
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  if (!user || user.role !== 'owner') return null

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
            <p className="text-slate-500 text-sm">Student conversations about your boardings</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6" style={{ height: '65vh' }}>

          {/* ── Conversation List ── */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 px-6 text-center">
                  <MessageCircle className="w-10 h-10 mb-3 opacity-30" />
                  <p className="font-medium text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Students will contact you through your boarding listings.</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <motion.button
                    key={`${conv.boarding_id}-${conv.student_id}`}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    onClick={() => openConversation(conv)}
                    className={`w-full text-left px-5 py-4 border-b border-slate-50 transition-colors ${
                      activeConv?.boarding_id === conv.boarding_id && activeConv?.student_id === conv.student_id
                        ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {conv.student_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="font-semibold text-slate-800 text-sm truncate">{conv.student_name}</p>
                          <p className="text-xs text-slate-400 flex-shrink-0 ml-2">{formatTime(conv.last_message_at)}</p>
                        </div>
                        <p className="text-xs text-indigo-500 font-medium truncate flex items-center gap-1 mb-1">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          {conv.boarding_title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{conv.last_message}</p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="w-5 h-5 bg-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            {!activeConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-semibold text-slate-500">Select a conversation</p>
                <p className="text-sm mt-1">Choose a student from the list to view messages</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                    {activeConv.student_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{activeConv.student_name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {activeConv.boarding_title}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  {messages.map(msg => {
                    const isMe = Number(msg.sender_id) === user.id
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isMe
                            ? 'bg-gradient-to-br from-indigo-500 to-sky-500 text-white rounded-br-md'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md'
                        }`}>
                          <p className="leading-relaxed">{msg.message}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-sky-100' : 'text-slate-400'}`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="px-5 py-4 border-t border-slate-100 flex gap-3 bg-white">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Reply to student..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 text-sm bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-indigo-300 focus:bg-white transition-all placeholder-slate-400"
                  />
                  <motion.button
                    type="submit"
                    disabled={sending || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-3 bg-gradient-to-br from-indigo-500 to-sky-500 text-white rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-md shadow-indigo-200 disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </motion.button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerMessages
