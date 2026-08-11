/**
 * Re-upload dist/ to Supabase Storage with correct Content-Types.
 *
 * Usage:
 *   SUPABASE_URL="https://xxxx.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
 *   npm run deploy:supabase
 *
 * Optional:
 *   SUPABASE_BUCKET=games
 *   SUPABASE_PREFIX=snake-run
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET = process.env.SUPABASE_BUCKET || 'games';
const PREFIX = (process.env.SUPABASE_PREFIX || 'snake-run').replace(/^\/|\/$/g, '');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

function shouldSkip(name) {
  return name.startsWith('._') || name === '.DS_Store' || name === '.gitkeep';
}

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (shouldSkip(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full, base)));
    } else if (entry.isFile()) {
      out.push({ full, rel: path.relative(base, full).split(path.sep).join('/') });
    }
  }
  return out;
}

async function upload(rel, full) {
  const ext = path.extname(rel).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const objectPath = `${PREFIX}/${rel}`;
  const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`;
  const body = await readFile(full);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      'content-type': contentType,
      'x-upsert': 'true',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${objectPath}: ${res.status} ${text}`);
  }

  console.log(`✓ ${objectPath}  (${contentType})`);
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(`Missing env vars.

From Supabase → Project Settings → API, copy:
  Project URL  → SUPABASE_URL
  service_role  → SUPABASE_SERVICE_ROLE_KEY  (secret — do not commit)

Then run:

  SUPABASE_URL="https://xxxx.supabase.co" \\
  SUPABASE_SERVICE_ROLE_KEY="eyJ..." \\
  npm run deploy:supabase
`);
    process.exit(1);
  }

  try {
    const st = await stat(distDir);
    if (!st.isDirectory()) throw new Error('dist is not a folder');
  } catch {
    console.error('No dist/ folder. Run: npm run build');
    process.exit(1);
  }

  const files = await walk(distDir);
  if (!files.length) {
    console.error('dist/ is empty. Run: npm run build');
    process.exit(1);
  }

  console.log(`Uploading ${files.length} files → ${BUCKET}/${PREFIX}/ ...\n`);

  for (const file of files) {
    await upload(file.rel, file.full);
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${PREFIX}/index.html`;
  console.log(`\nDone. Open this URL in a new browser tab:\n\n  ${publicUrl}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
