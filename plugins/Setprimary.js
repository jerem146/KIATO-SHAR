import fs from 'fs'

let handler = async (m, { conn }) => {
  const thisBotNumber = conn.user.id.replace(/[^0-9]/g, '') // número del bot

  if (thisBotNumber !== global.mainBotNumber) {
    return m.reply('Este comando solo puede usarse desde el bot principal.')
  }

  const senderClean = m.sender.replace(/[^0-9]/g, '')
  const isOwner = global.owner.includes(senderClean)

  if (!isOwner) return m.reply('Este comando solo puede usarlo el owner del bot.')
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.')

  const data = { primaryGroup: m.chat }
  fs.writeFileSync('./config/primaryGroup.json', JSON.stringify(data, null, 2))
  m.reply(`Grupo guardado como principal:\n*${m.chat}*`)
}

handler.command = ['setprimary']
handler.group = true
export default handler
