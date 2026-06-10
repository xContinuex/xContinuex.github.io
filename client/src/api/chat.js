// 后端用的分块标记符（必须和服务端一致）
const CHUNK_SEP = '<!--CHUNK-->';

/**
 * 流式调用后端 /api/chat
 * @param {Array<{role:string, content:string}>} messages
 * @param {(delta:string) => void} onDelta
 * @returns {Promise<void>}
 */
export async function streamChat(messages, onDelta) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`)
  }
  if (!response.body) {
    throw new Error('响应为空')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // 用标记符 split，超稳
    let sepIdx
    while ((sepIdx = buffer.indexOf(CHUNK_SEP)) !== -1) {
      const chunk = buffer.slice(0, sepIdx)
      buffer = buffer.slice(sepIdx + CHUNK_SEP.length)
      if (!chunk) continue
      try {
        const obj = JSON.parse(chunk)
        if (obj.error) throw new Error(obj.error)
        if (obj.done) return
        if (obj.delta) onDelta(obj.delta)
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.warn('[chat] parse skip:', chunk.slice(0, 50))
          continue
        }
        throw e
      }
    }
  }

  // 收尾：如果 buffer 还有残留，解析一次
  if (buffer.trim()) {
    try {
      const obj = JSON.parse(buffer)
      if (obj.delta) onDelta(obj.delta)
    } catch (_) {}
  }
}
