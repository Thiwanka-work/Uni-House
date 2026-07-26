import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { MessageCircle, X, Send, Loader2, ChevronDown } from 'lucide-react'

/**
 * ChatWidget — floating chat bubble for students to message a boarding owner.
 * Props:
 *   boardingId   {number}  — the boarding's ID
 *   ownerId      {number}  — the owner's user ID
 *   ownerName    {string}  — owner's display name
 */
const ChatWidget = ({ boardingId, ownerId, ownerName }) => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const pollRef = useRef(null)

  // Only render for logged-in students
  if (!user || user.role !== 'student') return null

  const fetchMessages = async (markRead = false) => {
    try {
      const res = await axios.get(
        `/api/messages.php?boarding_id=${boardingId}&other_user_id=${ownerId}`
      )
      if (res.data.success) {
        setMessages(res.data.data)
        const myUnread = res.data.data.filter(
          m => m.receiver_id === user.id && m.is_read === '0'
        ).length
        setUnread(myUnread)

        if (markRead && myUnread > 0) {
          await axios.put(
            `/api/messages.php?boarding_id=${boardingId}&other_user_id=${ownerId}`
          )
          setUnread(0)
        }
      }
    } catch (_) {}
  }

  // Start polling when open, stop when closed
  useEffect(() => {
    if (open) {
      fetchMessages(true)
      pollRef.current = setInterval(() => fetchMessages(true), 3000)
    } else {
      clearInterval(pollRef.current)
      // Still poll for unread badge when closed
      fetchMessages(false)
    }
    return () => clearInterval(pollRef.current)
  }, [open])

  // Poll unread count every 10s even when closed
  useEffect(() => {
    fetchMessages(false)
    const closedPoll = setInterval(() => fetchMessages(false), 10000)
    return () => clearInterval(closedPoll)
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setSending(true)
    try {
      const res = await axios.post('/api/messages.php', {
        boarding_id: boardingId,
        receiver_id: ownerId,
        message: input.trim()
      })
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data])
        setInput('')
      }
    } catch (_) {}
    setSending(false)
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 border border-slate-100 overflow-hidden flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                  {ownerName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{ownerName}</p>
                  <p className="text-sky-100 text-xs">Boarding Owner</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <MessageCircle className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">Start the conversation!</p>
                  <p className="text-xs mt-1">Ask about this boarding place.</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = Number(msg.sender_id) === user.id
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-br from-indigo-500 to-sky-500 text-white rounded-br-md'
                          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-md'
                      }`}
                    >
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
            <form onSubmit={sendMessage} className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-indigo-300 focus:bg-white transition-all duration-200 placeholder-slate-400"
              />
              <motion.button
                type="submit"
                disabled={sending || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-sky-500 text-white rounded-2xl flex items-center justify-center shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Toggle Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 bg-gradient-to-br from-indigo-600 to-sky-500 text-white rounded-full shadow-xl shadow-indigo-300/60 flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export default ChatWidget
