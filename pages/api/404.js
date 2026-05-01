export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.status(404).json({
    error: 'Not found',
    code: 404,
    message: `API endpoint ${req.url} does not exist`,
    docs: 'https://logwick.io/docs',
    openapi: 'https://logwick.io/openapi.json'
  })
}
