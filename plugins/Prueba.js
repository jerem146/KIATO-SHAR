import fs from 'fs'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const jsonPath = './src/primarygrup.json'
  const botPrincipal = global.mainBotNumber // definido en settings.js

  if (!botPrincipal || conn.user.jid.split('@')[0] !== botPrincipal) {
    return m.reply('✳️ Este comando solo puede usarse desde el bot principal.')
  }

  if (!m.isGroup) {
    return m.reply('✳️ Este comando solo se puede usar en grupos.')
  }

  const isOwner = global.owner.some(([num]) => m.sender.includes(num))
  if (!isOwner) {
    return m.reply('✳️ Este comando solo puede usarlo un Owner del bot.')
  }

  const data = JSON.parse(fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath) : '{}')
  data.id = m.chat

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))
  m.reply('✅ Grupo establecido como principal correctamente.')
}

handler.help = ['setprimary']
handler.tags = ['owner']
handler.command = /^setprimary$/i
handler.owner = true // para que no aparezca en bots secundarios

export default handler
