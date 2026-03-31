import fs from 'fs';
import path from 'path';
const src = path.resolve('dist/public');
const dest = path.resolve('server/_core/public');
fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log('Build copiado para server/_core/public');
