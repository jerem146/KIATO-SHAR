import { canLevelUp, xpRange } from '../lib/levelling.js';
import db from '../lib/database.js';
import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        // Obtener información del usuario
        let mentionedUser = m.mentionedJid?.[0];
        let citedMessage = m.quoted?.sender;
        let who = mentionedUser || citedMessage || m.sender;
        let name = await conn.getName(who);

        // Validar base de datos
        if (!global.db?.data?.users) {
            return await conn.reply(m.chat, '⚠️ *Error en la base de datos*', m);
        }

        let user = global.db.data.users[who];
        if (!user) {
            return await conn.reply(m.chat, '🚫 *Usuario no encontrado*', m);
        }

        // Calcular progreso
        let { min, xp } = xpRange(user.level, global.multiplier);
        let progress = Math.floor(((user.exp - min) / xp) * 100);
        
        // Obtener ranking
        let users = Object.entries(global.db.data.users).map(([jid, data]) => ({ ...data, jid }));
        let sorted = users.sort((a, b) => (b.level || 0) - (a.level || 0));
        let rank = sorted.findIndex(u => u.jid === who) + 1;

        // Crear mensaje con el formato exacto solicitado
        let statsMessage = `
*「✿」USUARIO* ◢ ${name} ◤

✦ *Nivel*: ${user.level}
✰ *Experiencia*: ${user.exp}
❖ *Rango*: ${user.role}
➨ *Progreso*: ${progress}% (${user.exp - min}/${xp})
# *Posición*: ${rank}° de ${sorted.length}
ᥫ᭡ *Comandos usados*: ${user.commands || 0}
        `.trim();

        try {
            // Enviar imagen con el texto como pie de foto
            let imageUrl = 'https://files.catbox.moe/53iycc.jpeg'; // Imagen de diseño elegante
            let response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            
            await conn.sendMessage(m.chat, {
                image: Buffer.from(response.data),
                caption: statsMessage,
                mentions: [who]
            }, { quoted: m });

        } catch (imageError) {
            console.error('Error al enviar imagen:', imageError);
            // Enviar solo texto si falla la imagen
            await conn.reply(m.chat, statsMessage, m);
        }

    } catch (e) {
        console.error('Error en el comando level:', e);
        await conn.reply(m.chat, '⚠️ *Error al mostrar las estadísticas*', m);
    }
};

handler.help = ['level', 'lvl'];
handler.tags = ['rpg'];
handler.command = ['nivel', 'lvl', 'level'];
handler.register = true;
handler.group = true;

export default handler;
