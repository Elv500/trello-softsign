import fs from 'fs';
import path from 'path';

export function readState<T = any>(fileName = 'trello-state.json'): T {
  const statePath = path.join(__dirname, '../../config', fileName);
  if (!fs.existsSync(statePath)) {
    throw new Error(`No se encontró el archivo de estado: ${statePath}`);
  }
  return JSON.parse(fs.readFileSync(statePath, 'utf-8'));
}

export function writeState(data: any, fileName = 'trello-state.json') {
  const statePath = path.join(__dirname, '../../config', fileName);
  fs.writeFileSync(statePath, JSON.stringify(data, null, 2));
}

export function clearState(fileName = 'trello-state.json') {
  const statePath = path.join(__dirname, '../../config.', fileName);
  if (fs.existsSync(statePath)) {
    fs.unlinkSync(statePath);
  }
}