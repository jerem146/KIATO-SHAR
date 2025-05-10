export default {
  command: ['hola'],
  description: 'Saluda, dice el nombre del bot y el nombre del dueño',
  async handler(m, { conn }) {
    // Nombre del bot
    const botName = conn.user.name || 'Akira-bot-MD'
    // Buscar el nombre del dueño desde la configuración global
    let ownerName = 'Desconocido'
    if (global.owner && global.owner.length > 0) {
      // global.owner puede ser algo como: [[numero, 'Nombre'], ...]
      if (Array.isArray(global.owner[0])) {
        ownerName = global.owner[0][1] || 'Desconocido'
      } else if (typeof global.owner[0] === 'string') {
        ownerName = global.ownerName || 'Desconocido'
      }
    }
    // Mensaje de respuesta
    const saludo = `¡Hola ${m.pushName || 'amigo'}! 👋\nMi nombre es *${botName}* y mi dueño es *${ownerName}*.`
    await conn.reply(m.chat, saludo, m)
  }
}