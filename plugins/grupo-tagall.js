const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const botname = 'KIATO-BOT';
  const vs = '𝐊𝐈𝐀𝐓𝐎-𝐁𝐎𝐓';
  const mensaje = args.join(' ') || '¡Despierten todos, hay noticias!';

  // Mapa de códigos de país y sus banderas
  const countryFlags = {
    '51': '🇵🇪', '52': '🇲🇽', '54': '🇦🇷', '55': '🇧🇷', '57': '🇨🇴', '58': '🇻🇪',
    '591': '🇧🇴', '593': '🇪🇨', '595': '🇵🇾', '598': '🇺🇾', '1': '🇺🇸',
    '34': '🇪🇸', '39': '🇮🇹', '49': '🇩🇪', '33': '🇫🇷', '44': '🇬🇧',
    '502': '🇬🇹', '507': '🇵🇦', '505': '🇳🇮', '506': '🇨🇷', '504': '🇭🇳',
    '971': '🇦🇪', '91': '🇮🇳', '81': '🇯🇵', '62': '🇮🇩', '234': '🇳🇬',
    '963': '🇸🇾', '967': '🇾🇪', '66': '🇹🇭', '84': '🇻🇳', '60': '🇲🇾',
    '223': '🇲🇱', '216': '🇹🇳', '243': '🇨🇩', '237': '🇨🇲', '241': '🇬🇦',
    '221': '🇸🇳', '256': '🇺🇬', '250': '🇷🇼', '255': '🇹🇿', '261': '🇲🇬',
    '240': '🇬🇶', '964': '🇮🇶', '90': '🇹🇷', '212': '🇲🇦',
  };

  function getFlagFromNumber(number) {
    const clean = number.replace('+', '');
    const code = Object.keys(countryFlags).find(k => clean.startsWith(k));
    return code ? countryFlags[code] : '🏳️'; // Por defecto bandera blanca si no se detecta
  }

  let texto = `*Ｃ✦𝐌𝐄𝐍𝐂𝐈𝐎𝐍 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 ${botname}*\n`;
  texto += `*Integrantes actuales: ${participants.length}*\n\n`;
  texto += `╭───╮\n`;
  texto += `│ ✧ ${mensaje} ✧\n`;
  texto += `╰───╯\n\n`;

  for (const mem of participants) {
    const numero = mem.id.split('@')[0];
    const flag = getFlagFromNumber(numero);
    texto += `♡︰ ${flag} @${numero}\n`;
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