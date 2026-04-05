// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  base: '/public-opinion-survey-2026',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});