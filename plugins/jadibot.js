import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);

  const jadi = 'jadibot';
  const botname = 'Anika Dm';
  const emoji = '✨';
  const emoji2 = '⚠️';
  const emoji3 = '🗑️';
  const msm = '❗';
  const deco = '╭────⋅•⋅◦❈◦•⋅────╮';
  const deco2 = '╰────⋅•⋅◦❈◦•⋅────╯';
  const line = '━━━━━━━━━━━━━━━━━━━━';
  const imageUrl = 'https://files.catbox.moe/r5ziex.jpeg';

  async function reportError(e) {
    await m.reply(`${msm} Ocurrió un error inesperado.`);
    console.error(e);
  }

  switch (true) {
    case isCommand1: {
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
      let uniqid = `${who.split('@')[0]}`;
      const userPath = `./${jadi}/${uniqid}`;

      if (!fs.existsSync(userPath)) {
        await conn.sendMessage(m.chat, {
          text: `${deco}\n${emoji} *No tienes una sesión activa.*\n\nPuedes crear una con:\n*${usedPrefix + command}*\n\nO usar una *(ID)* con:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`\n${deco2}`
        }, { quoted: m });
        return;
      }

      if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(m.chat, {
          text: `${deco}\n${emoji2} *Este comando solo puede usarse desde el bot principal.*\n\nhttps://wa.me/${global.conn.user.jid.split('@')[0]}?text=${usedPrefix + command}\n${deco2}`
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          text: `${emoji} Tu sesión como *Sub-Bot* ha sido eliminada correctamente.`,
          image: { url: imageUrl }
        }, { quoted: m });
      }

      try {
        await fs.rm(userPath, { recursive: true, force: true });
        await conn.sendMessage(m.chat, {
          text: `${emoji3} *Sesión cerrada y datos eliminados.*`
        }, { quoted: m });
      } catch (e) {
        reportError(e);
      }
      break;
    }

    case isCommand2: {
      if (global.conn.user.jid === conn.user.jid) {
        conn.reply(m.chat, `${emoji} *Este número no es un Sub-Bot.*\nComuníquese con el bot principal para ser uno.`, m);
      } else {
        await conn.reply(m.chat, `${emoji} *${botname} se ha pausado correctamente.*`, m);
        conn.ws.close();
      }
      break;
    }

    case isCommand3: {
      const users = [...new Set([...global.conns.filter(c => c.user && c.ws?.socket?.readyState !== ws.CLOSED)])];

      function convertirMsADiasHorasMinutosSegundos(ms) {
        const segundos = Math.floor(ms / 1000) % 60;
        const minutos = Math.floor(ms / (1000 * 60)) % 60;
        const horas = Math.floor(ms / (1000 * 60 * 60)) % 24;
        const días = Math.floor(ms / (1000 * 60 * 60 * 24));
        let resultado = "";
        if (días) resultado += `${días} días, `;
        if (horas) resultado += `${horas} horas, `;
        if (minutos) resultado += `${minutos} minutos, `;
        if (segundos) resultado += `${segundos} segundos`;
        return resultado;
      }

      const message = users.map((v, i) => 
`╭────「 ${i + 1} 」────
📎 https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
👤 Usuario: ${v.user.name || 'Sub-Bot'}
⏳ Tiempo activo: ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}
╰───────────────`).join('\n\n');

      const replyMessage = message || 'No hay Sub-Bots disponibles por el momento.';
      const responseMessage = `${deco}
${emoji} *LISTA DE SUB-BOTS ACTIVOS*

${emoji2} Puedes pedir permiso para agregar un bot a tu grupo.

\`\`\`Cada Sub-Bot es independiente. El dueño del número principal no se responsabiliza por el mal uso.\`\`\`

*SUB-BOTS CONECTADOS:* ${users.length}
${line}
${replyMessage}
${deco2}`;

      await conn.sendMessage(m.chat, {
        text: responseMessage,
        mentions: conn.parseMention(responseMessage),
        image: { url: imageUrl }
      }, { quoted: m });
      break;
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;
