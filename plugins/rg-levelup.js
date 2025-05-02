import { canLevelUp, xpRange } from '../lib/levelling.js';
import db from '../lib/database.js';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let mentionedUser = m.mentionedJid && m.mentionedJid[0];
    let citedMessage = m.quoted ? m.quoted.sender : null;
    let who = mentionedUser || citedMessage || m.sender;
    let name = conn.getName(who) || 'Usuario';

    let user = global.db?.data?.users[who];

    if (!user) {
      await conn.sendMessage(m.chat, "No se encontraron datos del usuario.", { quoted: m });
      return;
    }

    let { min, xp } = xpRange(user.level, global.multiplier);

    let before = user.level * 1;
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

    if (before !== user.level) {
      let txt = `ᥫ᭡ Felicidades Has subido de nivel ❀\n\n`;
      txt += `*${before}* ➔ *${user.level}* [ ${user.role} ]\n\n`;
      txt += `• ✰ *Nivel anterior* : ${before}\n`;
      txt += `• ✦ *Nuevos niveles* : ${user.level}\n`;
      txt += `• ❖ *Fecha* : ${new Date().toLocaleString('id-ID')}\n\n`;
      txt += `> ➨ Nota: *Cuanto más interactúes con el Bot, mayor será tu nivel.*`;
      await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

      // Bloque Premium Info
      let pp = 'https://files.catbox.moe/nqw9dm.jpeg';
      let infoPremium = `✨ *levelup Desbloqueado* ✨\n\nHola ${name}, ahora que has subido de nivel, descubre los beneficios especiales que puedes obtener como usuario Destiny.`;

      await conn.sendFile(m.chat, pp, 'premium-info.jpg', infoPremium, m, null, {
        mentions: [m.sender],
        contextInfo: {
          externalAdReply: {
            title: 'Experencia levelup🌱',
            body: `Hola ${name}, descubre tus beneficios`,
            thumbnail: await (await fetch(pp)).buffer(),
            sourceUrl: 'https://whatsapp.com/channel/0029Vb6AROo1noyzTUiHdh1n'
          }
        }
      });

    } else {
      let users = Object.entries(global.db.data.users).map(([key, value]) => ({ ...value, jid: key }));
      let sortedLevel = users.sort((a, b) => (b.level || 0) - (a.level || 0));
      let rank = sortedLevel.findIndex(u => u.jid === who) + 1;

      let txt = `*「✿」Usuario* ◢ ${name} ◤\n\n`;
      txt += `✦ Nivel » *${user.level}*\n`;
      txt += `✰ Experiencia » *${user.exp}*\n`;
      txt += `❖ Rango » ${user.role}\n`;
      txt += `➨ Progreso » *${user.exp - min} => ${xp}* _(${Math.floor(((user.exp - min) / xp) * 100)}%)_\n`;
      txt += `# Puesto » *${rank}* de *${sortedLevel.length}*\n`;
      txt += `❒ Comandos totales » *${user.commands || 0}*`;

      await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
    }

  } catch (e) {
    await conn.reply(m.chat, '🚀 ¡Ups! Algo salió mal al mostrar la levelup. Intenta nuevamente o contacta a un owner.', m);
    console.error('Error en premiuminfo:', e);
  }
};

handler.help = ['levelup', 'lvl @user'];
handler.tags = ['rpg'];
handler.command = ['nivel', 'lvl', 'level', 'levelup'];
handler.register = true;
handler.group = true;

export default handler;
