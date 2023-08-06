import { dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import favicon from '~/assets/images/favicon.png';
import logo192 from '~/assets/images/logo192.png';
import logo512 from '~/assets/images/logo512.png';

export function render() {
  return dangerouslySkipEscape(JSON.stringify({
    short_name: 'React App',
    name: 'Create React App Sample',
    icons: [
      {
        src: favicon,
        sizes: '64x64',
        type: 'image/png'
      },
      {
        src: logo192,
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: logo512,
        type: 'image/png',
        sizes: '512x512'
      }
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: '#000',
    background_color: '#fff'
  }));
}