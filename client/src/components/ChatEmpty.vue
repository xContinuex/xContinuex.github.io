<script setup>
const suggestions = [
  { icon: '👋', text: '你好', desc: '打个招呼' },
  { icon: '😄', text: '讲个笑话', desc: '轻松一下' },
  { icon: '💡', text: '介绍下你自己', desc: '了解小智' },
  { icon: '🚀', text: 'Vue 3 怎么学？', desc: '问问建议' }
]

function pick(text) {
  window.dispatchEvent(new CustomEvent('suggestion', { detail: text }))
}
</script>

<template>
  <div class="empty">
    <div class="emoji">🤖</div>
    <h2>你好，我是小智</h2>
    <p class="tip">一个由 DeepSeek 驱动的 AI 助手<br>可以问我任何问题，或从下面开始 👇</p>
    <div class="suggestions">
      <button v-for="s in suggestions" :key="s.text" class="card" @click="pick(s.text)">
        <div class="icon">{{ s.icon }}</div>
        <div class="content">
          <div class="text">{{ s.text }}</div>
          <div class="desc">{{ s.desc }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.empty { text-align: center; padding: 40px 16px; animation: fadeUp 0.6s ease; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.emoji { font-size: 64px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2)); }
h2 { font-size: 22px; font-weight: 600; margin-bottom: 8px; }
.tip { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
@media (prefers-color-scheme: dark) { .tip { color: #94a3b8; } }

.suggestions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 400px) { .suggestions { grid-template-columns: 1fr; } }

.card {
  display: flex; align-items: center; gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: inherit;
  transition: all 0.2s;
}
.card:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #4a90e2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}
@media (prefers-color-scheme: dark) {
  .card { background: rgba(45, 45, 70, 0.5); border-color: rgba(255, 255, 255, 0.1); }
  .card:hover { background: rgba(45, 45, 70, 0.8); }
}
.icon { font-size: 24px; }
.content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.text { font-size: 13px; font-weight: 500; }
.desc { font-size: 11px; color: #64748b; }
@media (prefers-color-scheme: dark) { .desc { color: #94a3b8; } }
</style>
