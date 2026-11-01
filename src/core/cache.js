import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const CACHE_DIR = path.resolve('.cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function getCacheKey(prefix, data) {
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  return path.join(CACHE_DIR, `${prefix}_${hash}.json`);
}

export function getCached(prefix, data) {
  try {
    const file = getCacheKey(prefix, data);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`[Cache] Read error: ${err.message}`);
  }
  return null;
}

export function setCached(prefix, data, value) {
  try {
    const file = getCacheKey(prefix, data);
    fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`[Cache] Write error: ${err.message}`);
  }
}
