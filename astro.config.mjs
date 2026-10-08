// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Поддержка деплоя на GitHub Pages и другие статические хостинги
  // Если репозиторий разворачивается в подпапку: ASTRO_BASE=/DateCountingWeb/ npm run build
  base: process.env.ASTRO_BASE || '/',
});
