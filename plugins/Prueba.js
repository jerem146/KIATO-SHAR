const handler = async (m, { conn, user }) => {
  try {
    // Datos del usuario (simulados si no existen)
    const lastMined = user.lastmining || "Nunca";
    const miningCount = user.miningCount || 0;
    const miningCooldown = user.miningCooldown || "Listo";

    // Mensaje con estilo
    const message = `
╭─「 *🪙 MINERÍA* 」─
│
│ *👤 Usuario:* @${user.id}
│ *⛏️ Último minado:* ${lastMined}
│ *🔢 Veces minado:* ${miningCount}
│ *⏱️ Estado:* ${miningCooldown}
│
╰──────────────
    `.trim();

    // Enviar mensaje con mención
    await conn.sendMessage(m.chat, { 
      text: message, 
      mentions: [m.sender] 
    }, { quoted: m });

  } catch (error) {
    console.error("Error en el comando minar:", error);
    await conn.reply(m.chat, "❌ Error al mostrar datos de minería.", m);
  }
};

// Configuración del comando
handler.help = ['einfo'];
handler.tags = ['rpg'];
handler.command = ['einfo']; 
handler.group = true;
handler.register = true;

export default handler;
