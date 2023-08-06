import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { PageShell } from './PageShell';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server';
import { PageContextProvider } from './usePageContext';
import type { PageContextServer } from './types';

export const passToClient = ['pageProps', 'urlPathname']

export async function render(pageContext: PageContextServer) {
  const { exports, Page, pageProps, urlPathname } = pageContext;
  const { PageHead } = exports;

  if (!PageHead) {
    throw new Error(`Error rendering ${urlPathname}: PageHead function is undefined or not exported`);
  }
  if (!Page) {
    throw new Error(`Error rendering ${urlPathname}: Page function is undefined or not exported`);
  }

  const pageHeadHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <PageHead {...pageProps} />
      </PageContextProvider>
    </React.StrictMode>
  );
  const pageHtml = ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      ${dangerouslySkipEscape(pageHeadHtml)}
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    }
  }
}
