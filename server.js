import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import app from './lib/app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || process.env.AUDIT_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Serve static portfolio — local dev and Hostinger; Vercel serves static via filesystem
app.use(express.static(join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0', async () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Audit backend + site running on port ${PORT}`);

  if (!isProduction) {
    try {
      const { default: open } = await import('open');
      await open(url);
    } catch {
      console.log('Open in browser:', url);
    }
  }
});
