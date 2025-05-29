/*
- tagall mejorado por Angel-OFC & refinado por ChatGPT
- Etiqueta a todos los miembros con un diseño elegante
*/

const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const botname = 'KIATO-BOT'; // Puedes ajustar esto a tu nombre de bot dinámico si lo necesitas
  const vs = '𝐊𝐈𝐀𝐓𝐎-𝐁𝐎𝐓'; // Estilo decorativo del nombre del bot
  const mensaje = args.join(' ') || '¡Despierten todos, hay noticias!';

  let texto = `*Ｃ✦𝐌𝐄𝐍𝐂𝐈𝐎𝐍 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 ${botname}*\n`;
  texto += `*Integrantes actuales: ${participants.length}*\n\n`;
  texto += `╭───╮\n`;
  texto += `│  ✧ ${mensaje} ✧\n`;
  texto += `╰───╯\n`;

  for (const mem of participants) {
    texto += `🇺🇳 @${mem.id.split('@')[0]}\n`; // Puedes personalizar banderas si tienes base de datos de país
  }

  texto += `\n╰───⭓\n`;
  texto += `*𝘚𝘶𝘱𝘦𝘳 𝘉𝘰𝘵 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 🚩 〜 ${vs}*`;

  await conn.sendMessage(m.chat, {
    text: texto,
    mentions: participants.map(u => u.id),
  });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;

export default handler;