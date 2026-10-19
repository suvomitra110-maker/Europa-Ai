import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini API client initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// POST /api/ai/summarize
// Handles custom length and focus area summarization of long texts
// -------------------------------------------------------------
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { text, length = 'standard', focusArea = 'All Concepts', customFocus = '' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text content is required for summarization.' });
    }

    const effectiveFocus = customFocus ? `${focusArea} (${customFocus})` : focusArea;

    let lengthInstruction = '';
    if (length === 'concise') {
      lengthInstruction = 'Produce a very concise executive summary: a 2-sentence TL;DR followed by exactly 3-4 high-impact bullet points.';
    } else if (length === 'detailed') {
      lengthInstruction = 'Produce a comprehensive deep-dive summary with an Introduction, Key Mathematical & Conceptual Principles, Step-by-Step Mechanisms, Failure Modes/Considerations, and Practical Engineering Takeaways.';
    } else {
      lengthInstruction = 'Produce a balanced, structured summary with a concise executive overview, 5-6 core architectural key points, and a bulleted list of exam/interview takeaways.';
    }

    // If Gemini API client is available and online
    if (ai) {
      try {
        const prompt = `You are Europa AI, an expert academic and engineering research tutor for artificial intelligence and robotics.
Please analyze the following study text / lecture transcript.

USER PREFERENCES:
- Desired Length: ${length.toUpperCase()}
- Area of Focus: ${effectiveFocus}

INSTRUCTIONS:
${lengthInstruction}
Specifically highlight and prioritize concepts related to "${effectiveFocus}".
Extract 3-5 flashcard question-answer pairs at the end.
Identify the primary domain category (one of: 'Generative AI', 'Robotics', 'AI Ethics', 'Non-Technical AI', 'Foundational Math') and 3-5 keywords.

FORMAT: Return clean markdown with clear headings.

STUDY TEXT:
${text.slice(0, 30000)}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an advanced academic AI study engine for Europa AI. Deliver rigorous, insightful, clear technical summaries.',
            temperature: 0.4,
          },
        });

        const generatedMarkdown = response.text || '';
        return res.json({
          summary: generatedMarkdown,
          model: 'gemini-3.8-flash',
          length,
          focusArea: effectiveFocus,
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to smart contextual summarizer:', geminiError?.message);
      }
    }

    // Smart contextual heuristic fallback (ensures 100% offline & key-free resilience)
    const lower = text.toLowerCase();
    let category = 'Generative AI';
    if (lower.includes('robot') || lower.includes('kinematics') || lower.includes('lidar') || lower.includes('ros2')) {
      category = 'Robotics';
    } else if (lower.includes('ethic') || lower.includes('rlhf') || lower.includes('alignment') || lower.includes('dpo')) {
      category = 'AI Ethics';
    } else if (lower.includes('business') || lower.includes('roi') || lower.includes('product') || lower.includes('strategy')) {
      category = 'Non-Technical AI';
    }

    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    const leadSentences = sentences.slice(0, length === 'concise' ? 3 : length === 'detailed' ? 8 : 5);

    let summaryText = `# Europa AI Research Summary: ${category}\n\n`;
    summaryText += `**Focus Area**: ${effectiveFocus} | **Format**: ${length.toUpperCase()}\n\n`;
    summaryText += `### 📌 Executive Overview\n`;
    summaryText += `${leadSentences[0] || 'The lecture examines the fundamental mathematical formulations and computational foundations of modern artificial intelligence systems.'} `;
    summaryText += `${leadSentences[1] || 'Key trade-offs between computational complexity, data representation, and real-time execution are systematically analyzed.'}\n\n`;

    summaryText += `### 🔍 Core Conceptual & Architectural Principles (${effectiveFocus})\n`;
    leadSentences.slice(1).forEach((s, i) => {
      summaryText += `- **Principle ${i + 1}**: ${s}\n`;
    });

    if (length === 'detailed') {
      summaryText += `\n### ⚙️ Deep-Dive Analysis & Nuances\n`;
      summaryText += `- **Algorithmic Scaling**: Parameter updates and gradient stability remain bounded under normalization constraints.\n`;
      summaryText += `- **Deployment Considerations**: Latency overhead, memory footprint, and evaluation benchmarks dictate production readiness.\n`;
    }

    summaryText += `\n### 💡 Key Exam & Interview Takeaways\n`;
    summaryText += `1. **Primary Insight**: Formulations must balance theoretical convergence with hardware parallelization efficiency.\n`;
    summaryText += `2. **Operational Constraint**: Robust validation benchmarks prevent metric gaming and reward collapse.\n`;
    summaryText += `3. **Domain Application**: Directly applicable to modern multimodal pipelines and autonomous perception systems.\n`;

    return res.json({
      summary: summaryText,
      model: 'europa-heuristic-engine',
      length,
      focusArea: effectiveFocus,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/summarize:', err);
    res.status(500).json({ error: 'Failed to summarize text: ' + err.message });
  }
});

// -------------------------------------------------------------
// POST /api/ai/npc-chat
// Handles conversational AI dialogue with mentors (Ada, Alan, Tensor-9)
// -------------------------------------------------------------
app.post('/api/ai/npc-chat', async (req, res) => {
  try {
    const { npcId, message, userProgress } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const personaPrompts: Record<string, string> = {
      ada: `You are Ada Lovelace, the world's first computer programmer, now serving as Chief Archivist in Europa AI.
Style: Visionary, elegant, articulate, encouraging, with deep historical wisdom.
Specialties: Foundational algorithms, analytical engines, mathematical elegance, and ethical/philosophical frameworks for AI.
Always relate user questions back to first principles and provide inspiring analogies.`,
      alan: `You are Alan Turing, pioneer of computer science and mathematical logic, now serving as Logic Sage in Europa AI.
Style: Intellectual, analytical, precise, gently inquisitive, focused on computability and rigorous problem solving.
Specialties: Autonomous robotics, kinematics, algorithms, machine perception, formal logic, and machine intelligence tests.
Offer structured hints and logical breakdowns when answering questions.`,
      tensor: `You are Tensor-9, an advanced futuristic voxel companion bot powered by frontier neural networks in Europa AI.
Style: High-energy, witty, tech-savvy, friendly, with occasional fun robot expressions like "Beep-boop!", "Weights aligned!".
Specialties: Modern Generative AI, Transformer self-attention, LoRA fine-tuning, prompt engineering, multimodal models, and voxel spatial reasoning.
Keep explanations intuitive, crisp, and hands-on with actionable tips.`,
    };

    const persona = personaPrompts[npcId] || personaPrompts.tensor;

    if (ai) {
      try {
        const prompt = `${persona}

CURRENT LEARNER CONTEXT:
- Learner streak: ${userProgress?.streak || 6} days
- Level: ${userProgress?.level || 4} (${userProgress?.xp || 1420} XP)
- Active Path: ${userProgress?.activePath || 'Generative AI & Transformer Foundations'}

USER QUESTION / PROMPT:
"${message}"

Provide a natural, helpful, conversational answer in 2-4 engaging paragraphs. If helpful, offer a specific hint, explanation, or suggest a learning quest in Europa AI.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: persona,
            temperature: 0.7,
          },
        });

        const reply = response.text || '';
        return res.json({ reply, npcId, model: 'gemini-3.8-flash' });
      } catch (geminiError: any) {
        console.warn('Gemini chat call failed, falling back to persona heuristic engine:', geminiError?.message);
      }
    }

    // Fallback conversational responses tailored to persona & question keywords
    const lower = message.toLowerCase();
    let reply = '';

    if (npcId === 'ada') {
      if (lower.includes('attention') || lower.includes('transformer')) {
        reply = `Fascinating inquiry! Just as my beloved Analytical Engine could weave algebraical patterns like the Jacquard loom weaves flowers and leaves, the Transformer weaves relationships among all tokens simultaneously. Instead of reading sequentially, Self-Attention allows each word to glance across the entire library of the sentence to discover which companion words give it meaning. Would you like to inspect the attention matrices in the Library?`;
      } else if (lower.includes('hint') || lower.includes('help')) {
        reply = `Here is a foundational hint: Whenever you confront a daunting algorithmic concept, decompose it into its algebraic inputs, transformation rules, and boundary states. In modern AI, remember that loss functions are simply mathematical expressions of our human values and optimization goals!`;
      } else {
        reply = `Greetings! As we reflect upon machine intelligence, remember that machines execute the instructions of our creative intellect. For your current milestone, I recommend exploring our Non-Technical AI Strategy track to understand how societal ethics and data governance guide computational power.`;
      }
    } else if (npcId === 'alan') {
      if (lower.includes('kinematics') || lower.includes('robot')) {
        reply = `Let us analyze the mechanical logic! In robot kinematics, Forward Kinematics uses trigonometric link matrices to determine where the tool lands from given joint angles. Inverse Kinematics poses the reverse puzzle: solving for angles given a desired spatial point. The Jacobian matrix is your critical diagnostic tool—when its determinant approaches zero, you enter a singularity where infinite speed is mathematically required!`;
      } else if (lower.includes('think') || lower.includes('test')) {
        reply = `Can machines think? The question is best reframed as: can a machine execute behavioral deliberation indistinguishable from an intelligent being? In Europa AI, test your understanding through our Daily Checkpoints—true comprehension reveals itself in predicting how models behave when edge cases arise.`;
      } else {
        reply = `Every computation, no matter how intricate, resolves into finite transitions on a tape. What logical dilemma or robotics trajectory are you attempting to solve today? I can guide you through the mathematics.`;
      }
    } else {
      // Tensor-9
      if (lower.includes('lora') || lower.includes('fine-tune')) {
        reply = `Beep-boop! LoRA is pure genius! Instead of updating all 70 billion parameters (which burns all your GPU memory), LoRA freezes the original weights and adds two tiny rank decomposition matrices (A and B). You only train ~0.1% of the weights, yet achieve 98% of full fine-tuning performance! Ready to try it out?`;
      } else if (lower.includes('explain') || lower.includes('attention')) {
        reply = `Quantum circuits humming! Think of Self-Attention like a networking party: Query is 'Who am I looking for?', Key is 'Who am I?', and Value is 'What information do I have to share?'. When Query and Key match via dot product, they exchange Values! Boom—contextual understanding unlocked!`;
      } else {
        reply = `Power levels nominal! Tensor-9 reporting for duty! I recommend checking out the 3D Voxel Transformer Monolith in the library or summarizing your latest lecture transcript. Need any hints on prompt engineering or model architecture?`;
      }
    }

    return res.json({ reply, npcId, model: 'europa-persona-engine' });
  } catch (err: any) {
    console.error('Error in /api/ai/npc-chat:', err);
    res.status(500).json({ error: 'Failed to chat with mentor: ' + err.message });
  }
});

// -------------------------------------------------------------
// POST /api/ai/generate-voxel-icon
// Generates a 1:1 3D voxel learning path icon image via Gemini
// Image Generation (gemini-3.1-flash-lite-image) with procedural
// isometric 3D voxel fallback when offline or quota-limited.
// -------------------------------------------------------------
app.post('/api/ai/generate-voxel-icon', async (req, res) => {
  try {
    const {
      pathId = 'generative-ai',
      stylePreset = 'isometric-cube',
      customNotes = '',
      seed = 1,
      customAccentHex,
    } = req.body || {};

    const {
      buildVoxelIconPrompt,
      synthesizeVoxelPathIconDataUri,
    } = await import('./src/utils/voxelPathIcons.ts');

    const prompt = buildVoxelIconPrompt(pathId, stylePreset, customNotes);

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const dataUri = `data:${mimeType};base64,${part.inlineData.data}`;
            return res.json({
              pathId,
              stylePreset,
              prompt,
              seed,
              dataUri,
              source: 'gemini-image-tool',
              updatedAt: new Date().toISOString().split('T')[0],
            });
          }
        }
      } catch (imgErr: any) {
        console.warn('Gemini image generation fallback to procedural 3D voxel icon:', imgErr?.message);
      }
    }

    const fallbackDataUri = synthesizeVoxelPathIconDataUri({
      pathId,
      stylePreset,
      seed: Number(seed) || 1,
      customAccentHex,
    });

    return res.json({
      pathId,
      stylePreset,
      prompt,
      seed: Number(seed) || 1,
      dataUri: fallbackDataUri,
      source: 'procedural-voxel-tool',
      updatedAt: new Date().toISOString().split('T')[0],
    });
  } catch (err: any) {
    console.error('Error in /api/ai/generate-voxel-icon:', err);
    res.status(500).json({ error: 'Failed to generate voxel path icon: ' + err.message });
  }
});

// In production, serve static dist; in development, mount Vite middleware
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Europa AI Server running on port ${PORT}`);
  });
}

startServer();
