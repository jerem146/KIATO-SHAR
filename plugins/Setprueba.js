// comandos/setprimary.js
import db from '../lib/database.js'

export async function handler(m, { conn, text, isOwner, args }) {
  if (!isOwner) throw 'Este comando solo puede usarlo el owner.'

  const mentionedJid = m.mentionedJid && m.mentionedJid[0]
  if (!mentionedJid) throw 'Debes mencionar al bot que quieres establecer como principal.\nEjemplo: /setprimary @tuBot'

  // Guardar el bot principal en la base de datos
  db.data.primaryBot = mentionedJid

  // Enviar mensaje de confirmación etiquetando al bot
  await conn.sendMessage(m.chat, {
    text: `✅ Bot principal establecido:\n@${mentionedJid.split('@')[0]}`,
    mentions: [mentionedJid]
  }, { quoted: m })
}

handler.command = /^setprimary$/i
handler.owner = true
export default handler
