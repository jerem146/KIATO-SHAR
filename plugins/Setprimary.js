import fs from 'fs'

let handler = async (m, { conn }) => {
  const isOwner = global.owner.includes(m.sender.replace(/[^0-9]/g, ''))

  if (!isOwner) return m.reply('Este comando solo puede usarlo el owner del bot.')
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.')

  const data = { primaryGroup: m.chat }
  fs.writeFileSync('./config/primaryGroup.json', JSON.stringify(data, null, 2))
  m.reply('Este grupo ha sido establecido como grupo principal.')
}

handler.command = ['setprimary']
handler.group = true
export default handler
