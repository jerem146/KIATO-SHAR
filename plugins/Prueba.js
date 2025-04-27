import moment from 'moment';
moment.locale('es'); // Configura moment en español

const handler = async (m, { conn, user }) => {
  try {
    // Verificar si el usuario existe
    if (!user) throw new Error('No se encontraron datos del usuario');

    // Construir mensaje con información básica y tiempos de actividad
    let message = `❀ *INFORMACIÓN DE USUARIO*\n\n` +
                 `➪ *Usuario:* @${user.id}\n\n` +
                 `📊 *Últimas actividades:*\n` +
                 `│\n` +
                 `├─ Últ. Aventura: ${user.lastAdventure ? moment(user.lastAdventure).fromNow() : 'Nunca'}\n` +
                 `├─ Últ. Minería: ${user.lastmining ? moment(user.lastmining).fromNow() : 'Nunca'}\n` +
                 `│\n` +
                 `└─ *Nota:* Los cooldowns están en mantenimiento\n\n` +
                 `ℹ️ Usa /help para más comandos`;

    // Enviar mensaje con mención
    await conn.reply(m.chat, message, m, { mentions: [m.sender] });

  } catch (error) {
    console.error('Error en userinfo:', error);
    await conn.reply(m.chat, '❌ Error al mostrar la información. Intenta más tarde.', m);
  }
};

// Configuración del handler
handler.help = ['userinfo', 'info'];
handler.tags = ['rpg'];
handler.command = ['userinfo', 'info', 'estado'];
handler.group = true;
handler.register = true;

export default handler;
