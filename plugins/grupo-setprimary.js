import fs from 'fs'

const PRIMARY_FILE = './database/primary_group.json'

export async function handler(m, { conn, isOwner, isAdmin, args }) {
  if (!m.isGroup) throw 'Este comando solo se puede usar en grupos.'
  if (!isOwner && !isAdmin) throw 'Solo los administradores o el propietario pueden usar este comando.'

  const groupId = m.chat

  // Guarda el ID del grupo como grupo primario
  let data = {}
  if (fs.existsSync(PRIMARY_FILE)) {
    data = JSON.parse(fs.readFileSync(PRIMARY_FILE))
  }

  data.primaryGroup = groupId
  fs.writeFileSync(PRIMARY_FILE, JSON.stringify(data, null, 2))

  await conn.reply(m.chat, 'Este grupo ahora es el grupo primario.', m)
}
handler.help = ['set'];
handler.command = ['set'];
handler.group  = true
handler.owner = true
handler.register = true
handler.tags = ['grupo'];
handler.register = true;

