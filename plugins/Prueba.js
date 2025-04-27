const handler = async (m, { conn, user }) => {
  // Debug: Ver datos REALES del usuario
  console.log("Datos actuales del usuario:", JSON.stringify(user, null, 2));

  const lastMined = user.lastmining 
    ? new Date(user.lastmining).toLocaleString('es') 
    : "Nunca";

  const miningCount = user.miningCount ?? 0; // Usa 0 si no existe

  const message = `
╭─「 *⛏️ ESTADO DE MINERÍA* 」─
│
│ • *Usuario:* @${user.id}
│ • *Último minado:* ${lastMined}
│ • *Total minado:* ${miningCount} veces
│ • *Cooldown:* ${user.miningCooldown ? "🔄 En espera" : "✅ Listo"}
│
╰─────────────────`.trim();

  await conn.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: m });
};

handler.command = ['einfo'];
export default handler;
