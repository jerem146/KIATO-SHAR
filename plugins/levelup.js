import { levelup } from '../lib/levelup.js'

let handler = async (m, { args, text, command }) => {
  if (!text.includes('|')) return m.reply(`Usa el comando así:\n\n*${command} texto|nivel*\nEjemplo: *${command} Felicidades|3*`)
  
  let [teks, lvlStr] = text.split('|')
  teks = teks.trim()
  let level = parseInt(lvlStr.trim())

  if (!teks || isNaN(level)) return m.reply('Texto o nivel inválido.')

  try {
    const img = await levelup(teks, level)
    m.conn.sendFile(m.chat, img, 'levelup.jpg', `Subida de nivel generada para: ${teks}`, m)
  } catch (e) {
    console.error(e)
    m.reply('Error generando imagen. Asegúrate de tener ImageMagick o GM y los archivos necesarios.')
  }
}

handler.command = ['levelup']
handler.help = ['levelup texto|nivel']
handler.tags = ['tools']
export default handler
