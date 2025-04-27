const handler = async (m, { conn, cooldowns, user }) => {
  try {
    // Debug: Verificar parámetros
    console.log("User ID:", user?.id);
    console.log("Cooldowns object:", cooldowns);

    if (!cooldowns || !cooldowns.getUserCooldowns) {
      throw new Error("El módulo 'cooldowns' no está disponible o no tiene el método 'getUserCooldowns'");
    }

    // Obtener cooldowns con valor por defecto
    const userCooldowns = cooldowns.getUserCooldowns(user?.id) || {};

    // Función para formatear tiempo
    const formatTime = (seconds) => {
      if (seconds <= 0) return "Ahora";
      const units = [
        { name: "día", value: 86400 },
        { name: "hora", value: 3600 },
        { name: "minuto", value: 60 },
        { name: "segundo", value: 1 }
      ];
      return units.map(unit => {
        const value = Math.floor(seconds / unit.value);
        seconds %= unit.value;
        return value > 0 ? `${value} ${unit.name}${value !== 1 ? 's' : ''}` : null;
      }).filter(Boolean).join(", ") || "Ahora";
    };

    // Construir mensaje
    const commands = [
      "crime", "mine", "work", "ruleta", 
      "slut", "steal", "ppt", "daily", 
      "weekly", "monthly"
    ];

    let message = `❀ *TIEMPOS DE ENFRIAMIENTO*\n\n➪ Usuario: @${user?.name || user?.id}\n\n` +
      commands.map(cmd => `> ✧ ${cmd.charAt(0).toUpperCase() + cmd.slice(1)} › ${formatTime(userCooldowns[cmd] || 0)}`).join("\n");

    // Enviar mensaje
    await conn.reply(m.chat, message, m, { mentions: [m.sender] });

  } catch (error) {
    console.error("Error detallado:", error);
    await conn.reply(m.chat, `❌ Error crítico: ${error.message}`, m);
  }
};

handler.help = ["einfo"];
handler.tags = ["rpg"];
handler.command = ["einfo", "cooldowns"];
handler.group = true;
handler.register = true;

export default handler;
