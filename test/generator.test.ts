import GherkinGenerator from '../src/gherkin/generator';

describe('GherkinGenerator', () => {
    let generator: GherkinGenerator;

    beforeEach(() => {
        generator = new GherkinGenerator();
    });

    describe('generateFeature', () => {
        it('should generate a feature with title and description', () => {
            const feature = generator.generateFeature({
                title: 'User Login',
                description: 'This feature allows users to log in.',
                scenarios: []
            });

            expect(feature).toContain('Feature: User Login');
            expect(feature).toContain('This feature allows users to log in.');
        });

        it('should include feature-level tags', () => {
            const feature = generator.generateFeature({
                title: 'User Login',
                tags: ['authentication', 'login'],
                scenarios: []
            });

            expect(feature).toContain('@authentication @login');
        });

        it('should include background steps', () => {
            const feature = generator.generateFeature({
                title: 'User Login',
                background: { steps: ['Given the user is on the login page'] },
                scenarios: []
            });

            expect(feature).toContain('Background:');
            expect(feature).toContain('Given the user is on the login page');
        });

        it('should generate scenarios with steps', () => {
            const feature = generator.generateFeature({
                title: 'User Login',
                scenarios: [
                    {
                        name: 'Successful login',
                        steps: [
                            { type: 'Given', text: 'the user enters valid credentials' },
                            { type: 'When', text: 'the user clicks the login button' },
                            { type: 'Then', text: 'the user is redirected to the dashboard' }
                        ]
                    }
                ]
            });

            expect(feature).toContain('Scenario: Successful login');
            expect(feature).toContain('Given the user enters valid credentials');
            expect(feature).toContain('When the user clicks the login button');
            expect(feature).toContain('Then the user is redirected to the dashboard');
        });

        it('should include scenario-level tags', () => {
            const feature = generator.generateFeature({
                title: 'User Login',
                scenarios: [
                    {
                        name: 'Successful login',
                        tags: ['happy-path'],
                        steps: []
                    }
                ]
            });

            expect(feature).toContain('@happy-path');
        });

        it('should handle multiple scenarios and steps', () => {
            const feature = generator.generateFeature({
                title: 'User Management',
                scenarios: [
                    {
                        name: 'Create a new user',
                        steps: [
                            { type: 'Given', text: 'the admin is logged in' },
                            { type: 'When', text: 'the admin creates a new user' },
                            { type: 'Then', text: 'the user is added to the system' }
                        ]
                    },
                    {
                        name: 'Delete a user',
                        steps: [
                            { type: 'Given', text: 'the admin is logged in' },
                            { type: 'When', text: 'the admin deletes a user' },
                            { type: 'Then', text: 'the user is removed from the system' }
                        ]
                    }
                ]
            });

            expect(feature).toContain('Scenario: Create a new user');
            expect(feature).toContain('Scenario: Delete a user');
            expect(feature).toContain('the admin creates a new user');
            expect(feature).toContain('the admin deletes a user');
        });

        it('should handle empty tags, background, and scenarios gracefully', () => {
            const feature = generator.generateFeature({
                title: 'Empty Feature',
                scenarios: []
            });

            expect(feature).toContain('Feature: Empty Feature');
            expect(feature).not.toContain('@');
            expect(feature).not.toContain('Background:');
            expect(feature).not.toContain('Scenario:');
        });

        it('should throw an error if title is missing', () => {
            expect(() => {
                generator.generateFeature({
                    title: '',
                    scenarios: []
                });
            }).toThrowError('Feature title is required');
        });
    });

    describe('saveFeature', () => {
        it('should save the feature content to a file', async () => {
            const content = 'Feature: Example Feature';
            const filePath = './example.feature';

            const fs = require('fs').promises;
            jest.spyOn(fs, 'writeFile').mockResolvedValueOnce(undefined);

            await generator.saveFeature(filePath, content);

            expect(fs.writeFile).toHaveBeenCalledWith(filePath, content, 'utf8');
        });

        it('should throw an error if file path is invalid', async () => {
            const content = 'Feature: Example Feature';
            const filePath = '';

            const fs = require('fs').promises;
            jest.spyOn(fs, 'writeFile').mockRejectedValueOnce(new Error('Invalid file path'));

            await expect(generator.saveFeature(filePath, content)).rejects.toThrow('Invalid file path');
        });
    });
});