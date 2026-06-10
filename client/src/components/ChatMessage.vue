<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  message: { type: Object, required: true }
})

marked.setOptions({ breaks: true, gfm: true })

const html = computed(() => {
  if (props.message.role === 'user') return null
  return marked.parse(props.message.content || '')
})

const time = computed(() => {
  const d = new Date(props.message.timestamp)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div :class="['message', message.role]">
    <div :class="['bubble', message.role === 'user' ? 'user-bubble' : 'bot-bubble']">
      <div v-if="message.role === 'user'" class="text">{{ message.content }}</div>
      <div v-else class="markdown" v-html="html"></div>
      <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<style scoped>
.message { display: flex; max-width: 85%; animation: msgIn 0.3s ease; }
@keyframes msgIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.message.user { align-self: flex-end; }
.message.bot  { align-self: flex-start; }

.bubble {
  padding: 10px 14px 6px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.user-bubble {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border-bottom-right-radius: 4px;
}
.bot-bubble {
  background: rgba(255, 255, 255, 0.92);
  color: #1a1a2e;
  border-bottom-left-radius: 4px;
}
@media (prefers-color-scheme: dark) {
  .bot-bubble { background: rgba(45, 45, 70, 0.92); color: #e2e8f0; }
}
.text { white-space: pre-wrap; }
.markdown :deep(p) { margin: 4px 0; }
.markdown :deep(p:first-child) { margin-top: 0; }
.markdown :deep(p:last-child)  { margin-bottom: 0; }
.markdown :deep(code) {
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 5px;
  border-radius: 3px;
  font-family: "Cascadia Code", Consolas, monospace;
  font-size: 13px;
}
.markdown :deep(pre) {
  background: #1a1a2e;
  color: #e2e8f0;
  padding: 10px 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 6px 0;
}
.markdown :deep(pre code) { background: none; padding: 0; color: inherit; }
.markdown :deep(ul), .markdown :deep(ol) { padding-left: 20px; }
.markdown :deep(a) { color: #4a90e2; text-decoration: underline; }
.markdown :deep(blockquote) {
  border-left: 3px solid #4a90e2;
  padding-left: 10px;
  color: #4a5568;
  margin: 6px 0;
}
.time { font-size: 10px; opacity: 0.6; text-align: right; margin-top: 4px; }
</style>
