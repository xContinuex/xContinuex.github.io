import { defineStore } from 'pinia'
import { streamChat } from '../api/chat.js'

// 兜底：本地关键词回复
const fallback = [
  '嗯嗯，我还在学习中 🤔',
  '这个问题有点难...能换个话题吗？',
  '我假装听懂了 😄',
  '你说啥？我没太明白',
  '有意思！继续说~',
  '哦~ 然后呢？'
]

const keywordReplies = [
  { keys: ['你好', '您好', 'hi', 'hello', '嗨', '哈喽'], responses: ['你好呀！很高兴认识你 😊', '嗨~ 今天过得怎么样？', 'Hello！有什么我能帮你的吗？'] },
  { keys: ['几点', '时间', '现在'], responses: [() => `现在时间是：${new Date().toLocaleTimeString('zh-CN')} ⏰`] },
  { keys: ['笑话'], responses: ['有一天小明问妈妈为什么家里没有WiFi...妈妈说：你爸去网吧了，WiFi跟他走了 🤣', '程序员的三大烦恼：① 写注释 ② 改需求 ③ 找 Bug 💻'] },
  { keys: ['谢谢', '感谢'], responses: ['不客气！能帮到你我很开心 ❤️', '随时为你服务~'] },
  { keys: ['再见', '拜拜', 'bye'], responses: ['再见！有空来聊 👋', '下次见啦，祝你一切顺利！'] }
]

function localReply(text) {
  const lower = text.toLowerCase()
  for (const item of keywordReplies) {
    if (item.keys.some(k => lower.includes(k))) {
      const choice = item.responses[Math.floor(Math.random() * item.responses.length)]
      return typeof choice === 'function' ? choice() : choice
    }
  }
  return fallback[Math.floor(Math.random() * fallback.length)]
}

let idSeq = 0
const nextId = () => `${Date.now()}-${++idSeq}`

// ===== 坑4修复：限制持久化消息条数，避免 localStorage 撑爆 =====
const MAX_MESSAGES = 50  // 最多保留 50 条（约25轮对话）

function scrollToBottom() {
  // 用 rAF 替代 setTimeout(0)，等浏览器下一帧渲染完再滚，更稳
  requestAnimationFrame(() => {
    const el = document.querySelector('.chat-messages')
    if (el) el.scrollTop = el.scrollHeight
  })
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    isThinking: false,
    error: null
  }),

  persist: {
    key: 'chat-bot-messages',
    storage: localStorage,
    pick: ['messages']
  },

  actions: {
    async sendMessage(text) {
      if (!text || !text.trim()) return
      this.error = null

      const userMsg = {
        id: nextId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now()
      }
      this.messages.push(userMsg)

      const botId = nextId()
      this.messages.push({
        id: botId,
        role: 'bot',
        content: '',
        timestamp: Date.now()
      })

      this.isThinking = true
      scrollToBottom()

      const history = this.messages
        .filter(m => m.id !== botId)
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))

      try {
        await streamChat(history, (delta) => {
          // ===== 坑5修复：第一个字到达就关掉"思考中"，避免双气泡 =====
          if (this.isThinking) {
            this.isThinking = false
          }

          // ===== 关键修复：找到 bot 消息，整体替换为新对象 =====
          const idx = this.messages.findIndex(m => m.id === botId)
          if (idx === -1) return
          // 创建一个新对象（不是修改原对象）→ 触发 Vue 响应式
          this.messages[idx] = {
            ...this.messages[idx],
            content: this.messages[idx].content + delta
          }
          scrollToBottom()
        })
      } catch (err) {
        console.error('[chat] error:', err)
        this.error = 'AI 回复失败：' + (err.message || '未知错误') + '（已切换到本地模式）'
        const idx = this.messages.findIndex(m => m.id === botId)
        if (idx !== -1) {
          this.messages[idx] = { ...this.messages[idx], content: localReply(text) }
        }
      } finally {
        this.isThinking = false
        scrollToBottom()
        this._trim()  // 坑4：每次对话结束裁剪一次
      }
    },

    clear() {
      this.messages = []
      this.error = null
    },

    // ===== 坑4修复：手动触发裁剪 =====
    // 每次发送完消息后，限制 messages 总数，防止 localStorage 5MB 限额爆掉
    _trim() {
      if (this.messages.length > MAX_MESSAGES) {
        // 保留最后 MAX_MESSAGES 条
        this.messages = this.messages.slice(-MAX_MESSAGES)
      }
    }
  }
})
