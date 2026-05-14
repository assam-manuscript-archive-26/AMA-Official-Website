import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  server: {
    port: 3000,
  },
  integrations: [
    react(),
  ],
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});