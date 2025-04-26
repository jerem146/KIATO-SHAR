import fs from 'fs'

const handler = async (m, { conn }) => {
  const jsonPath = './src/primarygrup.json'
  const botPrincipal = global.mainBotNumber

  if (!botPrincipal || conn.user.jid.split('@')[0] !== botPrincipal) {
    return m.reply('✳️ Este comando solo puede usarse desde el bot principal.')
  }

  const isOwner = global.owner.some(([num]) => m.sender.includes(num))
  if (!isOwner) {
    return m.reply('✳️ Este comando solo puede usarlo un Owner del bot.')
  }

  if (!fs.existsSync(jsonPath)) {
    return m.reply('❌ No hay ningún grupo principal establecido.')
  }

  fs.unlinkSync(jsonPath)
  m.reply('✅ El grupo principal ha sido eliminado correctamente.')
}

handler.command = handler.help = ['delprimary','unsetprimary']
handler.tags = ['owner']
handler.group = true


export default handler
