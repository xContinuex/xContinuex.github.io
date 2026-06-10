<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../stores/chat.js'

const store = useChatStore()
const text = ref('')
const inputEl = ref(null)

const canSend = computed(() => text.value.trim() && !store.isThinking)

function send() {
  if (!canSend.value) return
  store.sendMessage(text.value.trim())
  text.value = ''
  inputEl.value?.focus()
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function onWindowKeydown(e) {
  // 任意位置按 / 聚焦到输入框
  if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
    e.preventDefault()
    inputEl.value?.focus()
  }
}

onMounted(() => {
  inputEl.value?.focus()
  window.addEventListener('keydown', onWindowKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onWindowKeydown)
})
</script>

<template>
  <footer class="input-bar">
    <input
      ref="inputEl"
      v-model="text"
      type="text"
      :placeholder="store.isThinking ? '小智正在思考...' : '输入消息，回车发送 (按 / 聚焦)'"
      :disabled="store.isThinking"
      @keydown="onKeydown"
      autocomplete="off"
      maxlength="2000"
    />
    <button class="send-btn" :disabled="!canSend" @click="send" title="发送">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  </footer>
</template>

<style scoped>
.input-bar {
  display: flex;
  gap: 10px;
  padding: 12px 16px 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}
@media (prefers-color-scheme: dark) {
  .input-bar { background: rgba(26, 26, 46, 0.6); border-top-color: rgba(255, 255, 255, 0.08); }
}
input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.85);
  color: inherit;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: all 0.2s;
}
input:focus {
  border-color: #4a90e2;
  background: white;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
}
input:disabled { opacity: 0.6; cursor: not-allowed; }
@media (prefers-color-scheme: dark) {
  input { background: rgba(45, 45, 70, 0.6); border-color: rgba(255, 255, 255, 0.1); }
  input:focus { background: rgba(45, 45, 70, 0.9); }
}
.send-btn {
  width: 42px; height: 42px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}
.send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4); }
.send-btn:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; }
</style>
