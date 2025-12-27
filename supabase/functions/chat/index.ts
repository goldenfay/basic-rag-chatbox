import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AIService, AIServiceError } from "./services/AIService.ts";

/**
 * Customer Support Chat - RAG-powered Edge Function
 * 
 * Uses OpenRouter API with configurable models for intelligent responses
 * based on company knowledge base provided by the client.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  knowledgeContext?: string;
  companyName?: string;
}

function createResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function createErrorResponse(message: string, status = 500): Response {
  return createResponse({ error: message }, status);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      conversationHistory = [], 
      knowledgeContext = '', 
      companyName = 'Our Company' 
    }: ChatRequest = await req.json();

    // Validate input
    if (!message || typeof message !== 'string') {
      console.error('[chat] Invalid message received');
      return createErrorResponse('Message is required', 400);
    }

    console.log(`[chat] Processing for ${companyName}: "${message}"`);
    console.log(`[chat] Knowledge context provided: ${knowledgeContext ? 'yes' : 'no'}`);

    // Initialize AI service
    const aiService = AIService.create(companyName);

    // Build conversation with context
    const { messages, hasContext } = aiService.createConversation(
      message,
      knowledgeContext,
      conversationHistory
    );

    // Get AI response
    const { reply, model } = await aiService.complete({ messages });

    console.log(`[chat] Response generated successfully`);

    return createResponse({
      reply,
      hasContext,
      model,
    });

  } catch (error) {
    console.error('[chat] Error:', error);

    // Handle known AI service errors
    if (error instanceof AIServiceError) {
      return createErrorResponse(error.userMessage, error.statusCode);
    }

    // Handle unexpected errors
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
});
