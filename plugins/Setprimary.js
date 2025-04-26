import fs from 'fs'

let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.')
  if (!m.isGroupAdmin && !m.key.fromMe) return m.reply('Debes ser administrador del grupo.')

  const data = { primaryGroup: m.chat }

  fs.writeFileSync('./config/primaryGroup.json', JSON.stringify(data, null, 2))
  m.reply('Este grupo ha sido establecido como grupo principal.')
}

handler.command = ['setprimary']
handler.group = true
export default handler
