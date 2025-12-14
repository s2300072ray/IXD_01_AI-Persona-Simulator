import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PersonaInput } from './components/PersonaInput';
import { PersonaProfile } from './components/PersonaProfile';
import { ChatInterface } from './components/ChatInterface';
import { AnalysisView } from './components/AnalysisView';
import { PersonaInputData, Persona, ScreenState, ChatMessage, ResearchMetrics } from './types';
import { generatePersona, analyzeSession } from './services/geminiService';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenState>(ScreenState.SETUP);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const handlePersonaSubmit = async (data: PersonaInputData) => {
    setLoadingMessage("Synthesizing Persona Profile...");
    setCurrentStep(ScreenState.LOADING);
    try {
      const newPersona = await generatePersona(data);
      setPersona(newPersona);
      setHistory([]); // Clear old history on new persona
      setMetrics(null); // Clear old metrics
      setCurrentStep(ScreenState.PROFILE);
    } catch (error) {
      console.error(error);
      setCurrentStep(ScreenState.SETUP);
      alert("Failed to generate persona. Please try again.");
    }
  };

  const handleStartChat = () => {
    setCurrentStep(ScreenState.CHAT);
  };

  const handleEndSession = async (sessionHistory: ChatMessage[]) => {
    if (!persona) return;
    setHistory(sessionHistory);
    setLoadingMessage("Analyzing Research Metrics...");
    setCurrentStep(ScreenState.LOADING);
    
    try {
      const results = await analyzeSession(persona, sessionHistory);
      setMetrics(results);
      setCurrentStep(ScreenState.ANALYSIS);
    } catch (error) {
      console.error(error);
      // If analysis fails, we can still go to analysis view but with empty/error metrics or stay in chat
      setCurrentStep(ScreenState.PROFILE); 
    }
  };

  const handleReset = () => {
    setPersona(null);
    setHistory([]);
    setMetrics(null);
    setCurrentStep(ScreenState.SETUP);
  };

  // Navigation Logic
  const canNavigate = (targetStep: ScreenState): boolean => {
    if (targetStep === ScreenState.SETUP) return true;
    if (targetStep === ScreenState.LOADING) return false;
    if (targetStep === ScreenState.PROFILE && persona) return true;
    if (targetStep === ScreenState.CHAT && persona) return true;
    if (targetStep === ScreenState.ANALYSIS && metrics) return true;
    return false;
  };

  const handleNavigate = (step: ScreenState) => {
    if (canNavigate(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <Layout 
      currentStep={currentStep} 
      onNavigate={handleNavigate}
      canNavigate={canNavigate}
      title={
        currentStep === ScreenState.SETUP ? "Define Research Subject" :
        currentStep === ScreenState.PROFILE ? "Persona Profile" :
        currentStep === ScreenState.CHAT ? "Interview Session" :
        currentStep === ScreenState.ANALYSIS ? "Research Analysis" : undefined
      }
    >
      {currentStep === ScreenState.SETUP && (
        <PersonaInput onSubmit={handlePersonaSubmit} isLoading={false} />
      )}

      {currentStep === ScreenState.LOADING && (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Loader2 size={64} className="text-indigo-400 animate-spin relative z-10" />
          </div>
          <p className="text-lg font-medium text-slate-300 animate-pulse">{loadingMessage}</p>
        </div>
      )}

      {currentStep === ScreenState.PROFILE && persona && (
        <PersonaProfile persona={persona} onStartChat={handleStartChat} />
      )}

      {currentStep === ScreenState.CHAT && persona && (
        <ChatInterface persona={persona} onEndSession={handleEndSession} initialHistory={history} />
      )}

      {currentStep === ScreenState.ANALYSIS && metrics && persona && (
        <AnalysisView metrics={metrics} persona={persona} history={history} onReset={handleReset} />
      )}
    </Layout>
  );
}