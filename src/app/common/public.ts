import { FontLoader } from '@three.js/loaders/FontLoader';

export function clone<T = any>(obj: T) {
  const copy = JSON.stringify(obj);
  return JSON.parse(copy) as T;
}

export async function loadFont(fontJsonPath: string) {
  const loader = new FontLoader();
  return new Promise(res => {
    loader.load(fontJsonPath, function (font) {
      res(font);
    });
  });
}
