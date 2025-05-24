let handler = async (m, { text }) => {
  if (!text?.trim()) {
    return m.reply('⚠️ Por favor, proporciona un mensaje de bienvenida.\n> Ejemplo: *#setwelcome Hola, disfruta tu estadía en el grupo*');
  }

  // Asegurarse de que la base de datos esté inicializada
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};

  // Guardar el mensaje en 'welcomeMessage', que es lo que usas en tu función de bienvenida
  global.db.data.chats[m.chat].welcomeMessage = text.trim();

  m.reply(`✅ Mensaje de bienvenida actualizado:\n\n"${text.trim()}"`);
};

handler.help = ['setwelcome <texto>'];
handler.tags = ['tools'];
handler.command = ['setwelcome'];
handler.admin = true;

export default handler;