/**
 * AIService - Handles all AI model interactions via OpenRouter API
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AICompletionResponse {
  reply: string;
  model: string;
}

export interface AIServiceConfig {
  apiKey: string;
  model: string;
  companyName: string;
  referer?: string;
}

export class AIServiceError extends Error {
  public statusCode: number;
  public userMessage: string;

  constructor(message: string, statusCode: number, userMessage: string) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}

export class AIService {
  private readonly apiUrl: string;
  private static readonly DEFAULT_MAX_TOKENS = 500;
  private static readonly DEFAULT_TEMPERATURE = 0.3;
  private static readonly TIMEOUT_MS = 30000;

  private apiKey: string;
  private model: string;
  private companyName: string;
  private referer: string;

  constructor(config: AIServiceConfig & { apiUrl: string }) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.companyName = config.companyName;
    this.referer = config.referer || 'https://faytech-support.lovable.app';
  }

  /**
   * Builds the system prompt based on context availability
   */
  buildSystemPrompt(context: string, hasContext: boolean): string {
    if (!hasContext) {
      return `You are a professional customer support agent for ${this.companyName}.

CRITICAL: The user's question does not match any information in your knowledge base.

You MUST respond with exactly:
"I'm sorry, I don't have information about that. Please contact our support team for assistance."

Do NOT attempt to answer the question. Do NOT make up any information.`;
    }

    return `You are a professional customer support agent for ${this.companyName}.

STRICT RULES YOU MUST FOLLOW:
1. Answer ONLY using the information provided in the CONTEXT below.
2. If the CONTEXT doesn't fully answer the question, say what you know and mention you don't have more details.
3. NEVER invent or assume information not in the CONTEXT.
4. Be helpful, professional, and concise.
5. Use a friendly but professional tone.
6. When answering questions, synthesize the information naturally - don't just quote the sources.

CONTEXT FROM KNOWLEDGE BASE:
${context}

---END OF CONTEXT---

Answer the user's question using ONLY the information above. If you cannot answer from the context, say "I don't have specific information about that. Please contact our support team for assistance."`;
  }

  /**
   * Sends a chat completion request to OpenRouter
   */
  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    console.log(`[AIService] Sending request to model: ${this.model}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIService.TIMEOUT_MS);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': this.referer,
          'X-Title': `${this.companyName} Support Chat`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: request.messages,
          max_tokens: request.maxTokens ?? AIService.DEFAULT_MAX_TOKENS,
          temperature: request.temperature ?? AIService.DEFAULT_TEMPERATURE,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        this.handleHttpError(response.status, errorText);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response.";

      console.log(`[AIService] Response received successfully`);

      return {
        reply,
        model: this.model,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof AIServiceError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AIServiceError(
          'Request timeout',
          504,
          'The AI service took too long to respond. Please try again.'
        );
      }

      console.error(`[AIService] Unexpected error:`, error);
      throw new AIServiceError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'An unexpected error occurred. Please try again.'
      );
    }
  }

  /**
   * Handles HTTP errors and throws appropriate AIServiceError
   */
  private handleHttpError(status: number, errorText: string): never {
    console.error(`[AIService] API Error: ${status}`, errorText);

    switch (status) {
      case 429:
        throw new AIServiceError(
          'Rate limit exceeded',
          429,
          'Service is busy. Please try again in a moment.'
        );
      case 401:
      case 403:
        throw new AIServiceError(
          'Authentication failed',
          500,
          'AI service authentication failed. Please check API key.'
        );
      case 400:
        throw new AIServiceError(
          'Bad request',
          400,
          'Invalid request to AI service.'
        );
      default:
        throw new AIServiceError(
          `OpenRouter error: ${status}`,
          500,
          'Failed to generate response. Please try again.'
        );
    }
  }

  /**
   * Creates a full chat conversation with system prompt and history
   */
  createConversation(
    userMessage: string,
    knowledgeContext: string,
    conversationHistory: ChatMessage[] = []
  ): { messages: ChatMessage[]; hasContext: boolean } {
    const hasContext = !!knowledgeContext && knowledgeContext.trim().length > 0;
    const systemPrompt = this.buildSystemPrompt(knowledgeContext, hasContext);

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage },
    ];

    return { messages, hasContext };
  }

  /**
   * Static factory method to create AIService instance
   */
  static create(companyName: string): AIService {
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new AIServiceError(
        'OPENROUTER_API_KEY not configured',
        500,
        'AI service not configured. Please add OPENROUTER_API_KEY.'
      );
    }

    const apiUrl = Deno.env.get('OPENROUTER_API_URL') || 'https://openrouter.ai/api/v1/chat/completions';
    const model = Deno.env.get('OPENROUTER_MODEL') || 'mistralai/mistral-7b-instruct:free';

    return new AIService({
      apiUrl,
      apiKey,
      model,
      companyName,
    });
  }
}
