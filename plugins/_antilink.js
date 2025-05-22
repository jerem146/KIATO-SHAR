let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

const prefixes = ['!', '/', '.', '#'];

function parseCommand(text) {
  for (const prefix of prefixes) {
    if (text.startsWith(prefix)) {
      const args = text.slice(prefix.length).trim().split(/\s+/);
      const cmd = args.shift().toLowerCase();
      return { prefix, cmd, args };
    }
  }
  return null;
}

export async function execute(m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup) return;
  if (!isAdmin) return;
  if (!isBotAdmin) return;

  const parsed = parseCommand(m.text || '');
  if (!parsed) return;

  const { cmd, args } = parsed;

  if (cmd === 'antilink') {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
      return await conn.reply(m.chat, `Uso: ${prefixes[0]}antilink on | ${prefixes[0]}antilink off`, m);
    }
    let chat = global.db.data.chats[m.chat] || {};
    if (args[0].toLowerCase() === 'on') {
      chat.antilink = true;
      chat.linkAdvertir = false;
      global.db.data.chats[m.chat] = chat;
      await conn.reply(m.chat, '⚠️ Eliminación automática de links *activada*.', m);
    } else {
      chat.antilink = false;
      global.db.data.chats[m.chat] = chat;
      await conn.reply(m.chat, '⚠️ Eliminación automática de links *desactivada*.', m);
    }
  }

  else if (cmd === 'link') {
    if (!args[0] || args[0].toLowerCase() !== 'advertir' || !args[1] || !['on', 'off'].includes(args[1].toLowerCase())) {
      return await conn.reply(m.chat, `Uso: ${prefixes[0]}link advertir on | ${prefixes[0]}link advertir off`, m);
    }
    let chat = global.db.data.chats[m.chat] || {};
    if (args[1].toLowerCase() === 'on') {
      chat.linkAdvertir = true;
      chat.antilink = false;
      global.db.data.chats[m.chat] = chat;
      await conn.reply(m.chat, '⚠️ Advertencias por links *activadas*.', m);
    } else {
      chat.linkAdvertir = false;
      global.db.data.chats[m.chat] = chat;
      await conn.reply(m.chat, '⚠️ Advertencias por links *desactivadas*.', m);
    }
  }
}

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (!m.isGroup) return;
  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat) return;

  const userId = m.sender;
  const userMention = `@${userId.split('@')[0]}`;

  const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);
  if (!isGroupLink) return;

  if (isBotAdmin) {
    const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
    if (m.text.includes(linkThisGroup)) return;
  }

  if (chat.antilink) {
    try {
      // Eliminar el mensaje con link
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant } });
      // Avisar al grupo
      await conn.sendMessage(m.chat, { text: `⚠️ ${userMention}, no está permitido enviar enlaces aquí.`, mentions: [userId] });
    } catch (e) {
      console.error('Error eliminando mensaje antilink:', e);
    }
  } else if (chat.linkAdvertir) {
    global.db.data.users = global.db.data.users || {};
    global.db.data.users[userId] = global.db.data.users[userId] || {};
    const warnsKey = `warns_${m.chat}`;
    global.db.data.users[userId][warnsKey] = (global.db.data.users[userId][warnsKey] || 0) + 1;

    const warns = global.db.data.users[userId][warnsKey];

    if (warns >= 3) {
      await conn.sendMessage(m.chat, {
        text: `╭─❌ EXPULSIÓN\n├ Usuario: ${userMention}\n├ Motivo: Exceso de enlaces\n├ Conteo: 3/3\n╰ Ha sido eliminado.`,
        mentions: [userId]
      });
      if (isBotAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [userId], 'remove');
      }
      global.db.data.users[userId][warnsKey] = 0;
    } else {
      await conn.sendMessage(m.chat, {
        text: `╭─⚠ ADVERTENCIA\n├ Usuario: ${userMention}\n├ Motivo: Enlace prohibido\n├ Conteo: ${warns}/3\n╰─────────────`,
        mentions: [userId]
      });
    }
  }
  return true;
}