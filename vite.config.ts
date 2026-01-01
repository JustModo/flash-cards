import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    includedRoutes() {
      // Use standard node fs to read content
      // returning a Promise since we might be async
      const fs = require('fs');
      const p = require('path');

      const contentDir = p.resolve(__dirname, 'src/content');
      const files = fs.readdirSync(contentDir).filter((f: string) => f.endsWith('.json'));

      const dynamicRoutes: string[] = [];

      files.forEach((file: string) => {
        try {
          const content = JSON.parse(fs.readFileSync(p.join(contentDir, file), 'utf-8'));
          // Handle array of collections (like sample.json) or single collection
          const collections = Array.isArray(content) ? content : [content];

          collections.forEach((c: any) => {
            if (c.id) {
              dynamicRoutes.push(`/quiz/${c.id}`);
            }
          });
        } catch (e) {
          console.error(`Error parsing ${file} for SSG routes:`, e);
        }
      });

      return ['/', ...dynamicRoutes];
    }
  }
} as any)
