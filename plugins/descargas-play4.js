import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import axios from 'axios';
import yts from 'yt-search';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);
const tmpDir = path.join(process.cwd(), 'tmp');
const API_URL = 'https://p.oceansaver.in/ajax';
const API_KEY = 'dfcb6d76f2f6a9894gjkege8a4ab232222';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `⚠️ Escribe el nombre de la canción.\nEjemplo: *${usedPrefix + command} Aleman Categoría 5*`,
      m
    );
  }

  await conn.sendMessage(m.chat, { react: { text: "🎶", key: m.key } });

  try {
    const { videos } = await yts(text);
    if (!videos.length) throw "❌ No se encontraron resultados.";

    const { title, url, thumbnail } = videos[0];
    const { data } = await axios.get(`${API_URL}/download.php`, {
      params: { format: 'mp3', url, api: API_KEY }
    });

    if (!data.success) throw "❌ No se pudo obtener la info del video.";
    const downloadUrl = await waitForDownload(data.id);

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, `${Date.now()}.mp3`);

    const audioStream = await axios.get(downloadUrl, { responseType: 'stream' });
    await streamPipeline(audioStream.data, fs.createWriteStream(filePath, { highWaterMark: 64 * 1024 }));

    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(filePath),
      fileName: `${title}.mp3`,
      mimetype: "audio/mpeg",
      contextInfo: {
        externalAdReply: {
          title,
          body: "Tu música está lista 🎵",
          mediaType: 1,
          previewType: "PHOTO",
          thumbnailUrl: thumbnail,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    fs.unlinkSync(filePath); // Limpieza
  } catch (err) {
    console.error(err);
    return conn.reply(m.chat, `❌ Error: ${err.message || err}`, m);
  }
};

const waitForDownload = async (id) => {
  while (true) {
    try {
      const { data } = await axios.get(`${API_URL}/progress.php`, { params: { id } });
      if (data?.success && data.progress === 1000) return data.download_url;
    } catch (e) {
      console.error('Error en waitForDownload:', e);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
};

handler.help = ['play4'];
handler.command = ['play4'];
handler.tags = ['música'];
handler.register = true;

export default handler;
