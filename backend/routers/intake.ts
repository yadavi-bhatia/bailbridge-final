import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { classifyIncident } from "../services/classification.ts";
import { evaluateEthics } from "../services/ethics.ts";
import { buildLegalAid, buildChecklist } from "../services/legal_aid.ts";
import { getMockHearing } from "../services/hearing.ts";
import { buildScripts } from "../services/script.ts";
import { generateChatResponse } from "../services/gemini.ts";

const router = Router();

import express from 'express';
import { generateLegalResponse } from '../services/gemini';

const router = express.Router();

router.post('/process_intake', async (req, res) => {
  try {
    const {
      input_text,
      language,
      conversation_history,
      conversation_id,
      stage,
    } = req.body;

    const formattedHistory = (conversation_history || [])
      .slice(-12)
      .map((m: any) => `${m.role}: ${m.content}`)
      .join('\n');

    const SYSTEM_PROMPT = `
You are Aruna, the BailBridge / Namma Nyaya Agent.

You are a multi-step legal intake AI.

GOALS:
- Continue conversations naturally
- Ask ONE follow-up question at a time
- Do NOT restart intake every message
- Gather FIR details progressively
- Help families understand rights
- Detect procedural violations
- Explain bail eligibility
- Route serious offences carefully

WORKFLOW:
1. Situation intake
2. FIR analysis
3. Rights audit
4. Bail assessment
5. Legal aid routing
6. Action checklist

RULES:
- Be empathetic but firm
- Speak in user language
- Always mention this is legal information, not legal advice
`;

    const finalPrompt = `
${SYSTEM_PROMPT}

CURRENT STAGE:
${stage || 'intake'}

CONVERSATION ID:
${conversation_id}

PREVIOUS CONVERSATION:
${formattedHistory}

LATEST USER MESSAGE:
${input_text}

IMPORTANT:
- Continue conversation naturally
- NEVER restart
- Ask only ONE relevant next question
- If enough info exists:
  - explain bail situation
  - explain rights
  - generate checklist
`;

    const aiResponse = await generateLegalResponse(finalPrompt);

    return res.json({
      success: true,

      ai_response: aiResponse,

      stage:
        stage === 'intake'
          ? 'fact_collection'
          : 'legal_assessment',

      classification: {
        offence_name: 'Under Analysis',
        bns_code: 'Pending',
        bailable: true,
      },

      ethics: {
        blocked: false,
      },

      bail_eligibility_score: 55,

      conversation_id,
    });
  } catch (error) {
    console.error('INTAKE ERROR:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to process intake',
    });
  }
});

export default router;

export default router;
