import { description, sitePath, themeColor, title, titleShort } from '../siteconfig.json';
import favicon from '~/assets/images/favicon.png';
import icon192 from '~/assets/images/icon192.png';
import icon512 from '~/assets/images/icon512.png';

export function render() {
  return JSON.stringify({
    background_color: themeColor,
    description,
    display: 'standalone',
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
    launch_handler: {
      client_mode: 'focus-existing'
    },
    name: title,
    scope: sitePath,
    short_name: titleShort,
    start_url: sitePath,
    theme_color: themeColor,
  });
}