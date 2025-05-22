import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

const PRIMARY_FILE = './database/primary_group.json'
const MAIN_BOT_NUMBER = '573214401313' // Tu número principal

export async function handler(m, { conn, isOwner, isAdmin }) {
  const currentBotNumber = conn.user?.id?.split('@')[0]?.split(':')[0]
  if (currentBotNumber !== MAIN_BOT_NUMBER) return // Bloquea sub-bots

  if (!m.isGroup) throw 'Este comando solo se puede usar en grupos.'
  if (!isOwner && !isAdmin) throw 'Solo los administradores o el propietario pueden usar este comando.'

  const groupId = m.chat

  // Asegura que la carpeta database exista
  if (!existsSync('./database')) {
    mkdirSync('./database', { recursive: true })
  }

  // Carga o crea el archivo JSON
  let data = {}
  if (existsSync(PRIMARY_FILE)) {
    try {
      const fileContent = readFileSync(PRIMARY_FILE, 'utf-8')
      data = JSON.parse(fileContent)
    } catch (e) {
      console.error('Error al leer o parsear el archivo:', e)
      data = {}
    }
  }

  // Asigna el grupo primario
  data.primaryGroup = groupId

  // Guarda el archivo
  writeFileSync(PRIMARY_FILE, JSON.stringify(data, null, 2))

  await conn.reply(m.chat, 'Este grupo ahora es el grupo primario.', m)
}

handler.help = ['set']
handler.command = ['set']
handler.group = true
handler.owner = true
handler.register = false
handler.tags = ['grupo']

export default handler;
