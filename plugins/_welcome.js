import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'

  if (chat.welcome) {
    let img
    try {
      let pp = await conn.profilePictureUrl(who, 'image')
      img = await (await fetch(pp)).buffer()
    } catch {
      img = await (await fetch(defaultImage)).buffer()
    }

    const totalMembers = groupMetadata.participants.length
    const welcomeMessage = chat.welcomeMessage || 'Bienvenido/a :'
    const despMessage = chat.despMessage || 'Se Fue😹'

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `┏╼★${textbot}
┋「 Bienvenido 」
┗╼★ 「 ${taguser} 」
 ┋❖ ${welcomeMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Miembros: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> ✐ Puedes usar *#profile* para ver tu perfil.`
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] }, { quoted: estilo })
    } else if (
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
      m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ) {
      let bye = `┏╼★${textbot}
┋「 ADIÓS 👋 」
┗╼★ 「 ${taguser} 」
 ┋❖ ${despMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Miembros: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> > ${global.dev}`
      await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [who] }, { quoted: estilo })
    }
  }

  return true
}