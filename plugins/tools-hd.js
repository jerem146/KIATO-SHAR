import FormData from "form-data";
import Jimp from "jimp";

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (!mime) throw `
╭╼❍ *Uso Incorrecto* ❍╾╮
│  Por favor, envía o responde
│  a una *imagen* con el comando:
│  ⤷ *${usedPrefix + command}*
╰───────────────╯`;

    if (!/image\/(jpe?g|png)/.test(mime)) throw `
╭╼⚠️ *Formato no compatible* ⚠️╾╮
│  Tipo recibido: *${mime}*
│  Solo se aceptan imágenes
│  en formato *JPG o PNG*.
╰────────────────────╯`;

    m.reply("⌛ *Mejorando la calidad de tu imagen...*");

    let img = await q.download?.();
    let pr = await remini(img, "enhance");
    conn.sendMessage(m.chat, { image: pr }, { quoted: m });

  } catch {
    throw `
╭╼⚠️ *Ocurrió un error* ⚠️╾╮
│  No se pudo procesar la imagen.
│  Inténtalo nuevamente, por favor.
╰────────────────────╯`;
  }
};

handler.help = ["remini", "hd", "enhance"];
handler.tags = ["ai", "tools"];
handler.command = ["remini", "hd", "enhance"];
export default handler;

async function remini(imageData, operation) {
  return new Promise(async (resolve, reject) => {
    const availableOperations = ["enhance", "recolor", "dehaze"];
    operation = availableOperations.includes(operation) ? operation : availableOperations[0];

    const baseUrl = `https://inferenceengine.vyro.ai/${operation}.vyro`;
    const formData = new FormData();
    formData.append("image", Buffer.from(imageData), {
      filename: "enhance_image_body.jpg",
      contentType: "image/jpeg"
    });
    formData.append("model_version", 1, {
      "Content-Transfer-Encoding": "binary",
      contentType: "multipart/form-data; charset=utf-8"
    });

    formData.submit({
      url: baseUrl,
      host: "inferenceengine.vyro.ai",
      path: "/" + operation,
      protocol: "https:",
      headers: {
        "User-Agent": "okhttp/4.9.3",
        "Connection": "Keep-Alive",
        "Accept-Encoding": "gzip"
      }
    }, (err, res) => {
      if (err) return reject(err);
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", err => reject(err));
    });
  });
}
