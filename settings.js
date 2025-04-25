import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['573154062343', ' Propietario ', true],
  ['5218211111111'],
  ['526631079388'],
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['573154062343'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '1.0.0'
global.nameqr = '𝐃𝐞𝐬𝐭𝐢𝐧𝐲𝐁𝐨𝐭-MD'
global.namebot = '✿◟𝐃𝐞𝐬𝐭𝐢𝐧𝐲-Bσƚ◞✿'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '⪛✰ 𝐃𝐞𝐬𝐭𝐢𝐧𝐲-𝐛𝐨𝐭 ✰⪜'
global.botname = '𝐃𝐞𝐬𝐭𝐢𝐧𝐲-𝐛𝐨𝐭'
global.wm = 'ৎ୭࠭͢𝐃𝐞𝐬𝐭𝐢𝐧𝐲-𝐁𝐨𝐭ⷭ𓆪͟͞ '
global.author = 'Made By https_(S2)'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ https_(S2)'
global.textbot = '𝐃𝐞𝐬𝐭𝐢𝐧𝐲-𝐛𝐨𝐭 • Powered By https_(S2)'
global.etiqueta = 'https_(S2)'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '¥enes'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://files.catbox.moe/fycjd8.jpg'
global.avatar = 'https://files.catbox.moe/pzn79l.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/CDw7hpI30WjCyKFAVLHNhZ'
global.comunidad1 = 'https://chat.whatsapp.com/Ekf7Ge36AthIUiCGIdRHR2'
global.channel = 'https://whatsapp.com/channel/0029Vb6AROo1noyzTUiHdh1n'
global.channel2 = 'https://whatsapp.com/channel/0029Vb6AROo1noyzTUiHdh1n'
global.md = 'https://github.com/https0J/Destiny-Bot'
global.correo = 'https0johan@gmail.com'
global.cn ='https://whatsapp.com/channel/0029Vb6AROo1noyzTUiHdh1n';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363416409380841@newsletter',
}
global.multiplier = 70

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
