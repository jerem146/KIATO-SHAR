import { canLevelUp, xpRange } from '../lib/levelling.js';
import db from '../lib/database.js';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let mentionedUser = m.mentionedJid?.[0];
    let citedMessage = m.quoted?.sender;
    let who = mentionedUser || citedMessage || m.sender;
    let name = await conn.getName(who);

    // Validación más robusta de la base de datos
    if (!global.db?.data?.users) {
      await conn.reply(m.chat, "⚠️ La base de datos no está inicializada correctamente", m);
      return;
    }

    let user = global.db.data.users[who];
    if (!user) {
      await conn.reply(m.chat, "🚫 No se encontraron datos del usuario.", m);
      return;
    }

    let { min, xp } = xpRange(user.level, global.multiplier);
    let before = user.level;

    // Subir de nivel si es posible
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

    if (before !== user.level) {
      // Mensaje de nivel subido
      let txt = `ᥫ᭡ *Felicidades, has subido de nivel* ❀\n\n`;
      txt += `*${before}* ➔ *${user.level}* [ ${user.role} ]\n\n`;
      txt += `• ✰ Nivel anterior : ${before}\n`;
      txt += `• ✦ Nuevo nivel : ${user.level}\n`;
      txt += `• ❖ Fecha : ${new Date().toLocaleString()}\n\n`;
      txt += `> ➨ Nota: Cuanto más interactúes con el bot, mayor será tu nivel.`;

      try {
        // Intentar enviar la imagen primero
        const imageResponse = await fetch('https://files.catbox.moe/53iycc.jpeg');
        if (!imageResponse.ok) throw new Error('No se pudo obtener la imagen');
        
        const imageBuffer = await imageResponse.buffer();
        await conn.sendFile(m.chat, imageBuffer, 'levelup.jpg', 
          `✨ *Levelup desbloqueado* ✨\n\nHola ${name}, ahora que has subido de nivel, descubre los beneficios especiales que puedes obtener como usuario Destiny.`, 
          m);
        
        // Luego enviar el mensaje de texto
        await conn.reply(m.chat, txt, m);
      } catch (imageError) {
        console.error('Error al enviar imagen:', imageError);
        // Si falla la imagen, enviar solo el texto
        await conn.reply(m.chat, txt, m);
      }
    } else {
      // Mostrar stats normales
      let users = Object.entries(global.db.data.users).map(([jid, data]) => ({ ...data, jid }));
      let sorted = users.sort((a, b) => (b.level || 0) - (a.level || 0));
      let rank = sorted.findIndex(u => u.jid === who) + 1;

      let txt = `*「✿」Usuario* ◢ ${name} ◤\n\n`;
      txt += `✦ Nivel » ${user.level}\n`;
      txt += `✰ Experiencia » ${user.exp}\n`;
      txt += `❖ Rango » ${user.role}\n`;
      txt += `➨ Progreso » ${user.exp - min} / ${xp} (${Math.floor(((user.exp - min) / xp) * 100)}%)\n`;
      txt += `# Puesto » ${rank} de ${sorted.length}\n`;
      txt += `❒ Comandos totales » ${user.commands || 0}`;

      await conn.reply(m.chat, txt, m);
    }
  } catch (e) {
    console.error('Error en levelup:', e);
    await conn.reply(m.chat, '🚀 ¡Ups! Hubo un error al mostrar tu progreso. Intenta nuevamente.', m);
  }
};

handler.help = ['levelup', 'lvl @user'];
handler.tags = ['rpg'];
handler.command = ['nivel', 'lvl', 'level', 'levelup'];
handler.register = true;
handler.group = true;

export default handler;
