import ws from 'ws'
import fetch from 'node-fetch'

async function handler(m, { conn: _envio }) {
  const uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      const jid = conn.user.jid.replace(/[^0-9]/g, '')
      uniqueUsers.set(jid, {
        ...conn.user,
        jid,
        tiempoActivo: conn.uptime || Date.now()
      })
    }
  })

  const botsActivos = Array.from(uniqueUsers.values()).slice(0, 10)
  const totalBots = uniqueUsers.size
  const limite = 21
  const leerMas = String.fromCharCode(8206).repeat(4001)

  let topBot = '╭─────⊷ *Bot con más tiempo activo*\n│ ⚠️ Ningún bot activo\n╰──────────────────'
  if (totalBots > 0) {
    const botMasTiempo = Array.from(uniqueUsers.values()).sort((a, b) => (a.tiempoActivo || 0) - (b.tiempoActivo || 0))[0]
    const tiempoMsTop = Date.now() - botMasTiempo.tiempoActivo
    const tiempoTop = msToTime(tiempoMsTop)
    topBot = `╭─────⊷ *Bot con más tiempo activo*\n│ 👑 @${botMasTiempo.jid}\n│ ⏳ Tiempo: ${tiempoTop}\n╰──────────────────`
  }

  const listaBots = botsActivos.map((user, index) => {
    const tiempoMs = Date.now() - user.tiempoActivo
    const tiempoActivo = msToTime(tiempoMs)
    return `╭─〔 *${index + 1}.* 〕\n│ ☘︎ *Usuario:* @${user.jid}\n│ 📎 *Link:* http://wa.me/${user.jid}\n│ ⏱️ *Activo:* ${tiempoActivo}\n╰──────────────`
  }).join('\n\n')

  const decorado = `
╭━━━〔 𝑺𝒖𝒃-𝑩𝒐𝒕𝒔 𝑨𝒄𝒕𝒊𝒗𝒐𝒔 〕━━━⬣
┃ ✦ *Total:* ${totalBots}
┃ ✦ *Límite:* ${limite}
╰━━━━━━━━━━━━━━━━⬣

${topBot}

${leerMas}

${listaBots}`.trim()

  let img = await (await fetch(`https://files.catbox.moe/r5ziex.jpeg`)).buffer()
  await _envio.sendFile(m.chat, img, 'thumbnail.jpg', decorado, m, false, {
    mentions: _envio.parseMention(decorado)
  })
}

function msToTime(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler
