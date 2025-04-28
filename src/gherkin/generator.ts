class GherkinGenerator {
    generateFeature(data: {
        title: string;
        description?: string;
        tags?: string[];
        background?: { steps: string[] };
        scenarios: Array<{
            name: string;
            tags?: string[];
            steps: Array<{ type: 'Given' | 'When' | 'Then' | 'And'; text: string }>;
        }>;
    }): string {
        if (!data.title || data.title.trim() === '') {
            throw new Error('Feature title is required');
        }

        let feature = '';

        // Add feature-level tags
        if (data.tags && data.tags.length > 0) {
            feature += `${data.tags.map(tag => `@${tag}`).join(' ')}\n`;
        }

        // Add feature title
        feature += `Feature: ${data.title}\n`;

        // Add optional description
        if (data.description) {
            feature += `  ${data.description}\n\n`;
        }

        // Add background steps if provided
        if (data.background && data.background.steps.length > 0) {
            feature += `  Background:\n`;
            data.background.steps.forEach(step => {
                feature += `    ${step}\n`;
            });
            feature += '\n';
        }

        // Add scenarios
        data.scenarios.forEach(scenario => {
            // Add scenario-level tags
            if (scenario.tags && scenario.tags.length > 0) {
                feature += `  ${scenario.tags.map(tag => `@${tag}`).join(' ')}\n`;
            }

            feature += `  Scenario: ${scenario.name}\n`;
            scenario.steps.forEach(step => {
                feature += `    ${step.type} ${step.text}\n`;
            });
            feature += '\n';
        });

        return feature;
    }

    async saveFeature(filePath: string, content: string): Promise<void> {
        const fs = require('fs').promises;
        await fs.writeFile(filePath, content, 'utf8');
    }
}

export default GherkinGenerator;