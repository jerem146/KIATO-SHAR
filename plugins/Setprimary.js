import fs from 'fs'

let handler = async (m, { conn }) => {
  // Limpia el número del sender
  const senderClean = m.sender.replace(/[^0-9]/g, '')

  // Verifica si el sender está en la lista de owners
  const isOwner = global.owner.includes(senderClean)

  if (!isOwner) return m.reply('Este comando solo puede usarlo el owner del bot.')
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.')

  const data = { primaryGroup: m.chat }
  fs.writeFileSync('./config/primaryGroup.json', JSON.stringify(data, null, 2))
  m.reply(`Grupo guardado correctamente como grupo principal:\n*${m.chat}*`)
}

handler.command = ['setprimary']
handler.group = true
export default handler
