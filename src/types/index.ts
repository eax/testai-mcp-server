export interface RequestData {
    title: string;
    description: string;
    scenarios: ScenarioData[];
}

export interface ScenarioData {
    name: string;
    steps: string[];
}

export interface ResponseData {
    success: boolean;
    message: string;
    featureFilePath?: string;
}