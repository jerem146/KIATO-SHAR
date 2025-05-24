let handler = async (m, { text }) => {
  if (!text?.trim()) {
    return m.reply('⚠️ Por favor, proporciona un mensaje de bienvenida.\n> Ejemplo: *#setwelcome Hola @user, disfruta tu estadía*');
  }

  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
  global.db.data.chats[m.chat].welcome = text.trim();

  m.reply(`✅ La bienvenida ha sido establecida para este grupo:\n\n"${text.trim()}"`);
};

handler.help = ['setwelcome <texto>'];
handler.tags = ['tools'];
handler.command = ['setwelcome'];
handler.admin = true;

export default handler;