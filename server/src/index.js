import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ===== 中间件 =====
app.use(cors());              // 允许跨域
app.use(express.json());      // 解析 JSON 请求体

// ===== 路由 =====
app.use('/api/chat', chatRouter);

// ===== 健康检查 =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ===== 启动 =====
app.listen(PORT, () => {
  console.log('\n🚀 后端已启动: http://localhost:' + PORT);
  console.log('   测试:  curl http://localhost:' + PORT + '/api/health\n');
});
