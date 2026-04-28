// Proxy AI Calls securely through the new Node Backend Server

import { getAuthHeaders, BACKEND_URL } from './apiService';

export interface AITaskParseResult {
    title: string;
    level: 'monthly' | 'weekly' | 'daily';
    description?: string;
    notes?: string;
}

export const aiService = {
    parsePromptIntoTasks: async (prompt: string, apiKey: string): Promise<AITaskParseResult[]> => {
        const response = await fetch(`${BACKEND_URL}/tasks/ai/generate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`Proxy AI Server Error`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }
};
