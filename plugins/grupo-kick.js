var handler = async (m, { conn, participants, usedPrefix, command }) => {
    const emojiError = '⚠️';
    const emojiKick = '❌';

    if (!m.mentionedJid?.[0] && !m.quoted) {
        await conn.sendMessage(m.chat, {
            react: {
                text: emojiKick,
                key: m.key
            }
        });
        return conn.reply(m.chat, `${emojiKick} ❀ Debes mencionar a un usuario para poder expulsarlo del grupo.`, m);
    }

    let user = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = (Array.isArray(global.owner) && global.owner.length > 0)
        ? global.owner[0][0] + '@s.whatsapp.net'
        : null;

    if (user === conn.decodeJid(conn.user.id)) {
        await conn.sendMessage(m.chat, {
            react: {
                text: emojiError,
                key: m.key
            }
        });
        return conn.reply(m.chat, `${emojiError} ❀ No puedo eliminar el bot del grupo.`, m);
    }

    if (user === ownerGroup) {
        await conn.sendMessage(m.chat, {
            react: {
                text: emojiError,
                key: m.key
            }
        });
        return conn.reply(m.chat, `${emojiError} ❀ No puedo eliminar al propietario del grupo.`, m);
    }

    if (user === ownerBot) {
        await conn.sendMessage(m.chat, {
            react: {
                text: emojiError,
                key: m.key
            }
        });
        return conn.reply(m.chat, `${emojiError} ❀ No puedo eliminar al propietario del bot.`, m);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    await conn.sendMessage(m.chat, {
        react: {
            text: emojiKick,
            key: m.key
        }
    });

    await conn.reply(m.chat, `${emojiKick} ❀ El usuario fue eliminado del grupo.`, m);
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'sacar', 'fueranegro'];
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler; no 
