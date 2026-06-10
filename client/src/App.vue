<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useChatStore } from './stores/chat.js'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInput from './components/ChatInput.vue'
import ChatEmpty from './components/ChatEmpty.vue'

const store = useChatStore()

function handleSuggestion(e) {
  if (e.detail) {
    store.sendMessage(e.detail)
  }
}

onMounted(() => {
  window.addEventListener('suggestion', handleSuggestion)
})
onUnmounted(() => {
  window.removeEventListener('suggestion', handleSuggestion)
})
</script>

<template>
  <div class="chat-app">
    <div class="chat-container">
      <ChatHeader />

      <main class="chat-messages" ref="messagesEl">
        <ChatEmpty v-if="store.messages.length === 0" />
        <div v-else class="message-list">
          <ChatMessage
            v-for="msg in store.messages"
            :key="msg.id"
            :message="msg"
          />
        </div>

        <div v-if="store.isThinking" class="message bot thinking">
          <div class="bubble bot-bubble">
            <div class="typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </main>

      <div v-if="store.error" class="error-bar">
        ⚠️ {{ store.error }}
      </div>

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
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.message {
  display: flex;
  max-width: 85%;
  animation: msgIn 0.3s ease;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.message.user { align-self: flex-end; }
.message.bot  { align-self: flex-start; }

.bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.bot-bubble {
  background: rgba(255, 255, 255, 0.92);
  color: #1a1a2e;
  border-bottom-left-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  .bot-bubble {
    background: rgba(45, 45, 70, 0.92);
    color: #e2e8f0;
  }
}

.typing { display: inline-flex; gap: 4px; padding: 4px 0; }
.typing span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30%           { transform: translateY(-4px); opacity: 1; }
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
