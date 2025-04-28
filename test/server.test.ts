import request from 'supertest';
import express from 'express';
import { setRoutes } from '../src/routes/index';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

jest.mock('@modelcontextprotocol/sdk/server/mcp.js');
jest.mock('@modelcontextprotocol/sdk/server/streamableHttp.js');

describe('Gherkin MCP Server', () => {
    let app: express.Application;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        setRoutes(app);
    });

    describe('Health Check Route', () => {
        it('should respond with status 200 and a JSON object', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'ok' });
        });
    });

    describe('Gherkin Feature Generation Route', () => {
        it('should generate a Gherkin feature file with valid input', async () => {
            const requestBody = {
                title: 'User Login',
                description: 'This feature allows users to log in.',
                tags: ['authentication', 'login'],
                scenarios: [
                    {
                        name: 'Successful login',
                        steps: [
                            { type: 'Given', text: 'the user is on the login page' },
                            { type: 'When', text: 'the user enters valid credentials' },
                            { type: 'Then', text: 'the user is redirected to the dashboard' }
                        ]
                    }
                ]
            };

            const response = await request(app)
                .post('/generate')
                .send(requestBody);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('feature');
            expect(response.body.feature).toContain('Feature: User Login');
            expect(response.body.feature).toContain('Given the user is on the login page');
        });

        it('should return 400 if required fields are missing', async () => {
            const requestBody = {
                description: 'This feature allows users to log in.',
                tags: ['authentication', 'login']
            };

            const response = await request(app)
                .post('/generate')
                .send(requestBody);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Missing required fields: title or scenarios' });
        });

        it('should return 400 if scenarios are empty', async () => {
            const requestBody = {
                title: 'User Login',
                description: 'This feature allows users to log in.',
                tags: ['authentication', 'login'],
                scenarios: []
            };

            const response = await request(app)
                .post('/generate')
                .send(requestBody);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Missing required fields: title or scenarios' });
        });
    });

    describe('MCP Server Integration', () => {
        it('should initialize the MCP server and transport', async () => {
            const mockConnect = jest.fn();
            McpServer.prototype.connect = mockConnect;

            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined,
                enableJsonResponse: true
            });

            const server = new McpServer({
                name: 'Gherkin MCP Server',
                version: '1.0.0'
            });

            await server.connect(transport);

            expect(mockConnect).toHaveBeenCalledWith(transport);
        });
    });
});