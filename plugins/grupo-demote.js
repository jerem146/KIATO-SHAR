import { makeWASocket } from '@whiskeysockets/baileys'

const conn = makeWASocket({/* tu configuración aquí */})

// Listener global para eliminar mensajes de cambio de admin
conn.ev.on('messages.upsert', async ({ messages }) => {
  for (const m of messages) {
    if (!m.message) continue
    
    // Tipo 29 = admin removido, Tipo 28 = admin promovido
    if (m.messageStubType === 29 || m.messageStubType === 28) {
      try {
        await conn.sendMessage(m.key.remoteJid, { delete: m.key })
        console.log('Mensaje de cambio admin eliminado')
      } catch (e) {
        console.log('Error al eliminar mensaje:', e)
      }
    }
  }
})

// Comando demote para degradar admin
var handler = async (m, { conn, usedPrefix, command, text }) => {
  let emoji = '❌'
  let emoji2 = '✅'

  if (isNaN(text) && !text.match(/@/g)) {
    // No number ni mención válida
  } else if (isNaN(text)) {
    var number = text.split`@`[1]
  } else if (!isNaN(text)) {
    var number = text
  }

  if (!text && !m.quoted)
    return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder degradarlo de administrador.`, m)

  if (number.length > 13 || (number.length < 11 && number.length > 0))
    return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder degradarlo de administrador.`, m)

  try {
    let user = ''
    if (text) {
      user = number + '@s.whatsapp.net'
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
      user = number + '@s.whatsapp.net'
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
    await conn.reply(m.chat, `${emoji2} Fue descartado como admin.`, m)
  } catch (e) {
    console.log('Error en demote:', e)
    await conn.reply(m.chat, `${emoji} No se pudo degradar al usuario.`, m)
  }
}

handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote', 'quitarpene', 'degradar']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler