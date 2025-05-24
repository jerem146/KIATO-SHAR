import { createHash } from 'crypto'
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()
  let isAll = false
  let isEnable = chat[type] || false

  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false
  } else {
    const estado = isEnable ? '✓ Activado' : '✗ Desactivado'
    return conn.reply(m.chat, 
`╭━━〔 *Configuración: ${type.toUpperCase()}* 〕━━⬣
┃✦ Para *activar* esta función:
┃   ➤ ${usedPrefix}${command} on
┃
┃✦ Para *desactivarla*:
┃   ➤ ${usedPrefix}${command} off
┃
┃✦ Estado actual: ${estado}
╰━━━━━━━━━━━━━━━━━━⬣`, m)
  }

  const checkPermissions = (grupo = false, admin = false) => {
    if (!m.isGroup && grupo && !isOwner) {
      global.dfail('group', m, conn)
      throw false
    } else if (m.isGroup && admin && !(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
    }
  }

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      checkPermissions(true, true)
      chat.welcome = isEnable
      break

    case 'antilag':
      checkPermissions(true, true)
      chat.antiLag = isEnable
      break

    case 'antiprivado':
    case 'antiprivate':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiPrivate = isEnable
      break

    case 'restrict':
    case 'restringir':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break

    case 'antibot':
    case 'antibots':
      checkPermissions(true, true)
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      checkPermissions(true, true)
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      checkPermissions(true, true)
      chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      checkPermissions(true, true)
      chat.autoresponder = isEnable
      break

    case 'antisubbots':
    case 'antibot2':
      checkPermissions(true, true)
      chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      checkPermissions(true, true)
      chat.modoadmin = isEnable
      break

    case 'reaction':
    case 'reaccion':
      checkPermissions(true, true)
      chat.reaction = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      checkPermissions(true, true)
      chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'alertas':
      checkPermissions(true, true)
      chat.detect = isEnable
      break

    case 'antilink':
      checkPermissions(true, true)
      chat.antiLink = isEnable
      break

    case 'antifake':
      checkPermissions(true, true)
      chat.antifake = isEnable
      break
  }

  chat[type] = isEnable

  const alcance = isAll ? 'a nivel global del bot' : 'en este grupo'
  conn.reply(m.chat,
`╭━━〔 *Cambio aplicado exitosamente* 〕━━⬣
┃✦ Función: *${type.toUpperCase()}*
┃✦ Estado: *${isEnable ? 'Activada ✓' : 'Desactivada ✗'}*
┃✦ Alcance: ${alcance}
╰━━━━━━━━━━━━━━━━━━⬣`, m)
}

handler.help = [
  'welcome', 'bienvenida', 'antilag', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 
  'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 
  'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 
  'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 
  'jadibotmd', 'modejadibot', 'subbots', 'detect', 'alertas', 'antilink', 'antifake'
]

handler.tags = ['nable']
handler.command = [
  'welcome', 'bienvenida', 'antilag', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 
  'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 
  'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 
  'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 
  'jadibotmd', 'modejadibot', 'subbots', 'detect', 'alertas', 'antilink', 'antifake'
]

export default handler