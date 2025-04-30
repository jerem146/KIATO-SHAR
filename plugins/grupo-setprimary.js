import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'

const PRIMARY_FILE = './database/primary_group.json'
const MAIN_BOT_ID = '573214401313@s.whatsapp.net' // Cambia esto si tu número es otro

export async function handler(m, { conn, isOwner, isAdmin }) {
  if (conn.user?.id !== MAIN_BOT_ID) return // Solo el bot principal puede ejecutar esto

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
handler.register = true
handler.tags = ['grupo']
