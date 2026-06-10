<script setup>
import { onMounted } from 'vue'
import { useChatStore } from './stores/chat.js'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInput from './components/ChatInput.vue'
import ChatEmpty from './components/ChatEmpty.vue'

const store = useChatStore()

onMounted(() => {
  // 自动聚焦到输入框
  document.querySelector('input')?.focus()
})
</script>

<template>
  <div class="chat-app">
    <!-- 玻璃拟态主容器 -->
    <div class="chat-container">
      <ChatHeader />

      <!-- 消息区 -->
      <main class="chat-messages">
        <ChatEmpty v-if="store.messages.length === 0" />
        <transition-group name="message" tag="div" class="message-list">
          <ChatMessage
            v-for="msg in store.messages"
            :key="msg.id"
            :message="msg"
          />
        </transition-group>

        <!-- 打字中动画 -->
        <div v-if="store.isThinking" class="message bot thinking">
          <div class="bubble bot-bubble">
            <div class="typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </main>

      <!-- 错误提示 -->
      <div v-if="store.error" class="error-bar">
        ⚠️ {{ store.error }}
      </div>

      <!-- 输入区 -->
      <ChatInput />
    </div>
  </div>
</template>

<style scoped>
.chat-app {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.chat-container {
  width: 100%;
  max-width: 520px;
  height: 92vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  overflow: hidden;
}

@media (prefers-color-scheme: dark) {
  .chat-container {
    background: rgba(26, 26, 46, 0.75);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
}

.message-list {
  display: contents;
}

.message-enter-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.error-bar {
  margin: 0 20px 12px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 540px) {
  .chat-app { padding: 0; }
  .chat-container {
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}
</style>
