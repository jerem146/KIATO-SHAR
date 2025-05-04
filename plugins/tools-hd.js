import { upscaleImage } from 'waifu2x';

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

    const upscaledImage = await upscaleImage(imgBuffer);
    if (!upscaledImage) {
      await m.react("✖️");
      return conn.reply(m.chat, "✦ No se pudo mejorar la imagen. Intenta más tarde.", m);
    }

    await conn.sendFile(m.chat, upscaledImage, "mejorada.jpg", "*✦ Aquí tienes tu imagen mejorada*", m);
    await m.react("✅");

  } catch (e) {
    console.error("Error al mejorar imagen:", e);
    await m.react("✖️");
    conn.reply(m.chat, "✦ Ocurrió un error al mejorar la imagen. Intenta de nuevo más tarde.", m);
  }
};
