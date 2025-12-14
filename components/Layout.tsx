import React from 'react';
import { BookOpen, MessageCircle, Activity, User, FileBarChart } from 'lucide-react';
import { ScreenState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: string;
  title?: string;
  onNavigate: (step: ScreenState) => void;
  canNavigate: (step: ScreenState) => boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentStep, title, onNavigate, canNavigate }) => {
  
  const NavItem = ({ step, icon: Icon, label }: { step: ScreenState; icon: any; label: string }) => {
    const isActive = currentStep === step;
    const isAllowed = canNavigate(step);
    
    // Setup and Loading share the same "Input" active state visual usually, but strictly mapping here
    const visualActive = isActive || (step === ScreenState.SETUP && currentStep === ScreenState.LOADING);

    return (
      <button
        onClick={() => isAllowed && onNavigate(step)}
        disabled={!isAllowed}
        className={`flex items-center space-x-2 transition-colors ${
          visualActive 
            ? 'text-indigo-400 font-semibold' 
            : isAllowed 
              ? 'text-slate-400 hover:text-slate-200 cursor-pointer' 
              : 'text-slate-700 cursor-not-allowed'
        }`}
      >
        <Icon size={16} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(ScreenState.SETUP)}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">AI Persona Simulator</h1>
              <p className="text-xs text-slate-400 font-medium">Academic Research Edition v3.0</p>
            </div>
          </div>
          
          {/* Progress Indicators / Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
             <NavItem step={ScreenState.SETUP} icon={User} label="Input" />
             <NavItem step={ScreenState.PROFILE} icon={Activity} label="Profile" />
             <NavItem step={ScreenState.CHAT} icon={MessageCircle} label="Interaction" />
             <NavItem step={ScreenState.ANALYSIS} icon={FileBarChart} label="Analysis" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {title && (
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-indigo-100 font-serif">{title}</h2>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2024 AI Persona Simulator. Built with Gemini 2.5.</p>
        </div>
      </footer>
    </div>
  );
};