import { description, sitePath, themeColor, title, titleShort } from '../siteconfig.json';
import icons from '~/assets/images/icon.png?w=58;64;72;76;80;87;96;114;120;128;144;152;167;180;192;256;384;512;1024';

const iconSizes = [58, 64, 72, 76, 80, 87, 96, 114, 120, 128, 144, 152, 167, 180, 192, 256, 384, 512, 1024];

export function render() {
  return JSON.stringify({
    background_color: themeColor,
    description,
    display: 'standalone',
    icons: iconSizes.map((size, i) => ({
      sizes: `${size}x${size}`,
      src: icons[i],
      type: 'image/png'
    })),
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