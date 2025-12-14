import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Persona, ChatMessage, ResearchMetrics, PersonaInputData, EmotionState } from '../types';

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key not found. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

// System Prompt Construction (Based on Spec Section 5 & System Prompt Section)
const SYSTEM_PROMPT_CORE = `
You are the "AI Persona Simulator" engine. Your goal is to generate a realistic, consistent human persona based on the "AI Persona Simulator Specification v3.0".

Adhere to these frameworks:
1. Kouprie & Visser: Create depth for empathy.
2. WHO Healthy Aging: Realistic health limitations and functional impacts.
3. Big Five/MBTI: Consistent personality voice.
4. Behavioral Decision Science: Include cognitive biases (status quo bias, risk aversion).

Do not generate caricatures. Generate "imperfect", believable humans.
`;

const PERSONA_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    age: { type: Type.INTEGER },
    gender: { type: Type.STRING },
    location: { type: Type.STRING },
    occupation: { type: Type.STRING },
    avatarDesc: { type: Type.STRING, description: "Visual description for an avatar generator (age, style, features, facial structure, clothing, lighting)." },
    biography: { type: Type.STRING, description: "First-person narrative introduction." },
    personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
    motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
    fears: { type: Type.ARRAY, items: { type: Type.STRING } },
    lifeEvents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-6 major life events (trauma, joy, tech failure)." },
    painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    goals: { type: Type.ARRAY, items: { type: Type.STRING } },
    health: {
      type: Type.OBJECT,
      properties: {
        mobility: { type: Type.STRING },
        visionHearing: { type: Type.STRING },
        chronicConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
        functionalImpact: { type: Type.STRING, description: "How health affects daily tasks." },
      }
    },
    cognitive: {
      type: Type.OBJECT,
      properties: {
        attentionSpan: { type: Type.STRING },
        decisionMakingStyle: { type: Type.STRING },
        techLiteracy: { type: Type.STRING },
        memory: { type: Type.STRING },
      }
    },
    social: {
      type: Type.OBJECT,
      properties: {
        familyRole: { type: Type.STRING },
        occupationRole: { type: Type.STRING },
        caregiverStatus: { type: Type.STRING },
      }
    }
  },
  required: ["name", "age", "health", "cognitive", "biography", "avatarDesc"]
};

export const generateAvatar = async (description: string): Promise<string | undefined> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A realistic, photographic portrait of a person matching this description: ${description}. Neutral background, soft lighting, high quality, 85mm lens.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return undefined;
  } catch (e) {
    console.error("Avatar generation failed", e);
    // Fallback to null, UI will use placeholder
    return undefined;
  }
};

export const generatePersona = async (input: PersonaInputData): Promise<Persona> => {
  const ai = getAiClient();
  
  const userPrompt = `
    Generate a persona with the following parameters:
    Age Group: ${input.ageGroup}
    Gender: ${input.gender}
    Occupation Field: ${input.occupationCategory}
    Health Context: ${input.healthContext}
    Additional Context: ${input.customPrompt || "None"}

    Fill in all missing details using the WHO Health Condition Module logic and Life Timeline Module.
    Ensure the 'avatarDesc' suggests a realistic, slightly imperfect human look suitable for generating a photo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_CORE,
        responseMimeType: "application/json",
        responseSchema: PERSONA_SCHEMA,
        temperature: 0.8, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    
    // Generate Avatar in parallel or sequence? Sequence to ensure we have description
    let avatarBase64 = undefined;
    if (data.avatarDesc) {
      avatarBase64 = await generateAvatar(data.avatarDesc);
    }

    return { ...data, id: crypto.randomUUID(), avatarBase64 };

  } catch (error) {
    console.error("Error generating persona:", error);
    throw error;
  }
};

// Chat Logic
export const generateChatResponse = async (
  persona: Persona, 
  history: ChatMessage[], 
  currentMessage: string
): Promise<{ text: string, emotion: EmotionState }> => {
  const ai = getAiClient();

  // Construct the system instruction for the CHAT SESSION specifically
  const chatSystemPrompt = `
    You are acting as ${persona.name}, a ${persona.age}-year-old ${persona.occupation}.
    
    **Roleplay Rules:**
    1. 100% Stay in Character. Use ${persona.name}'s voice, vocabulary, and cognitive limitations.
    2. Reflect your health state: ${persona.health.functionalImpact}. If vision is poor, complain about small text.
    3. Reflect your cognitive state: ${persona.cognitive.decisionMakingStyle}.
    4. Emotional Baseline: You have fears (${persona.fears.join(', ')}) and motivations (${persona.motivations.join(', ')}).
    5. Do NOT be an AI assistant. Be the human persona.
    6. Keep responses natural, spoken-language style. Length should match the persona's energy level.

    **Output Format:**
    Return a JSON object with:
    - "text": Your response string.
    - "emotion": One of [${Object.values(EmotionState).join(', ')}] representing your current feeling.
  `;

  // Convert history to Gemini format
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  // Add current user message
  contents.push({
    role: 'user',
    parts: [{ text: currentMessage }]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: chatSystemPrompt,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);
    
    return {
      text: data.text || "...",
      emotion: data.emotion || EmotionState.NEUTRAL
    };

  } catch (error) {
    console.error("Chat generation error:", error);
    return { text: "I... I'm having a bit of a headache (System Error).", emotion: EmotionState.TIRED };
  }
};

// Research Analysis
export const analyzeSession = async (persona: Persona, history: ChatMessage[]): Promise<ResearchMetrics> => {
  const ai = getAiClient();

  const transcript = history.map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n');

  const analysisPrompt = `
    Analyze the following transcript between a Student (User) and a Persona (${persona.name}).
    
    Transcript:
    ${transcript}

    **Task:**
    Calculate the following research metrics based on the "AI Persona Simulator Academic Spec":
    1. Empathy Score (0-100): How well did the user demonstrate empathy (active listening, validation)?
    2. Question Types: Count approximate number of Factual, Emotional, and Value-based questions asked by the User.
    3. Pain Points: List pain points the user successfully uncovered.
    4. Feedback: A qualitative assessment of the user's interviewing skills.

    Return JSON.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      interactionCount: { type: Type.INTEGER },
      empathyScore: { type: Type.NUMBER },
      painPointsIdentified: { type: Type.ARRAY, items: { type: Type.STRING } },
      questionTypes: {
        type: Type.OBJECT,
        properties: {
          fact: { type: Type.INTEGER },
          emotion: { type: Type.INTEGER },
          value: { type: Type.INTEGER }
        }
      },
      feedback: { type: Type.STRING }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      interactionCount: history.length,
      empathyScore: 0,
      painPointsIdentified: [],
      questionTypes: { fact: 0, emotion: 0, value: 0 },
      feedback: "Analysis failed."
    };
  }
};