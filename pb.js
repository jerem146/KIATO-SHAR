const handler = async (m, { conn }) => {
  // Texto de respuesta
  const respuesta = "Hola amigos, esto es una prueba para ver si el comando funciona❤️";

  // Envía el mensaje citando el mensaje original del usuario
  await conn.sendMessage(m.chat, { 
    text: respuesta 
  }, { quoted: m });
};

handler.help = ['pb'];
handler.tags = ['prueba'];
handler.command = ['pb'];

export default handler;
