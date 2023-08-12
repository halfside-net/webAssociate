import '~/sass/index.scss';
import { usePageContext } from '../renderer/usePageContext';
import { description, siteDomain, sitePath, themeColor, title } from '../siteconfig.json';
import favicon from '~/assets/images/favicon.png';
import App from '~/components/App';

export function PageHead() {
  const urlBase = `https://${siteDomain}${sitePath}`;

  const { urlPathname } = usePageContext();

  const url = urlBase + urlPathname;

  return (
    <head>
      <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />

      <title>
        {title}
      </title>
      <meta name="description" content={description} />

      <link rel="shortcut icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />

      <meta name="theme-color" content={themeColor} />

      <link rel="manifest" href={urlBase + 'webmanifest.json'} />

      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={favicon} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary" />
    </head>
  );
}

export function Page() {
  return (
    <App />
  );
}
