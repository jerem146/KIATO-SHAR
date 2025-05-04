var handler = async (m, { conn, participants, usedPrefix, command }) => {
    const emoji = '❌';
    const emoji2 = '⚠️';

    if (!m.mentionedJid?.[0] && !m.quoted) {
        return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder expulsarlo del grupo.`, m);
    }

    let user = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = (Array.isArray(global.owner) && global.owner.length > 0)
        ? global.owner[0][0] + '@s.whatsapp.net'
        : null;

    if (user === conn.decodeJid(conn.user.id)) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar el bot del grupo.`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del grupo.`, m);
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del bot.`, m);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    // conn.reply(`${suitag}@s.whatsapp.net`, `${emoji} Un Admin Acabo De Eliminar Un Usuario En El Grupo:\n> ${groupMetadata.subject}.`, m, rcanal);
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'sacar', 'fueranegro'];
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler;
