import { Router } from 'express';
import { streamChat } from '../services/deepseek.js';

const router = Router();

// 用一个独特的标记符把流式数据切成一段一段
// 前端只要按这个标记符 split 就行，超稳
const CHUNK_SEP = '<!--CHUNK-->';

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages 必须是非空数组' });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  if (req.socket && req.socket.setNoDelay) {
    req.socket.setNoDelay(true);
  }
  res.flushHeaders?.();

  function emit(payload) {
    // 包装成 HTML 注释，前端用 split + parse 提取
    res.write(payload + CHUNK_SEP);
  }

  console.log('[chat] new request, messages:', messages.length);

  try {
    await streamChat(messages, (delta) => {
      emit(JSON.stringify({ delta }));
    });
    emit(JSON.stringify({ done: true }));
    res.end();
    console.log('[chat] done');
  } catch (err) {
    console.error('[chat] error:', err);
    try {
      emit(JSON.stringify({ error: err.message }));
      emit(JSON.stringify({ done: true }));
      res.end();
    } catch (_) {}
  }
});

export default router;
