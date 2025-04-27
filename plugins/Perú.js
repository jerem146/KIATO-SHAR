import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, command }) => {
  await conn.reply(m.chat, 'Ay mi gatito miau miau', m);
};

handler.command = handler.help = ['peru']
handler.tags = ['fun']
handler.group = true


export default handler;