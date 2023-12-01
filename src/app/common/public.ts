import { FontLoader } from '@three.js/loaders/FontLoader';
import * as THREE from 'three';

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


export function loadTexture(textureFilename: string) {
    return new Promise<THREE.Texture>(resolve => {
      fetch(textureFilename)
        .then(response => {
          // Create a blob from the data
          response
            .blob()
            .then(blob => {
              // Read blob uri
              const reader = new FileReader();

              reader.onloadend = () => {
                const dataUrl = reader.result as string;

                // Load the textue to three js
                const loader = new THREE.TextureLoader();
                loader.loadAsync(dataUrl).then(texture => {
                  // mesh.material.map = texture;
                  // Threejs transforms SVG files as PNGs in the scene and we need the
                  // raw data to send it to the SVG renderer, so we save it.
                  texture['sourceFile'] = dataUrl;
                  texture.name = textureFilename;
                  // mesh.material.needsUpdate = true;
                  resolve(texture);
                });
              };

              reader.readAsDataURL(blob);
            })
            .catch(() => {
              console.error('Could create blob from data', response);
            });
        })
        .catch(() => {
          console.error('Could not fetch texture', textureFilename);
        });
    });
  }