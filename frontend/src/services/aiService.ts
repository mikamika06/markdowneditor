import { api } from './api';

export interface AIRequest {
    text: string;
    target_language?: string;
}

export interface AIResponse {
    success: boolean;
    result: string;
    provider_used?: string;
}

export class AIService {

    static async autocomplete(text: string): Promise<string> {
        try {
            const response = await api.post<AIResponse>('/ai/autocomplete', {
                text
            });

            if (response.data.success) {
                return response.data.result;
            } else {
                throw new Error('AI autocomplete failed');
            }
        } catch (error) {
            console.error('Autocomplete error:', error);
            throw new Error('Failed to autocomplete text');
        }
    }

    static async checkGrammar(text: string): Promise<string> {
        try {
            const response = await api.post<AIResponse>('/ai/grammar', {
                text
            });

            if (response.data.success) {
                return response.data.result;
            } else {
                throw new Error('AI grammar check failed');
            }
        } catch (error) {
            console.error('Grammar check error:', error);
            throw new Error('Failed to check grammar');
        }
    }

    static async translate(text: string, targetLanguage: string): Promise<string> {
        try {
            const response = await api.post<AIResponse>('/ai/translate', {
                text,
                target_language: targetLanguage
            });

            if (response.data.success) {
                return response.data.result;
            } else {
                throw new Error('AI translation failed');
            }
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Failed to translate text');
        }
    }
}