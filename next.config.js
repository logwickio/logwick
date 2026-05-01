/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['csv-stringify'],
  },
}

nextConfig.redirects = async () => [
  {
    source: '/.well-known/mcp',
    destination: '/.well-known/mcp.json',
    permanent: false,
  },
]

nextConfig.headers = async () => [
  {
    source: '/.well-known/api-catalog',
    headers: [
      { key: 'Content-Type', value: 'application/linkset+json;profile="https://www.rfc-editor.org/info/rfc9727"' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
  {
    source: '/.well-known/mcp',
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
  {
    source: '/.well-known/mcp.json',
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
  {
    source: '/.well-known/mcp/server-card.json',
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
  {
    source: '/.well-known/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ],
  },
]

module.exports = nextConfig
