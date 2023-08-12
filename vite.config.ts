import path from 'path';
import { defineConfig } from 'vite';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import react from '@vitejs/plugin-react';
import { ssr } from 'vite-plugin-ssr/plugin';
import svgr from "vite-plugin-svgr";

import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegExifRotate from 'imagemin-jpeg-exif-rotate';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminSvgo from 'imagemin-svgo';
import imageminZopfli from 'imagemin-zopfli';

import { sitePath } from './siteconfig.json';

const srcDir = 'src';
const outDir = 'dist';

const svgoConfig = {
  removeViewBox: false
};

// https://vitejs.dev/config/
export default defineConfig({
  base: sitePath,
  build: {
    outDir
  },
  plugins: [
    react(),
    ssr({
      prerender: {
        noExtraDir: true
      }
    }),
    svgr({
      svgrOptions: {
        svgoConfig
      }
    }),
    viteImagemin({
      plugins: {
        gif: imageminGifsicle({ optimizationLevel: 3 }),
        jpg: [
          imageminJpegExifRotate(),
          imageminMozjpeg({
            quality: 100
          })
        ],
        png: imageminZopfli({ more: true, transparent: true }),
        svg: imageminSvgo({
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: svgoConfig
              }
            }
          ]
        })
      }
    })
  ],
  publicDir: path.join(srcDir, 'static'),
  resolve: {
    alias: {
      '~': path.resolve(srcDir)
    }
  }
});
