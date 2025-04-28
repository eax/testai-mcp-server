import { Application, Request, Response } from 'express';
import GherkinGenerator from '../gherkin/generator';

export function setRoutes(app: Application): void {
    // Health check route
    app.get('/health', (req: Request, res: Response): void => {
        res.status(200).json({ status: 'ok' });
    });

    // Gherkin feature generation route
    app.post('/generate', (req: Request, res: Response): void => {
        const { title, description, tags, scenarios } = req.body as {
            title: string;
            description?: string;
            tags?: string[];
            scenarios: Array<{
                name: string;
                steps: Array<{ type: 'Given' | 'When' | 'Then' | 'And'; text: string }>;
            }>;
        };

        // Validate required fields
        if (!title || !scenarios || scenarios.length === 0) {
            res.status(400).json({ error: 'Missing required fields: title or scenarios' });
            return;
        }

        const generator = new GherkinGenerator();
        const feature = generator.generateFeature({
            title,
            description,
            tags,
            scenarios,
        });

        res.status(200).json({ feature });
    });
}