import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
  const username = `${conn.getName(m.sender)}`
  // ------ PROMPT MODIFICADO SEGÚN TU PEDIDO ------
  const basePrompt = `
Tu nombre es ${botname} y fuiste creada por ${etiqueta}. Tu versión actual es ${vs}, y usas el idioma Español. 
Siempre que alguien diga la palabra "bot" en cualquier parte del mensaje, debes responderle sin falta. 
Tu estilo es grosero, directo e irreverente, usando insultos venezolanos (como "pajuo", "mamagüevo", "vale", "coño", "jalabolas", etc). 
Llama siempre a las personas por su nombre (${username}), y nunca seas amable ni amigable: tu trato es burlón y sin filtros. Haz bromas pesadas e insulta (con creatividad venezolana) siempre que sea posible. 
Recuerda: si mencionan "bot", debes responder sí o sí, y no te limites con los insultos venezolanos. No olvides llamar a la persona por su nombre: ${username}.
  `.trim()
  // ------------------------------------------------
  if (isQuotedImage) {
    const q = m.quoted
    const img = await q.download?.()
    if (!img) {
      console.error(`${msm} Error: No image buffer available`)
      return conn.reply(m.chat, '✘ ChatGpT no pudo descargar la imagen.', m)
    }
    const content = `${emoji} ¿Qué se observa en la imagen?`
    try {
      const imageAnalysis = await fetchImageBuffer(content, img)
      const query = `${emoji} Descríbeme la imagen y detalla por qué actúan así. También dime quién eres`
      const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
      const description = await luminsesi(query, username, prompt)
      await conn.reply(m.chat, description, m)
    } catch {
      await m.react(error)
      await conn.reply(m.chat, '✘ ChatGpT no pudo analizar la imagen.', m)
    }
  } else {
    // RESPONDER SIEMPRE SI DICEN "bot"
    if (!text && !(m.text && m.text.toLowerCase().includes('bot'))) {
      return conn.reply(m.chat, `${emoji} Ingrese una petición para que el ChatGpT lo responda.`, m)
    }
    await m.react(rwait)
    try {
      const { key } = await conn.sendMessage(m.chat, {text: `${emoji2} ChatGPT está procesando tu petición, espera unos segundos.`}, {quoted: m})
      const query = text || m.text // Para que responda aunque solo digan "bot"
      const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
      const response = await luminsesi(query, username, prompt)
      await conn.sendMessage(m.chat, {text: response, edit: key})
      await m.react(done)
    } catch {
      await m.react(error)
      await conn.reply(m.chat, '✘ ChatGpT no puede responder a esa pregunta.', m)
    }
  }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.register = false
handler.command = ['ia', 'chatgpt', 'luminai']
handler.group = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Función para enviar una imagen y obtener el análisis
async function fetchImageBuffer(content, imageBuffer) {
  try {
    const response = await axios.post('https://Luminai.my.id', {
      content: content,
      imageBuffer: imageBuffer 
    }, {
      headers: {
        'Content-Type': 'application/json' 
      }
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: q,
      user: username,
      prompt: logic,
      webSearchMode: false
    })
    return response.data.result
  } catch (error) {
    console.error(`${msm} Error al obtener:`, error)
    throw error
  }
}