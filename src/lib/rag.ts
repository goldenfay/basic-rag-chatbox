/**
 * RAG-lite Retrieval Engine
 * 
 * This module implements a simple keyword-based retrieval system
 * without the need for vector databases or embeddings.
 * 
 * How it works:
 * 1. Extract keywords from the user's question
 * 2. Score each knowledge chunk based on keyword matches
 * 3. Return the top-k most relevant chunks
 */

import { knowledgeBase, KnowledgeChunk } from '@/data/knowledgeBase';

// Common stop words to filter out from queries
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
  'the', 'to', 'was', 'were', 'will', 'with', 'what', 'where', 'when',
  'who', 'why', 'how', 'can', 'could', 'would', 'should', 'do', 'does',
  'did', 'have', 'had', 'i', 'my', 'me', 'we', 'you', 'your', 'they',
  'this', 'these', 'those', 'am', 'been', 'being', 'there', 'here',
  'just', 'about', 'also', 'some', 'any', 'all', 'more', 'other',
  'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too', 'very'
]);

// Question type indicators that help with scoring (aligned with NovaTech categories)
const QUESTION_PATTERNS: Record<string, string[]> = {
  services: ['services', 'offer', 'provide', 'build', 'develop', 'create', 'website', 'web', 'app', 'application', 'saas', 'mvp', 'chatbot', 'ai', 'api', 'ux', 'ui'],
  pricing: ['price', 'cost', 'pay', 'pricing', 'money', 'billing', 'invoice', 'rate', 'hourly', 'fixed', 'budget', 'quote', 'estimate', 'charge', 'fee', 'much'],
  support: ['help', 'support', 'contact', 'reach', 'call', 'email', 'hours', 'available', 'when', 'time', 'schedule', 'language', 'english', 'french'],
  process: ['process', 'workflow', 'steps', 'phases', 'start', 'begin', 'timeline', 'project', 'stages', 'consultation', 'delivery'],
  security: ['security', 'privacy', 'data', 'safe', 'secure', 'confidential', 'access', 'credentials', 'login', 'password', 'account', 'gdpr'],
  legal: ['refund', 'cancel', 'contract', 'agreement', 'legal', 'terms', 'scope', 'policy', 'cancellation'],
  faq: ['redesign', 'mobile', 'app', 'api', 'integration', 'maintain', 'maintenance', 'existing', 'third-party', 'legacy']
};

interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
  matchedKeywords: string[];
}

/**
 * Extract meaningful keywords from a user query
 */
export function extractKeywords(query: string): string[] {
  // Normalize: lowercase, remove punctuation, split into words
  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2) // Remove very short words
    .filter(word => !STOP_WORDS.has(word)); // Remove stop words
  
  // Deduplicate
  return [...new Set(words)];
}

/**
 * Detect the likely category/type of question
 */
export function detectQuestionType(keywords: string[]): string | null {
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [type, patterns] of Object.entries(QUESTION_PATTERNS)) {
    const matchCount = keywords.filter(kw => 
      patterns.some(pattern => kw.includes(pattern) || pattern.includes(kw))
    ).length;
    
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = type;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

/**
 * Score a chunk based on keyword relevance
 */
function scoreChunk(chunk: KnowledgeChunk, queryKeywords: string[]): RetrievalResult {
  const matchedKeywords: string[] = [];
  let score = 0;

  // Check matches against chunk keywords (higher weight)
  for (const queryKw of queryKeywords) {
    for (const chunkKw of chunk.keywords) {
      if (chunkKw.includes(queryKw) || queryKw.includes(chunkKw)) {
        score += 3; // Keyword match is highly relevant
        matchedKeywords.push(queryKw);
        break;
      }
    }
  }

  // Check matches in title (medium weight)
  const titleLower = chunk.title.toLowerCase();
  for (const queryKw of queryKeywords) {
    if (titleLower.includes(queryKw)) {
      score += 2;
      if (!matchedKeywords.includes(queryKw)) {
        matchedKeywords.push(queryKw);
      }
    }
  }

  // Check matches in content (lower weight)
  const contentLower = chunk.content.toLowerCase();
  for (const queryKw of queryKeywords) {
    if (contentLower.includes(queryKw)) {
      score += 1;
      if (!matchedKeywords.includes(queryKw)) {
        matchedKeywords.push(queryKw);
      }
    }
  }

  // Bonus for keyword density (more unique matches = more relevant)
  const uniqueMatches = new Set(matchedKeywords).size;
  score += uniqueMatches * 0.5;

  return { chunk, score, matchedKeywords: [...new Set(matchedKeywords)] };
}

/**
 * Retrieve the most relevant chunks for a query
 */
export function retrieveRelevantChunks(
  query: string,
  topK: number = 3,
  minScore: number = 2
): RetrievalResult[] {
  const queryKeywords = extractKeywords(query);
  
  if (queryKeywords.length === 0) {
    return [];
  }

  // Score all chunks
  const scoredChunks = knowledgeBase.map(chunk => scoreChunk(chunk, queryKeywords));

  // Filter by minimum score and sort by relevance
  const relevantChunks = scoredChunks
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return relevantChunks;
}

/**
 * Format retrieved chunks into context for the AI prompt
 */
export function formatContextForPrompt(results: RetrievalResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const contextParts = results.map((result, index) => {
    return `[Document ${index + 1}: ${result.chunk.title}]\n${result.chunk.content}`;
  });

  return contextParts.join('\n\n---\n\n');
}

/**
 * Main retrieval function that returns formatted context
 */
export function getRelevantContext(query: string): {
  context: string;
  hasRelevantInfo: boolean;
  chunks: RetrievalResult[];
} {
  const chunks = retrieveRelevantChunks(query, 4, 2);
  const context = formatContextForPrompt(chunks);
  
  return {
    context,
    hasRelevantInfo: chunks.length > 0,
    chunks
  };
}

/**
 * Retrieve context for the chat - simplified interface
 */
export function retrieveContext(query: string): {
  context: string;
  hasContext: boolean;
  chunks: KnowledgeChunk[];
} {
  const result = getRelevantContext(query);
  
  console.log(`[RAG] Query: "${query}"`);
  console.log(`[RAG] Keywords: ${extractKeywords(query).join(', ')}`);
  console.log(`[RAG] Found ${result.chunks.length} relevant chunks`);
  
  return {
    context: result.context,
    hasContext: result.hasRelevantInfo,
    chunks: result.chunks.map(r => r.chunk)
  };
}
