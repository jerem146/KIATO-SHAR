const handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  if (!user) return conn.reply(m.chat, '❌ No tienes datos registrados.', m);

  // Formatea la fecha del último minado
  const lastMined = user.lastmiming 
    ? new Date(user.lastmiming).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Nunca';

  // Mensaje minimalista
  const message = `
╭─「 *⛏️ ÚLTIMO MINADO* 」─
│
│ • *Usuario:* @${m.sender.split('@')[0]}
│ • *Fecha:* ${lastMined}
│
╰────────────────`.trim();

  await conn.sendMessage(m.chat, { 
    text: message, 
    mentions: [m.sender] 
  }, { quoted: m });
};

// Configuración
handler.help = ['lastmine'];
handler.tags = ['minería'];
handler.command = ['lastmine', 'ultimominado', 'mylastmine'];
export default handler;
