import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!global.db.data.chats[m.chat]?.welcome && m.isGroup) {
    return m.reply(`${emoji} Para usar este comando debes activar las bienvenidas con *#welcome*`);
  }

  if (!text) return m.reply(`${emoji} Menciona al usuario con @ para simular la despedida.`);

  let who = conn.parseMention(text.trim())[0];
  if (!who) return m.reply(`${emoji} No se pudo obtener el usuario mencionado.`);

  let taguser = `@${who.split('@')[0]}`;
  let groupMetadata = await conn.groupMetadata(m.chat);
  let chat = global.db.data.chats[m.chat] || {};
  let byeMessage = chat.despMessage || 'Se Fue😹';
  let totalMembers = groupMetadata.participants.length;
  let defaultImage = 'https://files.catbox.moe/xr2m6u.jpg';

  let img;
  try {
    let pp = await conn.profilePictureUrl(who, 'image');
    img = await (await fetch(pp)).buffer();
  } catch {
    img = await (await fetch(defaultImage)).buffer();
  }

  let texto = `┏╼★${textbot}
┋「 ADIÓS 👋 」
┗╼★ 「 ${taguser} 」
 ┋❖ ${byeMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Miembros: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> © ⍴᥆ᥕᥱrᥱძ ᑲᥡ ᗪ卂尺Ҝ`;

  await conn.sendMessage(m.chat, { image: img, caption: texto, mentions: [who] }, { quoted: m });
};

handler.help = ['testbye @user'];
handler.tags = ['group'];
handler.command = ['testbye'];
handler.admin = true;
handler.group = true;

export default handler;