import ws from 'ws'
import fetch from 'node-fetch'

async function handler(m, { conn: _envio }) {
  const uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      const jid = conn.user.jid.replace(/[^0-9]/g, '')
      uniqueUsers.set(jid, {
        ...conn.user,
        jid,
        tiempoActivo: conn.tiempoInicio || Date.now() // Marcar el inicio si no existe
      })
    }
  })

  // Limitar a 10 bots
  const botsActivos = Array.from(uniqueUsers.values()).slice(0, 10)

  const message = botsActivos.map((user, index) => {
    const tiempoMs = Date.now() - user.tiempoActivo
    const tiempoActivo = msToTime(tiempoMs)
    return `┌  ☘︎  *${index + 1}* : @${user.jid}
│  ☘︎  *Link* : http://wa.me/${user.jid}
│  ☘︎  *Activo* : ${tiempoActivo}
└  ☘︎  *Nombre* : ${user.name || 'Destiny ☘︎'}\n`
  }).join('\n')

  const responseMessage = botsActivos.length === 0
    ? '*No hay bots activos actualmente.*'
    : `–  *Destiny prueba*\n\n${message.trim()}`

  let img = await (await fetch(`https://files.catbox.moe/r5ziex.jpeg`)).buffer()
  await _envio.sendFile(m.chat, img, 'thumbnail.jpg', responseMessage, m, false, {
    mentions: _envio.parseMention(responseMessage)
  })
}

function msToTime(ms) {
  let h = Math.floor(ms / (1000 * 60 * 60))
  let m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  let s = Math.floor((ms % (1000 * 60)) / 1000)
  return `${h}h ${m}m ${s}s`
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler
