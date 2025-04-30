import fs from 'fs';
import path from 'path';
import axios from 'axios';
import yts from 'yt-search';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);
const tmpDir = path.resolve('tmp');
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
    const search = await yts(text);
    const video = search.videos?.[0];
    if (!video) throw "❌ No se encontraron resultados.";

    const { title, url, thumbnail } = video;
    const { data } = await axios.get(`${API_URL}/download.php`, {
      params: { format: 'mp3', url, api: API_KEY }
    });

    if (!data.success) throw "❌ No se pudo obtener el enlace de descarga.";
    const downloadUrl = await waitForDownload(data.id);

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, `audio_${Date.now()}.mp3`);

    const stream = await axios.get(downloadUrl, { responseType: 'stream' });
    await streamPipeline(stream.data, fs.createWriteStream(filePath));

    const audioBuffer = await fs.promises.readFile(filePath);
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
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

    fs.promises.unlink(filePath).catch(() => {});
  } catch (err) {
    console.error('Error:', err);
    conn.reply(m.chat, `❌ Error: ${err.message || err}`, m);
  }
};

const waitForDownload = async (id) => {
  for (let i = 0; i < 20; i++) { // máximo ~10s de espera
    try {
      const { data } = await axios.get(`${API_URL}/progress.php`, { params: { id } });
      if (data?.success && data.progress === 1000) return data.download_url;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 500)); // espera 0.5s (más rápido)
  }
  throw new Error('⏳ Tiempo de espera agotado para la descarga.');
};

handler.help = ['play4'];
handler.command = ['play4'];
handler.tags = ['música'];
handler.register = true;

export default handler;
