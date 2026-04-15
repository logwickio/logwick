import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="Logwick — the audit log for AI agents. Leave a trail." />
        <meta property="og:title" content="Logwick — AI Audit Log" />
        <meta property="og:description" content="Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it." />
        <meta property="og:url" content="https://logwick.io" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
