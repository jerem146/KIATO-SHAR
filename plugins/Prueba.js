// plugins/einfo.js
export default ({ event, api, cooldowns }) => {
  return {
    name: 'Economy Info',
    description: 'Muestra los tiempos de enfriamiento de comandos económicos',
    version: '1.0.0',
    author: 'TuNombre',
    dependencies: ['cooldowns'],

    onCommand: async ({ command, args, user }) => {
      if (command === 'einfo') {
        try {
          // Obtener los cooldowns del usuario
          const userCooldowns = cooldowns.getUserCooldowns(user.id);
          
          // Función para formatear el tiempo restante
          const formatCooldown = (remaining) => {
            if (remaining <= 0) return 'Ahora';
            
            // Calcular días, horas, minutos y segundos
            const days = Math.floor(remaining / 86400);
            const hours = Math.floor((remaining % 86400) / 3600);
            const minutes = Math.floor((remaining % 3600) / 60);
            const seconds = remaining % 60;
            
            if (days > 0) {
              return `${days} d, ${hours} h, ${minutes} m, ${seconds} s`;
            } else if (hours > 0) {
              return `${hours} h, ${minutes} m, ${seconds} s`;
            } else if (minutes > 0) {
              return `${minutes} minutos, ${seconds} segundos`;
            } else {
              return `${seconds} segundos`;
            }
          };
          
          // Construir el mensaje con el formato solicitado
          let message = `❀ *Información de Enfriamientos*\n\n`;
          message += `➪ *Usuario ›* @${user.name || user.id}\n\n`;
          
          // Añadir cada cooldown con su formato
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
          
          // Enviar el mensaje con mención al usuario
          await api.sendMessage({
            chatId: event.chat.id,
            message,
            mentions: [user.id]
          });
          
        } catch (error) {
          console.error('Error en einfo plugin:', error);
          await api.sendMessage({
            chatId: event.chat.id,
            message: '❌ Ocurrió un error al obtener la información económica.'
          });
        }
        return true; // Indica que el comando fue manejado
      }
      return false;
    }
  };
};
