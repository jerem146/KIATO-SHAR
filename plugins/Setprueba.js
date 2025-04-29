import db from '../lib/database.js'

export async function handler(m, { conn, text, isOwner }) {
  if (!isOwner) throw 'Este comando solo puede usarlo el owner.'

  const mentionedJid = m.mentionedJid && m.mentionedJid[0]
  if (!mentionedJid) throw 'Debes mencionar al bot que quieres establecer como principal.\nEjemplo: /setprimary @tuBot'

  if (!db.data) {
    console.error('Base de datos no cargada')
    throw 'Error interno: la base de datos no está disponible.'
  }

  db.data.primaryBot = mentionedJid
  try {
    await db.write()
  } catch (e) {
    console.error('Error al guardar la base de datos:', e)
    throw 'No se pudo guardar la información en la base de datos.'
  }

  await conn.sendMessage(m.chat, {
    text: `✅ Bot principal establecido:\n@${mentionedJid.split('@')[0]}`,
    mentions: [mentionedJid]
  }, { quoted: m })
}

handler.help = ['setprimary']
handler.tags = ['info']
handler.owner = true
handler.command = ['setprimary']

export default handler
