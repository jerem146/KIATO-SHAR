// plugins/pene.js 
// Créditos a Neykoor
import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, command, mentionedJid }) => {
  // Mensajes para cuando mencionan a alguien
  const mentionMessages = [
    `¿Acaso @${user} quiere *pene*? 😏`,
    `Parece que @${user} anda buscando algo... ¿será *pene*? 🍌`,
    `@${user} ¿te hace falta un poco de *pene* en tu vida?`,
    `¡Alerta! @${user} está solicitando *pene* urgente 🚨`,
    `@${user} recibirá su dosis de *pene* en 3... 2... 1... 💦`
  ];
  
  // Mensajes para cuando no mencionan a nadie
  const soloMessages = [
    `¿Quién anda buscando *pene* por aquí? 😏`,
    `Alguien quiere *pene* pero no se atreve a decirlo... 🍆`,
    `¡tan temprano y pene!🫦 `,
    `¿Será que el grupo quiere *pene*? 🤔`,
    `*Pene* delivery, ¿quién lo pidió? 🚗💨`
  ];
  
  if (mentionedJid && mentionedJid[0]) {
    // Si mencionaron a alguien
    const target = mentionedJid[0];
    const user = target.split('@')[0];
    const randomMsg = mentionMessages[Math.floor(Math.random() * mentionMessages.length)];
    
    await conn.sendMessage(m.chat, { 
      text: randomMsg, 
      mentions: [target] 
    }, { quoted: m });
  } else {
    // Si no mencionaron a nadie
    const randomMsg = soloMessages[Math.floor(Math.random() * soloMessages.length)];
    await conn.reply(m.chat, randomMsg, m);
  }
};

handler.command = handler.help = ['pene'];
handler.tags = ['fun'];
handler.group = true;

export default handler;
