import type { 
  Quest, 
  Habit, 
  Campaign, 
  FocusEffortLog, 
  Achievement, 
  PlayerProfile, 
  ChestSlot, 
  EconomyTransaction,
  WeeklyReview,
  ProductivitySnapshot
} from '../types';

export interface AIProviderConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface AIRequest {
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string | null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIProvider {
  private config: AIProviderConfig;
  
  constructor(config: AIProviderConfig) {
    this.config = config;
  }
  
  async chatCompletion(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: request.messages,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 1000,
          stream: request.stream ?? false
        })
      });
      
      if (!response.ok) {
        throw new Error(`AI provider error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI provider request failed:', error);
      throw error;
    }
  }
  
  isAvailable(): boolean {
    return !!this.config.baseUrl && !!this.config.apiKey && !!this.config.model;
  }
}

// Factory function to create provider from environment variables
export function createAIProviderFromEnv(): AIProvider | null {
  // In production, these would come from environment variables
  // For security, we never expose these in the frontend bundle
  const baseUrl = import.meta.env.VITE_AI_BASE_URL || '';
  const apiKey = import.meta.env.VITE_AI_API_KEY || '';
  const model = import.meta.env.VITE_AI_MODEL || '';
  
  if (!baseUrl || !apiKey || !model) {
    console.warn('AI provider not configured - missing environment variables');
    return null;
  }
  
  return new AIProvider({
    baseUrl,
    apiKey,
    model
  });
}