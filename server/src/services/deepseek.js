import OpenAI from 'openai';

// 初始化客户端
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

/**
 * 流式调用 DeepSeek
 * @param {Array<{role:string, content:string}>} messages
 * @param {(delta:string) => void} onDelta
 */
export async function streamChat(messages, onDelta) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY 未配置。请在 server/.env 中填入你的 key。');
  }

  // 系统提示词：让 AI 知道自己是谁
  const systemMsg = {
    role: 'system',
    content: '你是「小智」，一个友好、简洁、有点幽默感的 AI 聊天助手。请用中文回复，回复不要太长，保持自然对话感。可以用 markdown 格式。'
  };

  const stream = await client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [systemMsg, ...messages],
    stream: true,
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices && chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content;
    if (delta) onDelta(delta);
  }
}
