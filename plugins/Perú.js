import { areJidsSameUser } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, command }) => {
  await conn.reply(m.chat, 'ay mi gatito miau miau miau', m);
};

handler.command = handler.help = ['peru']
handler.tags = ['fun']
handler.group = true


export default handler;
import { areJidsSameUser } from '@whiskeysockets/baileys';

