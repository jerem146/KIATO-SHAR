let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`${emoji} Por favor, proporciona un mensaje de bienvenida para el bot.\n> Ejemplo: #setwelcome Hola @user, disfruta tu estadía`);
  }

  // Asegura que la base de datos del chat esté inicializada
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};

  // Guarda el mensaje de bienvenida en la base de datos
  global.db.data.chats[m.chat].welcomeMessage = text.trim();

  m.reply(`${emoji} La bienvenida del bot ha sido cambiada a:\n\n"${text.trim()}"`);
};

handler.help = ['setwelcome'];
handler.tags = ['tools'];
handler.command = ['setwelcome'];
handler.owner = false;
handler.admin = true;

export default handler;