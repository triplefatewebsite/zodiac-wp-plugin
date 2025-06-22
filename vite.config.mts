import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'build'),
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'ZodiacWPPlugin',
      // The filename of the bundled output.
      // This will produce main.js
      fileName: 'main',
      // We only need the ES module format for modern browsers/bundlers.
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        // This ensures our CSS file is named main.css
        assetFileNames: 'main.css',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
