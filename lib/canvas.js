import { spawn } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Obtener __dirname en ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url))

// Función principal
export function levelup(teks, level) {
  return new Promise((resolve, reject) => {
    // Verificar si el entorno soporta convert, magick o gm
    if (!(global.support?.convert || global.support?.magick || global.support?.gm)) {
      return reject('¡Tu entorno no tiene soporte para ImageMagick o GraphicsMagick!')
    }

    // Definir rutas
    const fontPath = join(__dirname, '../src/font')
    const fontLevel = join(fontPath, 'level_c.otf')
    const fontTexts = join(fontPath, 'texts.otf')
    const template = join(__dirname, '../src/lvlup_template.jpg')

    // Ajustar posición según nivel
    let anotations = '+1385+260'
    if (level > 2) anotations = '+1370+260'
    if (level > 10) anotations = '+1330+260'
    if (level > 50) anotations = '+1310+260'
    if (level > 100) anotations = '+1260+260'

    // Preparar comando
    const [_spawnprocess, ..._spawnargs] = [
      ...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
      'convert',
      template,
      '-font', fontTexts,
      '-fill', '#0F3E6A',
      '-size', '1024x784',
      '-pointsize', '68',
      '-interline-spacing', '-7.5',
      '-annotate', '+153+200', teks,
      '-font', fontLevel,
      '-fill', '#0A2A48',
      '-size', '1024x784',
      '-pointsize', '140',
      '-interline-spacing', '-1.2',
      '-annotate', anotations, String(level),
      '-append',
      'jpg:-'
    ]

    const bufs = []
    const proc = spawn(_spawnprocess, _spawnargs)

    proc.stdout.on('data', chunk => bufs.push(chunk))
    proc.stderr.on('data', err => console.error('[Magick Error]', err.toString()))
    proc.on('error', reject)
    proc.on('close', () => resolve(Buffer.concat(bufs)))
  })
}
