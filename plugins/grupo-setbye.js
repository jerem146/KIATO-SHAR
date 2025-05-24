let handler = async (m, { text }) => {
  if (!text?.trim()) {
    return m.reply('⚠️ Por favor, proporciona un mensaje de despedida para el bot.\n> Ejemplo: *#setbye Adiós @user, vuelve pronto*');
  }

  // Asegura que la base de datos del chat esté inicializada
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};

  // Guardar el mensaje en la propiedad correcta
  global.db.data.chats[m.chat].despMessage = text.trim();

  m.reply(`✅ Mensaje de despedida actualizado:\n\n"${text.trim()}"`);
};

handler.help = ['setbye <texto>'];
handler.tags = ['tools'];
handler.command = ['setbye'];
handler.admin = true;

export default handler;