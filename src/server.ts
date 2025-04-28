import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { setRoutes } from './routes/index.js';

const app = express();
const server = new McpServer({
  name: 'Gherkin MCP Server',
  version: '1.0.0'
});

// Middleware to parse JSON requests
app.use(express.json());

// Set up routes
setRoutes(app);

// Create transport for the server
const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined, // Use undefined for stateless mode
  enableJsonResponse: true, // Enable JSON response for simplicity
  onsessioninitialized: (sessionId) => {
    console.log(`Session initialized with ID: ${sessionId}`);
  }
});

// Connect the server to the transport
(async () => {
  await server.connect(transport);

  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`MCP Gherkin Server listening on port ${PORT}`);
  });
})();
