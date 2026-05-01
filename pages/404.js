export default function NotFound() {
  return null
}

export async function getServerSideProps({ req, res }) {
  const accept = req.headers['accept'] || ''
  if (accept.includes('application/json') || req.url?.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 404
    res.end(JSON.stringify({
      error: 'Not found',
      code: 404,
      docs: 'https://logwick.io/docs',
      openapi: 'https://logwick.io/openapi.json'
    }))
    return { props: {} }
  }
  return { props: {} }
}
