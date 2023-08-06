import '~/sass/index.scss';
import { usePageContext } from '../renderer/usePageContext';
import favicon from '~/assets/images/favicon.png';
import App from '~/components/App';

export function PageHead() {
  const description = 'Solve a web of word associations in this re-creation of a classic puzzle game!';
  const title = 'webAssociate';
  const urlBase = 'https://www.halfside.net/webassociate';

  const { urlPathname } = usePageContext();

  const url = urlBase + urlPathname;

  return (
    <head>
      <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />

      <title>
        {title}
      </title>
      <meta name="description" content={description} />

      <link rel="shortcut icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />

      <meta name="theme-color" content="#fff" />

      <link rel="manifest" href="/webmanifest.json" />

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
