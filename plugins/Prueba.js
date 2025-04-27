const handler = async (m, { conn, usedPrefix, command, args, user, cooldowns }) => {
  try {
    // Obtener los cooldowns del usuario (asegúrate de que "cooldowns" esté disponible)
    const userCooldowns = cooldowns.getUserCooldowns(user.id);
    
    // Función para formatear el tiempo restante
    const formatCooldown = (remaining) => {
      if (remaining <= 0) return 'Ahora';
      
      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      
      if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
      if (minutes > 0) return `${minutes}m ${seconds}s`;
      return `${seconds}s`;
    };
    
    // Mensaje de respuesta
    let message = `❀ *INFORMACIÓN DE ENFRIAMIENTO*\n\n`;
    message += `➪ *Usuario ›* @${user.name || user.id}\n\n`;
    message += `> ✧ *Crime ›* ${formatCooldown(userCooldowns.crime || 0)}\n`;
    message += `> ✧ *Mine ›* ${formatCooldown(userCooldowns.mine || 0)}\n`;
    message += `> ✧ *Work ›* ${formatCooldown(userCooldowns.work || 0)}\n`;
    message += `> ✧ *Ruleta ›* ${formatCooldown(userCooldowns.ruleta || 0)}\n`;
    message += `> ✧ *Slut ›* ${formatCooldown(userCooldowns.slut || 0)}\n`;
    message += `> ✧ *Steal ›* ${formatCooldown(userCooldowns.steal || 0)}\n`;
    message += `> ✧ *Ppt ›* ${formatCooldown(userCooldowns.ppt || 0)}\n`;
    message += `> ✧ *Daily ›* ${formatCooldown(userCooldowns.daily || 0)}\n`;
    message += `> ✧ *Weekly ›* ${formatCooldown(userCooldowns.weekly || 0)}\n`;
    message += `> ✧ *Monthly ›* ${formatCooldown(userCooldowns.monthly || 0)}`;
    
    // Enviar mensaje con mención
    await conn.sendMessage(m.chat, {
      text: message,
      mentions: [m.sender]
    }, { quoted: m });
    
  } catch (error) {
    console.error('Error en einfo:', error);
    await conn.reply(m.chat, '❌ Error al mostrar los cooldowns.', m);
  }
};

// Configuración del handle
handler.help = ['einfo'];
handler.tags = ['rpg'];
handler.command = ['einfo', 'cooldowns']; 
handler.group = true;
handler.register = true;

export default handler;
