import favicon from '~/assets/images/favicon.png';
import icon192 from '~/assets/images/icon192.png';
import icon512 from '~/assets/images/icon512.png';

export function render() {
  return JSON.stringify({
    short_name: 'React App',
    name: 'Create React App Sample',
    icons: [
      {
        src: favicon,
        sizes: '64x64',
        type: 'image/png'
      },
      {
        src: icon192,
        type: 'image/png',
        sizes: '192x192'
      },
      {
        src: icon512,
        type: 'image/png',
        sizes: '512x512'
      }
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: '#000',
    background_color: '#5a90bb'
  });
}