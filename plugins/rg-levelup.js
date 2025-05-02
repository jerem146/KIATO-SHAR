import { canLevelUp, xpRange } from '../lib/levelling.js';
import db from '../lib/database.js';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let mentionedUser = m.mentionedJid?.[0];
    let citedMessage = m.quoted?.sender;
    let who = mentionedUser || citedMessage || m.sender;
    let name = await conn.getName(who);

    let user = global.db?.data?.users[who];
    if (!user) {
      await conn.sendMessage(m.chat, { text: "No se encontraron datos del usuario." }, { quoted: m });
      return;
    }

    let { min, xp } = xpRange(user.level, global.multiplier);
    let before = user.level;

    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

    if (before !== user.level) {
      // Nivel subido
      let txt = `ᥫ᭡ *Felicidades, has subido de nivel* ❀\n\n`;
      txt += `*${before}* ➔ *${user.level}* [ ${user.role} ]\n\n`;
      txt += `• ✰ *Nivel anterior* : ${before}\n`;
      txt += `• ✦ *Nuevos niveles* : ${user.level}\n`;
      txt += `• ❖ *Fecha* : ${new Date().toLocaleString('es-ES')}\n\n`;
      txt += `> ➨ Nota: *Cuanto más interactúes con el bot, mayor será tu nivel.*`;

      await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

      // Imagen y mensaje premium
      const imgUrl = 'https://files.catbox.moe/53iycc.jpeg';
      const thumbnail = await (await fetch(imgUrl)).buffer();

      await conn.sendMessage(m.chat, {
        image: { url: imgUrl },
        caption: `✨ *Levelup desbloqueado* ✨\n\nHola ${name}, ahora que has subido de nivel, descubre los beneficios especiales que puedes obtener como usuario Destiny.`,
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: 'Experiencia Level Up 🌱',
            body: `Hola ${name}, descubre tus beneficios`,
            thumbnail,
            sourceUrl: 'https://whatsapp.com/channel/0029Vb6AROo1noyzTUiHdh1n',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }, { quoted: m });

    } else {
      // No subió de nivel, solo mostrar stats
      let users = Object.entries(global.db.data.users).map(([jid, data]) => ({ ...data, jid }));
      let sorted = users.sort((a, b) => (b.level || 0) - (a.level || 0));
      let rank = sorted.findIndex(u => u.jid === who) + 1;

      let txt = `*「✿」Usuario* ◢ ${name} ◤\n\n`;
      txt += `✦ Nivel » *${user.level}*\n`;
      txt += `✰ Experiencia » *${user.exp}*\n`;
      txt += `❖ Rango » ${user.role}\n`;
      txt += `➨ Progreso » *${user.exp - min} => ${xp}* _(${Math.floor(((user.exp - min) / xp) * 100)}%)_\n`;
      txt += `# Puesto » *${rank}* de *${sorted.length}*\n`;
      txt += `❒ Comandos totales » *${user.commands || 0}*`;

      await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
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
