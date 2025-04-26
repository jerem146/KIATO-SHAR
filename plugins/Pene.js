// plugins/Girasol.js
import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, command }) => {
  await conn.reply(m.chat, '¿Acaso escribiste *girasol*🫦?', m);
};

handler.command = handler.help = ['girasol']
handler.tags = ['fun']
handler.group = true


export default handler;
