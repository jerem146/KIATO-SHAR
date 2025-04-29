const handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  if (!user) return conn.reply(m.chat, '❌ No tienes datos registrados.', m);

  const COOLDOWN = 10 * 60 * 1000; // 10 minutos en milisegundos
  const now = Date.now();
  const last = user.lastmiming || 0;
  const remaining = COOLDOWN - (now - last);

  // Formatea la fecha del último minado
  const lastMined = last
    ? new Date(last).toLocaleString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Nunca';

  // Formatea el tiempo restante (si hay)
  const remainingTime = remaining > 0
    ? `${Math.floor(remaining / 60000)}m ${Math.floor((remaining % 60000) / 1000)}s`
    : 'Ya puedes minar';

  const message = `

❀ *Información de Enfriamientos*

*✧Usuario ›* @${m.sender.split('@')[0]}

> ✧ *Minar:*  //usa el comando correspondiente
> ✧ *Última vez:* ${lastMined}
> ✧ *Cooldown:* ${remainingTime}

╰────────────────`.trim();

  await conn.sendMessage(m.chat, { 
    text: message, 
    mentions: [m.sender] 
  }, { quoted: m });
};

handler.help = ['lastmine'];
handler.tags = ['minería'];
handler.command = ['lastmine', 'ultimominado', 'mylastmine'];
export default handler;
