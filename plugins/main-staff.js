let handler = async (m, { conn, command, usedPrefix }) => {
let img = './src/catalogo.jpg'
let staff = `ᥫ᭡ *EQUIPO DE AYUDANTES* ❀
✰ *Dueño* ${Creador}
✦ *Bot:* ${botname}
⚘ *Versión:* ${vs}
❖ *Libreria:* ${libreria} ${baileys}

❍ *Creador:*

ᰔᩚ DAREK
> 🜸 Rol » *Creador*
> ✧ GitHub » https://github.com/jerem146 

❒ *Colaboradores:*

ᰔᩚ Neykoor 
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/Aqua200/Yu.git

ᰔᩚ ⁱᵃᵐ|𝔇ĕ𝐬†𝓻⊙γ𒆜
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/The-King-Destroy

ᰔᩚ ⁱᵃᵐTwo ᥣ᥎1 rᥱmᥲs𝗍ᥱrіzᥲძo
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/twoLv3/TwoLv3
  
ᰔᩚ Legna
> 🜸 Rol » *Mini-Dev* 
> ✧ GitHub » https://github.com/Legna-chan
`
await conn.sendFile(m.chat, img, 'yuki.jpg', staff.trim(), fkontak)
}
  
handler.help = ['staff']
handler.command = ['colaboradores', 'staff']
handler.register = false
handler.tags = ['main']

export default handler
