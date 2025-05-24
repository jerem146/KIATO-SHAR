let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(`${emoji} Por favor, proporciona un mensaje de despedida para el bot.\n> Ejemplo: #setbye Adiós @user`);
  }

  // Asegura que la base de datos del chat esté inicializada
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};

  // Guarda el mensaje de despedida en la base de datos
  global.db.data.chats[m.chat].despMessage = text.trim();

  m.reply(`${emoji} La despedida del bot ha sido cambiada a:\n\n"${text.trim()}"`);
};

handler.help = ['setbye'];
handler.tags = ['tools'];
handler.command = ['setbye'];
handler.owner = false;
handler.admin = true;

export default handler;