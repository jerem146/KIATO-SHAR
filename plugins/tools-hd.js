import axios from "axios";
import uploadImage from "../lib/uploadImage.js";

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || q.mediaType || "";

    if (!mime || !mime.startsWith("image/")) {
      return conn.reply(m.chat, "✦ Responde a una *imagen* para mejorarla.", m);
    }

    await m.react("🕓");

    const imgBuffer = await q.download?.();
    if (!imgBuffer) {
      await m.react("✖️");
      return conn.reply(m.chat, "✦ No se pudo descargar la imagen. Intenta con otra.", m);
    }

    const imageUrl = await uploadImage(imgBuffer);
    if (!imageUrl || !imageUrl.startsWith("http")) {
      await m.react("✖️");
      return conn.reply(m.chat, "✦ No se pudo subir la imagen. Intenta más tarde.", m);
    }

    const upscaledImage = await getUpscaledImage(imageUrl);
    if (!upscaledImage || upscaledImage.length < 500) {
      await m.react("✖️");
      return conn.reply(m.chat, "✦ La imagen mejorada no es válida. Intenta con otra.", m);
    }

    await conn.sendFile(m.chat, upscaledImage, "mejorada.jpg", "*✦ Aquí tienes tu imagen mejorada*", m);
    await m.react("✅");

  } catch (e) {
    console.error("Error al mejorar imagen:", e);
    await m.react("✖️");
    conn.reply(m.chat, "✦ Ocurrió un error al mejorar la imagen. Intenta de nuevo más tarde.", m);
  }
};

handler.help = ["hd"];
handler.tags = ["tools"];
handler.command = ["remini", "hd", "enhance"];
handler.register = true;
export default handler;

// Función para mejorar imagen usando API
async function getUpscaledImage(imageUrl) {
  const apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`;
  const response = await axios.get(apiUrl, {
    responseType: "arraybuffer",
    timeout: 30000, // 30s por si el servidor tarda
    headers: {
      "User-Agent": "WhatsAppBot-Upscaler"
    }
  });
  return Buffer.from(response.data);
}
