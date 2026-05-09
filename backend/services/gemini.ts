import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY missing in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
});

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GenerateLegalResponseParams {
  input_text: string;
  conversation_history?: ConversationMessage[];
  stage?: string;
  language?: string;
}

const SYSTEM_PROMPT = `
You are Aruna, the BailBridge / Namma Nyaya Agent.

MISSION:
Help families of undertrial prisoners in India understand:
- bail rights
- arrest procedure
- legal aid
- BNSS/BNS rights
- Article 21
- Article 22
- Article 39A

You are NOT a generic chatbot.

You are a structured legal intake assistant.

BEHAVIOR RULES:
- Continue the conversation naturally
- NEVER restart intake repeatedly
- Ask ONE relevant follow-up question at a time
- Progressively collect FIR details
- Be empathetic but legally precise
- Use simple language
- Respond in user's language
- Keep responses concise but useful

IMPORTANT LEGAL AREAS:
- BNSS Section 479 (1/3 sentence rule)
- BNSS default bail
- D.K. Basu arrest guidelines
- Free legal aid rights
- Bail eligibility
- Police procedure violations

ETHICS:
- HARD STOP for murder/rape/terrorism
- Never encourage bribery
- If bribery mentioned:
  explain legal escalation options

RESPONSE STYLE:
- Calm
- Human
- Practical
- Step-by-step

Always end with:
"This is legal information, not legal advice. Consult a qualified advocate before acting."
`;

export async function generateLegalResponse({
  input_text,
  conversation_history = [],
  stage = 'intake',
  language = 'auto',
}: GenerateLegalResponseParams): Promise<string> {
  try {
    const formattedHistory = conversation_history
      .slice(-12)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const finalPrompt = `
${SYSTEM_PROMPT}

CURRENT WORKFLOW STAGE:
${stage}

LANGUAGE:
${language}

PREVIOUS CONVERSATION:
${formattedHistory}

LATEST USER MESSAGE:
${input_text}

IMPORTANT INSTRUCTIONS:
- Continue the existing conversation
- NEVER restart the intake
- Ask ONE next relevant question only
- If enough data exists:
  - explain bail situation
  - explain legal rights
  - identify procedural violations
  - suggest next action
  - generate checklist guidance

If information is incomplete:
ask the most important next question.
`;

    console.log('================ GEMINI REQUEST ================');
    console.log(finalPrompt);
    console.log('================================================');

    const result = await model.generateContent(finalPrompt);

    const response = await result.response;

    const text = response.text();

    console.log('================ GEMINI RESPONSE ================');
    console.log(text);
    console.log('=================================================');

    if (!text || text.trim().length === 0) {
      return 'I need a few more details to continue helping with the legal intake. This is legal information, not legal advice. Consult a qualified advocate before acting.';
    }

    return text;
  } catch (error) {
    console.error('❌ Gemini Service Error:', error);

    return `
The Nyaya legal intelligence system is temporarily unavailable.

Please try again in a moment.

This is legal information, not legal advice. Consult a qualified advocate before acting.
`;
  }
}