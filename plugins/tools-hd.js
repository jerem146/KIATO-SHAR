import axios from "axios";
import uploadImage from "../lib/uploadImage.js";

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || q.mediaType || "";

    if (!mime.startsWith("image/")) {
      return conn.reply(m.chat, "✦ Responde a una *imagen* para mejorarla.", m);
    }

    await m.react("🕓");

    const imgBuffer = await q.download?.();
    if (!imgBuffer) {
      throw new Error("No se pudo descargar la imagen.");
    }

    const imageUrl = await uploadImage(imgBuffer);
    if (!imageUrl) {
      throw new Error("No se pudo subir la imagen.");
    }

    const upscaledImage = await getUpscaledImage(imageUrl);
    if (!upscaledImage) {
      throw new Error("No se pudo mejorar la imagen.");
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

// Función que envía la imagen al API de mejora
async function getUpscaledImage(imageUrl) {
  const apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`;
  const { data } = await axios.get(apiUrl, { responseType: "arraybuffer" });
  return Buffer.from(data);
}
