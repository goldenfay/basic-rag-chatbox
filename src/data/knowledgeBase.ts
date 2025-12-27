/**
 * Company Knowledge Base
 * 
 * Organized by topic sections for optimal RAG retrieval.
 * Each chunk represents a logical topic unit (~100-300 words).
 * Company name is injected dynamically from environment.
 */

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: Category;
  content: string;
  keywords: string[]; // Pre-extracted keywords for faster matching
}

// Category types
export const categories = [
  "Services",
  "Support", 
  "Pricing",
  "Process",
  "Security",
  "FAQ",
  "Legal",
  "Contact"
] as const;

export type Category = typeof categories[number];

// Get company name from environment or fallback
const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || 'Our Company';

export const knowledgeBase: KnowledgeChunk[] = [
  // SERVICES
  {
    id: "services-overview",
    title: "Services Offered",
    category: "Services",
    content: `${COMPANY_NAME} provides the following services:
- Custom website development
- Web application development
- SaaS MVP development
- AI-powered chatbot integration
- Internal business tools
- API development and integration
- Maintenance and technical support
- UI/UX implementation from design files

We work primarily with modern web technologies such as JavaScript, React, Node.js, and cloud-based solutions.`,
    keywords: ["services", "website", "web", "application", "saas", "mvp", "chatbot", "ai", "tools", "api", "maintenance", "support", "ui", "ux", "design", "javascript", "react", "node", "cloud", "development", "build", "create", "offer", "provide", "what", "do", "you"]
  },

  // SUPPORT HOURS
  {
    id: "support-hours",
    title: "Customer Support Hours",
    category: "Support",
    content: `Our customer support team is available:
- Monday to Friday
- From 9:00 AM to 6:00 PM (UTC)

Support requests submitted outside business hours are processed the next business day.`,
    keywords: ["support", "hours", "time", "available", "availability", "monday", "friday", "business", "contact", "when", "open", "schedule", "utc", "customer", "help", "reach", "working"]
  },

  // PRICING & BILLING
  {
    id: "pricing-billing",
    title: "Pricing & Billing",
    category: "Pricing",
    content: `${COMPANY_NAME} offers flexible pricing models depending on the project:
- Fixed-price projects for clearly defined scopes
- Hourly billing for ongoing or evolving projects
- Monthly maintenance plans for long-term clients

Invoices are issued at the beginning or end of each billing cycle, depending on the agreement. Payments are accepted via bank transfer or online payment platforms.`,
    keywords: ["pricing", "price", "cost", "billing", "invoice", "payment", "pay", "fixed", "hourly", "monthly", "rate", "charge", "fee", "money", "budget", "quote", "estimate", "bank", "transfer", "how", "much"]
  },

  // PROJECT PROCESS
  {
    id: "project-process",
    title: "Project Process & Workflow",
    category: "Process",
    content: `Our typical project workflow includes:
1. Initial consultation and requirement gathering
2. Proposal and timeline approval
3. Design and development phase
4. Testing and quality assurance
5. Deployment and delivery
6. Post-launch support and maintenance

Clients are kept informed throughout the project with regular updates.`,
    keywords: ["project", "process", "workflow", "steps", "phases", "consultation", "requirements", "proposal", "timeline", "design", "development", "testing", "qa", "quality", "deployment", "delivery", "launch", "updates", "how", "work", "start", "begin", "stages"]
  },

  // TECHNICAL SUPPORT & MAINTENANCE
  {
    id: "technical-support",
    title: "Technical Support & Maintenance",
    category: "Support",
    content: `We provide ongoing technical support after project delivery. This includes:
- Bug fixes
- Security updates
- Performance improvements
- Minor feature enhancements

Maintenance plans are available on a monthly basis and can be customized to client needs.`,
    keywords: ["technical", "support", "maintenance", "bug", "fix", "security", "update", "performance", "enhancement", "monthly", "plan", "ongoing", "after", "delivery", "help", "issue", "problem", "error"]
  },

  // AI CHATBOT SERVICES
  {
    id: "ai-chatbot-services",
    title: "AI Chatbot Services",
    category: "Services",
    content: `${COMPANY_NAME} offers AI-powered chatbot solutions that help businesses:
- Answer customer questions automatically
- Reduce support workload
- Provide 24/7 assistance
- Improve response time and customer satisfaction

Our chatbots can be trained on company-specific documents such as FAQs, policies, and internal documentation.`,
    keywords: ["ai", "chatbot", "bot", "artificial", "intelligence", "automation", "automatic", "24/7", "questions", "answers", "support", "customer", "train", "training", "documents", "faq", "assistant"]
  },

  // DATA PRIVACY & SECURITY
  {
    id: "data-privacy-security",
    title: "Data Privacy & Security",
    category: "Security",
    content: `We take data privacy seriously.
- Client data is never shared with third parties
- All data is processed securely
- Access to internal systems is restricted
- AI systems are configured to use only approved data sources

We comply with general data protection principles and best practices.`,
    keywords: ["data", "privacy", "security", "secure", "protection", "gdpr", "confidential", "safe", "third", "party", "access", "restricted", "compliance", "information", "private"]
  },

  // ACCOUNT & ACCESS
  {
    id: "account-access",
    title: "Account & Access Credentials",
    category: "Security",
    content: `Clients receive secure access credentials for any systems developed by ${COMPANY_NAME}.

It is the client's responsibility to keep login credentials confidential. ${COMPANY_NAME} is not responsible for issues caused by unauthorized access due to credential sharing.`,
    keywords: ["account", "access", "credentials", "login", "password", "secure", "responsibility", "unauthorized", "sharing", "confidential", "username"]
  },

  // FAQ - WEBSITE REDESIGN
  {
    id: "faq-redesign",
    title: "FAQ: Website Redesign",
    category: "FAQ",
    content: `Q: Do you offer website redesign services?

Yes, we redesign existing websites to improve performance, usability, and modern design standards.`,
    keywords: ["redesign", "website", "existing", "improve", "update", "refresh", "modernize", "revamp", "old", "current", "remake", "offer"]
  },

  // FAQ - API INTEGRATION
  {
    id: "faq-api-integration",
    title: "FAQ: Third-Party API Integration",
    category: "FAQ",
    content: `Q: Can you integrate third-party APIs?

Yes, we regularly integrate payment gateways, CRM systems, and external APIs.`,
    keywords: ["api", "integration", "integrate", "third-party", "payment", "gateway", "crm", "external", "connect", "stripe", "paypal", "system"]
  },

  // FAQ - MOBILE APP
  {
    id: "faq-mobile-app",
    title: "FAQ: Mobile App Development",
    category: "FAQ",
    content: `Q: Do you provide mobile app development?

Our primary focus is web applications. Mobile apps may be developed using web-based technologies depending on requirements.`,
    keywords: ["mobile", "app", "application", "ios", "android", "phone", "smartphone", "pwa", "responsive", "native"]
  },

  // FAQ - EXISTING PROJECT MAINTENANCE
  {
    id: "faq-existing-maintenance",
    title: "FAQ: Existing Project Maintenance",
    category: "FAQ",
    content: `Q: Can you maintain an existing project?

Yes, we offer maintenance services for both projects developed by us and third-party systems.`,
    keywords: ["maintain", "maintenance", "existing", "project", "third-party", "legacy", "old", "current", "take", "over", "takeover"]
  },

  // CONTRACTS & LEGAL
  {
    id: "contracts-legal",
    title: "Contracts & Legal Agreements",
    category: "Legal",
    content: `All projects are governed by a service agreement that defines scope, timelines, pricing, and responsibilities.

Changes outside the original scope may require a revised agreement or additional charges.`,
    keywords: ["contract", "legal", "agreement", "scope", "timeline", "terms", "conditions", "responsibilities", "changes", "revision", "document", "sign", "nda"]
  },

  // REFUNDS & CANCELLATIONS
  {
    id: "refunds-cancellations",
    title: "Refunds & Cancellations Policy",
    category: "Legal",
    content: `Refunds depend on the project stage:
- Work already completed is non-refundable
- Remaining unused hours or phases may be refundable
- Cancellations must be submitted in writing

Each case is reviewed individually.`,
    keywords: ["refund", "refunds", "cancel", "cancellation", "money", "back", "return", "policy", "completed", "unused", "writing", "stop"]
  },

  // CONTACT INFORMATION
  {
    id: "contact-info",
    title: "Contact Information",
    category: "Contact",
    content: `Clients can contact ${COMPANY_NAME} via:
- Email support
- Contact forms on the website
- Scheduled video calls

Response time is typically within 24 business hours.`,
    keywords: ["contact", "email", "phone", "call", "reach", "message", "form", "video", "meeting", "response", "time", "how", "get", "touch", "talk", "speak"]
  },

  // MULTI-LANGUAGE SUPPORT
  {
    id: "language-support",
    title: "Multi-Language Support",
    category: "Support",
    content: `${COMPANY_NAME} supports clients in:
- English
- French

Documentation and communication can be provided in either language.`,
    keywords: ["language", "english", "french", "multilingual", "translation", "communication", "documentation", "speak", "parler", "français", "languages"]
  }
];

/**
 * Get all unique categories from the knowledge base
 */
export const getCategories = (): Category[] => {
  return [...new Set(knowledgeBase.map(chunk => chunk.category))];
};

/**
 * Get all chunks by category
 */
export const getChunksByCategory = (category: Category): KnowledgeChunk[] => {
  return knowledgeBase.filter(chunk => chunk.category === category);
};

/**
 * Get the configured company name
 */
export const getCompanyName = (): string => COMPANY_NAME;
