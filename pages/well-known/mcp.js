export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    name: 'Logwick MCP Server',
    version: '1.0.1',
    description: 'Query and ingest AI agent logs via natural language',
    transport: 'stdio',
    install: { command: 'npx', args: ['-y', '@logwick/mcp'], env: { LOGWICK_API_KEY: 'your-api-key' } },
    tools: ['ingest_log', 'query_logs', 'get_stats', 'get_log', 'delete_log'],
    registry: 'https://npmjs.com/package/@logwick/mcp',
    serverCard: 'https://logwick.io/.well-known/mcp/server-card.json'
  })
}
