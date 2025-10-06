import fs from 'fs';
import path from 'path';

export function loadRandomImageFromJson(jsonPath?: string) {
  const defaultPath = path.resolve(__dirname, '../../data/attachment.json');
  const filePath = jsonPath || defaultPath;
  const images = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return images[Math.floor(Math.random() * images.length)];
}
