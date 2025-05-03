import { canLevelUp, xpRange } from '../lib/levelling.js';
import db from '../lib/database.js';
import fetch from 'node-fetch';
import fs from 'fs';
import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        // Identificar usuario
        let mentionedUser = m.mentionedJid?.[0];
        let citedMessage = m.quoted?.sender;
        let who = mentionedUser || citedMessage || m.sender;
        let name = await conn.getName(who);

        // Verificar base de datos
        if (!global.db?.data?.users) {
            return await conn.reply(m.chat, '⚠️ *Error en la base de datos*', m);
        }

        let user = global.db.data.users[who];
        if (!user) {
            return await conn.reply(m.chat, '🚫 *Usuario no encontrado*', m);
        }

        // Calcular niveles
        let { min, xp } = xpRange(user.level, global.multiplier);
        let before = user.level;
        while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

        if (before !== user.level) {
            // Mensaje de levelup con diseño especial
            let levelupTxt = `
ᥫ᭡ *¡Felicidades, ${name}!* ❀
            
*Has subido de nivel* ✨
*${before}* ➔ *${user.level}* [ ${user.role} ]

✰ *Nivel anterior*: ${before}
✦ *Nuevo nivel*: ${user.level}
❖ *Experiencia*: ${user.exp}
➨ *Próximo nivel*: ${xp - user.exp} XP más

> Continúa interactuando para subir más niveles!
            `.trim();

            try {
                // Opción 1: Imagen desde URL (más confiable con axios)
                let imageUrl = 'https://i.imgur.com/3QZz7Xa.jpeg'; // URL alternativa
                let response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                let imageBuffer = Buffer.from(response.data, 'binary');

                await conn.sendMessage(m.chat, {
                    image: imageBuffer,
                    caption: levelupTxt,
                    mentions: [who]
                }, { quoted: m });

                // Mensaje adicional de celebración
                await conn.sendMessage(m.chat, {
                    text: '✨ *¡Nuevo nivel desbloqueado!* ✨\nAhora tienes acceso a más comandos y beneficios.'
                }, { quoted: m });

            } catch (imageError) {
                console.error('Error con imagen:', imageError);
                // Enviar solo texto si falla la imagen
                await conn.reply(m.chat, levelupTxt, m);
            }
        } else {
            // Mostrar estadísticas con diseño especial
            let users = Object.entries(global.db.data.users).map(([jid, data]) => ({ ...data, jid }));
            let sorted = users.sort((a, b) => (b.level || 0) - (a.level || 0));
            let rank = sorted.findIndex(u => u.jid === who) + 1;
            let progress = Math.floor(((user.exp - min) / xp) * 100);

            let statsTxt = `
*「✿」USUARIO* ◢ ${name} ◤

✦ *Nivel*: ${user.level}
✰ *Experiencia*: ${user.exp}
❖ *Rango*: ${user.role}
➨ *Progreso*: ${progress}% (${user.exp - min}/${xp})
# *Posición*: ${rank}° de ${sorted.length}
ᥫ᭡ *Comandos usados*: ${user.commands || 0}
            `.trim();

            await conn.reply(m.chat, statsTxt, m);
        }
    } catch (e) {
        console.error('Error en levelup:', e);
        await conn.reply(m.chat, '🚀 *¡Ups! Error al mostrar tu progreso*', m);
    }
};

handler.help = ['levelup', 'lvl'];
handler.tags = ['rpg'];
handler.command = ['nivel', 'lvl', 'level', 'levelup'];
handler.register = true;
handler.group = true;

export default handler;
