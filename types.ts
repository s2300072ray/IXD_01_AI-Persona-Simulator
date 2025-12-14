// Enums based on theoretical frameworks
export enum ScreenState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  PROFILE = 'PROFILE',
  CHAT = 'CHAT',
  ANALYSIS = 'ANALYSIS'
}

export enum EmotionState {
  HAPPY = 'Happy',
  NEUTRAL = 'Neutral',
  TIRED = 'Tired',
  IRRITATED = 'Irritated',
  ANXIOUS = 'Anxious'
}

// Module 4.1 - 4.5 Data Structures
export interface HealthProfile {
  mobility: string;
  visionHearing: string;
  chronicConditions: string[];
  functionalImpact: string; // How health affects daily life
}

export interface CognitiveProfile {
  attentionSpan: string;
  decisionMakingStyle: string;
  techLiteracy: string;
  memory: string;
}

export interface SocialProfile {
  familyRole: string;
  occupationRole: string;
  caregiverStatus: string; // Caregiver or Care Receiver
}

export interface Persona {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  occupation: string;
  avatarDesc: string; // For Module 4.7
  avatarBase64?: string; // Generated Image
  
  // Narrative & Psych
  biography: string;
  personalityTraits: string[]; // Big Five
  motivations: string[];
  fears: string[];
  
  // Modules
  health: HealthProfile;
  cognitive: CognitiveProfile;
  social: SocialProfile;
  
  // Lifecycle
  lifeEvents: string[]; // Module 4.5
  painPoints: string[];
  goals: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  emotion?: EmotionState; // The emotion the persona felt when sending this
}

export interface ResearchMetrics {
  interactionCount: number;
  empathyScore: number; // 0-100
  painPointsIdentified: string[];
  questionTypes: {
    fact: number;
    emotion: number;
    value: number;
  };
  feedback: string;
}

export interface PersonaInputData {
  ageGroup: string;
  gender: string;
  occupationCategory: string;
  healthContext: string; // e.g., "Healthy", "Chronic Illness", "Disability"
  customPrompt?: string;
}