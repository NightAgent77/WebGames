import { defineConfig } from 'vite';
import { createReadStream, cpSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, 'assets');

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
};

/** Serves ./assets in dev and copies it to dist/assets on build. */
function phaserAssets() {
  return {
    name: 'phaser-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/assets/')) {
          next();
          return;
        }

        const rel = decodeURIComponent(req.url.split('?')[0].slice('/assets/'.length));
        const file = path.resolve(assetsDir, rel);

        if (!file.startsWith(assetsDir) || !existsSync(file) || !statSync(file).isFile()) {
          next();
          return;
        }

        const ext = path.extname(file).toLowerCase();
        if (MIME[ext]) res.setHeader('Content-Type', MIME[ext]);
        createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      cpSync(assetsDir, path.resolve(__dirname, 'dist/assets'), { recursive: true });
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [phaserAssets()],
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'bundled',
  },
});
