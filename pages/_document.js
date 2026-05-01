import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="Logwick — the audit log for AI agents. Every prompt, response, and error your AI agents produce, logged and searchable." />

        {/* OpenGraph */}
        <meta property="og:title" content="Logwick — AI Audit Log" />
        <meta property="og:description" content="Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it." />
        <meta property="og:url" content="https://logwick.io" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@logwickio" />
        <meta name="twitter:title" content="Logwick — AI Audit Log" />
        <meta name="twitter:description" content="Every prompt, response, and error your AI agents produce — logged, searchable, and always there when you need it." />

        {/* RFC 8288 Link headers */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="text/markdown" href="/index.md" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLMs documentation" />
        <link rel="alternate" type="application/json" href="/openapi.json" title="OpenAPI specification" />
        <link rel="service.desc" type="application/openapi+json" href="/openapi.json" />
        <link rel="service.desc" type="application/openapi+json" href="/.well-known/openapi.json" />

        {/* Structured data — full schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
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
                  "https://pypi.org/project/logwick",
                  "https://twitter.com/logwickio",
                  "https://linkedin.com/company/logwick"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Logwick",
                "url": "https://logwick.io",
                "logo": "https://logwick.io/favicon.svg",
                "description": "The audit log for AI agents.",
                "email": "hello@logwick.io",
                "foundingDate": "2026",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "hello@logwick.io",
                  "contactType": "customer support",
                  "availableLanguage": "English"
                },
                "sameAs": [
                  "https://github.com/logwickio",
                  "https://twitter.com/logwickio"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Will Logwick slow down my app?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No. Every log call is fire and forget — your AI response returns first, the log sends in the background. Zero latency impact." }
                  },
                  {
                    "@type": "Question",
                    "name": "What AI models does Logwick support?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Logwick works with any AI model — GPT-4o, Claude, Gemini, Mistral, LangChain, and any custom model. If you can make an HTTP request, you can use Logwick." }
                  },
                  {
                    "@type": "Question",
                    "name": "How much does Logwick cost?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Logwick is free for up to 5,000 logs/month. Pro is $29/month for 100,000 logs. AI agents can pay $0.001 USDC per log with no account required." }
                  },
                  {
                    "@type": "Question",
                    "name": "Does Logwick work with LangChain?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. Logwick has a LangChain callback handler that automatically logs every LLM call in your chain with one line of setup code." }
                  },
                  {
                    "@type": "Question",
                    "name": "Can AI agents use Logwick without a human account?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes. Logwick supports x402 pay-per-log on Base mainnet. AI agents pay $0.001 USDC per log — no account, no API key, no human required." }
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Logwick",
                "url": "https://logwick.io",
                "description": "The audit log for AI agents",
                "speakable": {
                  "@type": "SpeakableSpecification",
                  "cssSelector": ["h1", ".hero-tagline", ".product-description"]
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://logwick.io/docs?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://logwick.io" },
                  { "@type": "ListItem", "position": 2, "name": "Docs", "item": "https://logwick.io/docs" },
                  { "@type": "ListItem", "position": 3, "name": "Blog", "item": "https://logwick.io/blog" },
                  { "@type": "ListItem", "position": 4, "name": "Compare", "item": "https://logwick.io/compare" }
                ]
              }
            ])
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
