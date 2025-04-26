// plugins/Girasol.js
import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, command }) => {
  await conn.reply(m.chat, '¿Acaso escribiste *pene*🫦?', m);
};

handler.command = handler.help = ['pene']
handler.tags = ['fun']
handler.group = true


export default handler;
