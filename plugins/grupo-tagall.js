/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos con banderas 🇺🇸
- Modificado para KIATO-BOT: mensaje por defecto "Revivaaaaan 🗣️"
*/
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  // Función para obtener la bandera según el prefijo telefónico
  function getFlagFromNumber(number) {
    const countryFlags = {
      '1': '🇺🇸', '7': '🇷🇺', '20': '🇪🇬', '27': '🇿🇦', '30': '🇬🇷',
      '31': '🇳🇱', '32': '🇧🇪', '33': '🇫🇷', '34': '🇪🇸', '36': '🇭🇺',
      '39': '🇮🇹', '40': '🇷🇴', '41': '🇨🇭', '43': '🇦🇹', '44': '🇬🇧',
      '45': '🇩🇰', '46': '🇸🇪', '47': '🇳🇴', '48': '🇵🇱', '49': '🇩🇪',
      '51': '🇵🇪', '52': '🇲🇽', '53': '🇨🇺', '54': '🇦🇷', '55': '🇧🇷',
      '56': '🇨🇱', '57': '🇨🇴', '58': '🇻🇪', '60': '🇲🇾', '61': '🇦🇺',
      '62': '🇮🇩', '63': '🇵🇭', '64': '🇳🇿', '65': '🇸🇬', '66': '🇹🇭',
      '81': '🇯🇵', '82': '🇰🇷', '84': '🇻🇳', '86': '🇨🇳', '90': '🇹🇷',
      '91': '🇮🇳', '92': '🇵🇰', '94': '🇱🇰', '212': '🇲🇦', '213': '🇩🇿',
      '216': '🇹🇳', '218': '🇱🇾', '351': '🇵🇹', '352': '🇱🇺', '353': '🇮🇪',
      '354': '🇮🇸', '355': '🇦🇱', '356': '🇲🇹', '357': '🇨🇾', '358': '🇫🇮',
      '359': '🇧🇬', '370': '🇱🇹', '371': '🇱🇻', '372': '🇪🇪', '373': '🇲🇩',
      '380': '🇺🇦', '381': '🇷🇸', '385': '🇭🇷', '386': '🇸🇮', '387': '🇧🇦',
      '420': '🇨🇿', '421': '🇸🇰', '591': '🇧🇴', '595': '🇵🇾', '598': '🇺🇾',
      '855': '🇰🇭', '880': '🇧🇩', '886': '🇹🇼', '960': '🇲🇻', '961': '🇱🇧',
      '962': '🇯🇴', '963': '🇸🇾', '964': '🇮🇶', '965': '🇰🇼', '966': '🇸🇦',
      '967': '🇾🇪', '968': '🇴🇲', '971': '🇦🇪', '972': '🇮🇱', '973': '🇧🇭',
      '974': '🇶🇦', '975': '🇧🇹', '976': '🇲🇳', '977': '🇳🇵', '992': '🇹🇯',
      '993': '🇹🇲', '994': '🇦🇿', '995': '🇬🇪', '996': '🇰🇬', '998': '🇺🇿'
    };
    for (let len = 3; len >= 1; len--) {
      const code = number.slice(0, len);
      if (countryFlags[code]) return countryFlags[code];
    }
    return '🏳️';
  }

  const mensaje = args.length > 0 ? args.join` ` : '*Revivaaaaan 🗣️*';
  const botName = typeof botname !== 'undefined' ? botname : 'KIATO-BOT';

  let texto = `*『 ${botName} 』*\n\n${mensaje}\n\n╭─〔 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: ${participants.length} 〕─⬣\n`;

  for (const mem of participants) {
    const num = mem.id.split('@')[0];
    const flag = getFlagFromNumber(num);
    texto += `┃ ${flag} @${num}\n`;
  }

  texto += `╰─❍ *Versión: ${vs}*`;

  conn.sendMessage(m.chat, { text: texto, mentions: participants.map(a => a.id) }, { quoted: m });
};

handler.help = ['todos *<texto>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;

export default handler;