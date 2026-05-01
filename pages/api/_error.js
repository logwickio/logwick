export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.status(500).json({
    error: 'Internal server error',
    code: 500,
    message: 'An unexpected error occurred',
    docs: 'https://logwick.io/docs'
  })
}
