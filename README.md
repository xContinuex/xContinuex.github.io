# 🤖 聊天小助手 (Vue 3 + DeepSeek)
> 一个使用 Vue 3 + Vite + Pinia 构建的现代聊天界面，调用 DeepSeek 大模型实现真 AI 对话。
## 📁 项目结构
- client/ — 前端 (Vue 3 + Vite)
- server/ — 后端 (Node.js + Express + DeepSeek API)
## �� 本地启动
### 1. 启动后端
\\\ash
cd server
npm install
npm run dev
\\\
后端运行在 http://localhost:3000
### 2. 启动前端
另开一个终端：
\\\ash
cd client
npm install
npm run dev
\\\
前端运行在 http://localhost:5173
## 🔑 配置 DeepSeek API Key
在 \server/.env\ 中填入你的 key（参考 \server/.env.example\）：
\\\
DEEPSEEK_API_KEY=你的key
\\\
**注意：.env 文件不要提交到 Git！**
## 🌐 部署
前端部署到 GitHub Pages，详见部署文档。
