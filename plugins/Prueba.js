import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

// Formatos soportados organizados mejor
const supportedFormats = {
  audio: ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'],
  video: ['144', '240', '360', '480', '720', '1080', '1440', '2160'] // 2160 = 4K
};

// Configuración de APIs alternativas
const videoAPIs = [
  `https://api.siputzx.my.id/api/d/ytmp4?url=`,
  `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=`,
  `https://axeel.my.id/api/download/video?url=`,
  `https://delirius-apiofc.vercel.app/download/ytmp4?url=`
];

const audioAPIs = [
  `https://api.siputzx.my.id/api/d/ytmp3?url=`,
  `https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=`,
  `https://delirius-apiofc.vercel.app/download/ytmp3?url=`
];

class YouTubeDownloader {
  static async downloadFromAPI(url, format) {
    const isAudio = supportedFormats.audio.includes(format);
    const isVideo = supportedFormats.video.includes(format);
    
    if (!isAudio && !isVideo) {
      throw new Error(`Formato no soportado. Formatos disponibles:\nAudio: ${supportedFormats.audio.join(', ')}\nVideo: ${supportedFormats.video.join(', ')}`);
    }

    try {
      const config = {
        method: 'GET',
        url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      };

      const response = await axios.request(config);

      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await this.checkProgress(id);
        
        return {
          id,
          title,
          thumbnail: info?.image,
          downloadUrl,
          format: isAudio ? 'audio' : 'video'
        };
      }
      throw new Error('La API no devolvió datos válidos');
    } catch (error) {
      console.error('Error en downloadFromAPI:', error.message);
      throw error;
    }
  }

  static async checkProgress(id) {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      let attempts = 0;
      const maxAttempts = 10; // Máximo 10 intentos (50 segundos)
      
      while (attempts < maxAttempts) {
        attempts++;
        const response = await axios.request(config);

        if (response.data?.success) {
          if (response.data.progress === 1000) {
            return response.data.download_url;
          }
          if (response.data.error) {
            throw new Error(response.data.error);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      throw new Error('Tiempo de espera agotado para la descarga');
    } catch (error) {
      console.error('Error en checkProgress:', error.message);
      throw error;
    }
  }

  static async tryAlternativeAPIs(url, type = 'video') {
    const apis = type === 'video' ? videoAPIs : audioAPIs;
    
    for (const api of apis) {
      try {
        const apiUrl = api + encodeURIComponent(url);
        const res = await fetch(apiUrl);
        
        if (!res.ok) throw new Error(`API ${api} no respondió correctamente`);
        
        const data = await res.json();
        const downloadUrl = data?.dl || data?.result?.download?.url || 
                           data?.downloads?.url || data?.download?.url;
        
        if (downloadUrl) {
          return {
            downloadUrl,
            source: api,
            type
          };
        }
      } catch (e) {
        console.error(`Error con API ${api}:`, e.message);
      }
    }
    throw new Error(`No se pudo descargar el ${type} desde ninguna API alternativa`);
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `
┌─⟢ *DESCARGA DE MÚSICA/VIDEO* ⟣─┐
│
│ ✦ Uso: ${usedPrefix + command} <nombre o URL>
│ ✦ Ejemplo: ${usedPrefix + command} Believer Imagine Dragons
│
└────────────────────┘`, m);
    }

    // Buscar en YouTube
    const search = await yts(text);
    if (!search.all?.length) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const video = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = video;
    
    // Información del video
    const infoMsg = `「✦」 Descargando: *${title}*\n\n` +
                   `> ✦ Canal: *${author?.name || 'Desconocido'}*\n` +
                   `> ✰ Vistas: *${formatViews(views)}*\n` +
                   `> ⴵ Duración: *${timestamp}*\n` +
                   `> ✐ Publicado: *${ago}*\n` +
                   `> 🜸 URL: ${url}`;

    const thumb = (await conn.getFile(thumbnail))?.data;
    
    // Enviar información del video
    await conn.reply(m.chat, infoMsg, m, {
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    });

    // Procesar descarga según el comando
    if (command === 'play5') {
      try {
        // Intentar primero con la API principal
        const result = await YouTubeDownloader.downloadFromAPI(url, 'mp3');
        await conn.sendMessage(m.chat, {
          audio: { url: result.downloadUrl },
          mimetype: "audio/mpeg",
          contextInfo: {
            externalAdReply: {
              title: title,
              body: author?.name || '',
              thumbnail: thumb,
              mediaType: 2,
              mediaUrl: url,
              sourceUrl: url
            }
          }
        }, { quoted: m });
      } catch (audioError) {
        console.error('Error con API principal, probando alternativas:', audioError.message);
        
        // Intentar con APIs alternativas para audio
        try {
          const audioResult = await YouTubeDownloader.tryAlternativeAPIs(url, 'audio');
          await conn.sendMessage(m.chat, {
            audio: { url: audioResult.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            contextInfo: {
              externalAdReply: {
                title: title,
                body: author?.name || '',
                thumbnail: thumb,
                mediaType: 2,
                mediaUrl: url,
                sourceUrl: url
              }
            }
          }, { quoted: m });
        } catch (altAudioError) {
          console.error('Error con APIs de audio alternativas:', altAudioError.message);
          
          // Si falla el audio, intentar con video
          try {
            const videoResult = await YouTubeDownloader.tryAlternativeAPIs(url, 'video');
            await conn.sendMessage(m.chat, {
              video: { url: videoResult.downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: 'video/mp4',
              caption: `*${title}* - ${author?.name || ''}`,
              thumbnail: thumb
            }, { quoted: m });
          } catch (videoError) {
            console.error('Error al descargar video:', videoError.message);
            throw new Error('No se pudo descargar el contenido como audio ni como video.');
          }
        }
      }
    } else {
      throw new Error(`Comando no reconocido: ${command}`);
    }
  } catch (error) {
    console.error('Error en handler:', error);
    return m.reply(`𓁏 *Error:* ${error.message}`);
  }
};

// Comandos soportados
handler.command = handler.help = ['play5', 'ytmp']; 
handler.tags = ['downloader'];

export default handler;

// Función para formatear las vistas
function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
}
