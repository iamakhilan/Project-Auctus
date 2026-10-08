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

const STORAGE_KEY_AI_API_KEY = 'auctus_ai_api_key';
const DEFAULT_BASE_URL = 'https://freellmapi-juob.onrender.com/v1';
const DEFAULT_MODEL = 'auto:default';

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

  updateApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  getConfig(): AIProviderConfig {
    return { ...this.config };
  }
}

function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_AI_API_KEY) || '';
  } catch {
    return '';
  }
}

function setStoredApiKey(apiKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_AI_API_KEY, apiKey);
  } catch {
    // Ignore storage errors
  }
}

function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AI_API_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Factory function to create provider from stored user API key
export function createAIProviderFromStorage(): AIProvider | null {
  const baseUrl = DEFAULT_BASE_URL;
  const apiKey = getStoredApiKey();
  const model = DEFAULT_MODEL;

  if (!baseUrl || !apiKey || !model) {
    return null;
  }

  return new AIProvider({
    baseUrl,
    apiKey,
    model
  });
}

// Check if user has configured their API key
export function hasUserConfiguredApiKey(): boolean {
  return !!getStoredApiKey();
}

// Set user's API key and return new provider instance
export function setUserApiKey(apiKey: string): AIProvider {
  setStoredApiKey(apiKey);
  return new AIProvider({
    baseUrl: DEFAULT_BASE_URL,
    apiKey,
    model: DEFAULT_MODEL
  });
}

// Clear user's API key
export function clearUserApiKey(): void {
  clearStoredApiKey();
}