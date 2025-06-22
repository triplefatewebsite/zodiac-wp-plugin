import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // Stop Vite from trying to clear the console
  clearScreen: false,
  build: {
    outDir: path.resolve(__dirname, 'build'),
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      // The name of the global variable for the IIFE bundle
      name: 'ZodiacSlotMachine',
      // The filename of the bundled output
      fileName: 'main',
      // Build a self-executing IIFE format for direct browser use
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // Ensure the CSS file is named main.css
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
