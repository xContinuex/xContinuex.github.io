<script setup>
import { useChatStore } from '../stores/chat.js'

const store = useChatStore()
</script>

<template>
  <header class="header">
    <div class="left">
      <div class="avatar">
        <span class="emoji">🤖</span>
        <span class="status-dot"></span>
      </div>
      <div class="info">
        <div class="title">小智</div>
        <div class="subtitle">在线 · DeepSeek 驱动</div>
      </div>
    </div>
    <button
      v-if="store.messages.length > 0"
      class="clear-btn"
      @click="store.clear()"
      title="清空对话"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"></path>
      </svg>
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.95) 0%, rgba(53, 122, 189, 0.95) 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  position: relative;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.emoji {
  font-size: 24px;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #4ade80;
  border: 2px solid white;
  border-radius: 50%;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.subtitle {
  font-size: 12px;
  opacity: 0.85;
}

.clear-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}
</style>
