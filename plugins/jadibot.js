import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);

  const jadi = 'jadibot'; // Asegúrate de que este sea el nombre correcto de la carpeta
  const botname = 'Tu Bot';
  const emoji = '✅';
  const emoji2 = '⚠️';
  const emoji3 = '🗑️';
  const msm = '❗';
  const imageUrl = 'https://files.catbox.moe/r5ziex.jpeg'; // Puedes personalizar esta URL

  async function reportError(e) {
    await m.reply(`${msm} Ocurrió un error.`);
    console.error(e);
  }

  switch (true) {
    case isCommand1: {
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
      let uniqid = `${who.split('@')[0]}`;
      const userPath = `./${jadi}/${uniqid}`;

      if (!fs.existsSync(userPath)) {
        await conn.sendMessage(m.chat, {
          text: `${emoji} Usted no tiene una sesión, puede crear una usando:\n${usedPrefix + command}\n\nSi tiene una *(ID)* puede usar para saltarse el paso anterior usando:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\``
        }, { quoted: m });
        return;
      }

      if (global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(m.chat, {
          text: `${emoji2} Use este comando al *Bot* principal.\n\nhttps://api.whatsapp.com/send/?phone=${global.conn.user.jid.split('@')[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0`
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { text: `${emoji} Tu sesión como *Sub-Bot* se ha eliminado`, image: { url: imageUrl } }, { quoted: m });
      }

      try {
        await fs.rm(userPath, { recursive: true, force: true });
        await conn.sendMessage(m.chat, {
          text: `${emoji3} Ha cerrado sesión y borrado todo rastro.`
        }, { quoted: m });
      } catch (e) {
        reportError(e);
      }
      break;
    }

    case isCommand2: {
      if (global.conn.user.jid === conn.user.jid) {
        conn.reply(m.chat, `${emoji} Si no es *Sub-Bot*, comuníquese al número principal del *Bot* para ser *Sub-Bot*.`, m);
      } else {
        await conn.reply(m.chat, `${emoji} ${botname} desactivada.`, m);
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

      const message = users.map((v, i) => `• 「 ${i + 1} 」\n📎 Wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado\n👤 Usuario: ${v.user.name || 'Sub-Bot'}\n🕑 Online: ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`).join('\n\n__________________________\n\n');

      const replyMessage = message || 'No hay Sub-Bots disponibles por el momento, verifique más tarde.';
      const responseMessage = `${emoji} LISTA DE *SUB-BOTS* ACTIVOS\n\n${emoji2} PUEDES PEDIR PERMISO PARA QUE TE DEJEN UNIR EL BOT A TU GRUPO\n\n\`\`\`CADA USUARIO SUB-BOT USA SUS FUNCIONES COMO QUIERA, EL NÚMERO PRINCIPAL NO SE HACE RESPONSABLE DEL MAL USO DE ELLA\`\`\`\n\n*SUB-BOTS CONECTADOS:* ${users.length}\n\n${replyMessage.trim()}`;

      await conn.sendMessage(m.chat, {
        text: responseMessage,
        mentions: conn.parseMention(responseMessage),
        image: { url: imageUrl } // Opcional: puedes quitar esta línea si no quieres mostrar imagen aquí
      }, { quoted: m });
      break;
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;
