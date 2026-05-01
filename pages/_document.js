import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="Logwick — the audit log for AI agents. Every prompt, response, and error your AI agents produce, logged and searchable." />

        <meta property="og:title" content="Logwick — AI Audit Log" />
        <meta property="og:description" content="Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it." />
        <meta property="og:url" content="https://logwick.io" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@logwickio" />
        <meta name="twitter:title" content="Logwick — AI Audit Log" />
        <meta name="twitter:description" content="Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it." />

        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt — AI agent documentation" />
        <link rel="alternate" type="application/json" href="/openapi.json" title="OpenAPI specification" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Logwick",
              "description": "The audit log for AI agents. Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it.",
              "url": "https://logwick.io",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": [
                { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD" },
                { "@type": "Offer", "name": "Pro", "price": "29", "priceCurrency": "USD", "billingIncrement": "P1M" }
              ],
              "author": {
                "@type": "Organization",
                "name": "Logwick",
                "url": "https://logwick.io",
                "email": "hello@logwick.io"
              },
              "sameAs": [
                "https://github.com/logwickio",
                "https://npmjs.com/package/logwick",
                "https://pypi.org/project/logwick"
              ]
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
