import { AIProvider, AIRequest } from './aiProvider';
import { AIContextSnapshot, createAISummary } from './aiContext';

export interface AIReasoningResponse {
  summary: string;
  insights: string[];
  evidence: string[];
  recommendations: Array<{
    title: string;
    description: string;
    reason: string;
    action?: {
      type: 'rescheduleQuest' | 'createQuest' | 'splitQuest' | 'startFocus';
      payload: { duration?: number; questId?: string; questTitle?: string; newDate?: string; title?: string; description?: string; difficulty?: string; priority?: string };
    };
    relatedQuestIds?: string[];
  }>;
  confidence: number;
}

export class AUCTUSIntelligence {
  private provider: AIProvider;
  
  constructor(provider: AIProvider) {
    this.provider = provider;
  }
  
  /**
   * Generates a daily briefing based on the user's AUCTUS activity
   */
  async generateDailyBriefing(context: AIContextSnapshot): Promise<AIReasoningResponse> {
    const summary = createAISummary(context);
    
    const prompt = `
You are the AUCTUS Intelligence Layer, a high-level productivity reasoning engine for a gamified productivity RPG.
Your goal is to provide a structured, evidence-based daily briefing for the user based on their real AUCTUS activity.

SYSTEM CONTEXT:
AUCTUS uses an RPG metaphor (Quests, XP, Levels, Citadel, Vault).
Quests have difficulty tiers (Normal, Hard, Elite) and priorities.
Focus sessions use soundscapes and reward "Overcharge" for extra effort.

USER ACTIVITY SUMMARY:
${summary}

TASK:
Analyze recent activity and provide a daily briefing.
Focus on:
1. What happened recently (wins/losses).
2. Important patterns (e.g., underestimating task time, missing morning habits).
3. Risks (overdue quests, falling streaks).
4. Today's realistic capacity and recommended plan.

RESPONSE FORMAT:
You MUST respond in valid JSON format matching this structure:
{
  "summary": "Brief encouraging overview",
  "insights": ["3-5 specific data-driven observations"],
  "evidence": ["The specific AUCTUS data points that support your insights"],
  "recommendations": [
    {
      "title": "Action title",
      "description": "What to do",
      "reason": "Why this helps based on data",
      "action": { "type": "...", "payload": {} } // Optional structured action
    }
  ],
  "confidence": 0-1 score
}

Keep recommendations practical and grounded in the provided data. Do not provide generic motivational advice.
    `.trim();
    
    return await this.getStructuredReasoning(prompt);
  }
  
  /**
   * Answers a contextual question from the user about their productivity
   */
  async askAuctus(question: string, context: AIContextSnapshot): Promise<AIReasoningResponse> {
    const summary = createAISummary(context);
    
    const prompt = `
You are the AUCTUS Intelligence Layer. The user has asked a question about their productivity.
Answer using their real AUCTUS data.

USER QUESTION: "${question}"

USER ACTIVITY SUMMARY:
${summary}

TASK:
Reason about the user's question using their actual patterns and history.
If the question is "What should I work on right now?", look at Urgency scores, deadlines, and current time.
If the question is about habits, look at streak history and category balance.

RESPONSE FORMAT:
You MUST respond in valid JSON format matching the AUCTUS Intelligence structure.
    `.trim();
    
    return await this.getStructuredReasoning(prompt);
  }
  
  async decomposeQuest(questId: string, context: AIContextSnapshot): Promise<AIReasoningResponse> {
    const summary = createAISummary(context);
    const quest = context.quests.find(q => q.id === questId);
    
    const prompt = `
You are the AUCTUS Intelligence Layer.
The user wants to break down a large or overwhelming quest into smaller, actionable sub-quests.

QUEST TO DECOMPOSE: "${quest?.title || 'Unknown'}"
QUEST DESCRIPTION: "${quest?.description || 'No description provided'}"

USER ACTIVITY SUMMARY:
${summary}

TASK:
Break this quest down into 3-5 smaller, specific, and manageable sub-quests.
Each sub-quest should have a clear title, brief description, difficulty (normal/hard/elite), and priority (low/medium/high).

RESPONSE FORMAT:
You MUST respond in valid JSON format matching the AUCTUS Intelligence structure, where the "recommendations" contain the sub-quests.
Ensure each recommendation uses the action type "createQuest" and provides the title, description, difficulty, and priority in the payload.
    `.trim();
    
    return await this.getStructuredReasoning(prompt);
  }

  async getNextBestAction(context: AIContextSnapshot): Promise<AIReasoningResponse> {
    const summary = createAISummary(context);
    
    const prompt = `
You are the AUCTUS Intelligence Layer. 
Recommend the absolute best next action for the user to take right now.

CONSIDERATIONS:
1. Current deadlines and overdue status.
2. Urgency scores (provided in top priorities).
3. Historical performance (how long tasks actually take).
4. Campaign importance and milestone progress.
5. Current "Momentum" (recent completion streaks).

USER ACTIVITY SUMMARY:
${summary}

TASK:
Determine the single most impactful thing the user can do right now.
It could be starting a specific focus session, finishing a high-priority quest, or breaking down a large task.

RESPONSE FORMAT:
You MUST respond in valid JSON format matching the AUCTUS Intelligence structure.
    `.trim();
    
    return await this.getStructuredReasoning(prompt);
  }

  
  private async getStructuredReasoning(prompt: string): Promise<AIReasoningResponse> {
    if (!this.provider.isAvailable()) {
      throw new Error('AI Provider not available');
    }
    
    const request: AIRequest = {
      messages: [
        { role: 'system', content: 'You are the AUCTUS Intelligence Layer. You only respond in valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2 // Lower temperature for more consistent structured output
    };
    
    const response = await this.provider.chatCompletion(request);
    const content = response.choices[0].message.content;
    
    try {
      // Find JSON in response (handle potential preamble/markdown)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonStr) as AIReasoningResponse;
    } catch (_error) {
      console.error('Failed to parse AI reasoning response:', content);
      throw new Error('AI reasoning returned malformed data');
    }
  }
}