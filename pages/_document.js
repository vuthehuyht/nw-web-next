import Document, { Html, Head, Main, NextScript } from "next/document";
// import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from "@material-ui/core/styles";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheets();
    const page = renderPage(
      (App) => (props) => sheet.collect(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    const isProduction = process.env.DEPLOY_ENV === "production";
    return (
      <Html>
        <Head>
          <link rel="icon" href="/assets/images/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
            rel="stylesheet"
          />
          {/* Google Tag Manager */}
          {!isProduction && <meta name="robots" content="noindex" />}
          {!isProduction ? (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=gHDs6k-upvQsW-hxAvbR2A&gtm_preview=env-11&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P843WJH');
                `,
              }}
            />
          ) : (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=sP50WEFF4mWqi27NWXJ1YA&gtm_preview=env-2&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P843WJH');
                `,
              }}
            />
          )}
          {this.props.styleTags}
        </Head>
        <body>
          {!isProduction ? (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P843WJH&gtm_auth=gHDs6k-upvQsW-hxAvbR2A&gtm_preview=env-11&gtm_cookies_win=x"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              }}
            />
          ) : (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P843WJH&gtm_auth=sP50WEFF4mWqi27NWXJ1YA&gtm_preview=env-2&gtm_cookies_win=x"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              }}
            />
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
