import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Yükləmə qovluğu server/uploads. Proses hansı qovluqdan başladılsa da eyni yerdir.
export const UPLOAD_DIR = fileURLToPath(new URL('../../uploads/', import.meta.url));

// Yalnız bizim yüklədiyimiz (/uploads/...) faylları silir.
export async function removeUpload(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const file = path.join(UPLOAD_DIR, path.basename(url));
  await fs.unlink(file).catch(() => {});
}
