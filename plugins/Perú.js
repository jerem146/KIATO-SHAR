import { areJidsSameUser } from '@whiskeysockets/baileys';

console.log('Comando cargado exitosamente, usa el bot bebe🫦');

const handler = async (m, { conn, text, command }) => {
  await conn.reply(m.chat, 'ay mi gatito miau miau miau', m);
};

handler.command = ['peru'];
handler.help = ['peru'];
handler.tags = ['fun'];
handler.group = true;

export default handler;
