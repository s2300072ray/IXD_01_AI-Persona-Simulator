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
    
    // Highlight if active, or if currently setting up (Setup & Loading are visually similar grouping)
    const visualActive = isActive || (step === ScreenState.SETUP && currentStep === ScreenState.LOADING);

    return (
      <button
        onClick={() => isAllowed && onNavigate(step)}
        disabled={!isAllowed}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all border border-transparent ${
          visualActive 
            ? 'bg-indigo-900/50 text-indigo-300 border-indigo-800/50' 
            : isAllowed 
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer' 
              : 'text-slate-700 cursor-not-allowed opacity-50'
        }`}
      >
        <Icon size={16} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => onNavigate(ScreenState.SETUP)}
          >
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
              <BookOpen size={20} />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">AI Persona Simulator</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Academic Edition v3.0</p>
            </div>
          </button>
          
          {/* Progress Indicators / Navigation */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
             <NavItem step={ScreenState.SETUP} icon={User} label="Input" />
             <div className="h-4 w-px bg-slate-800 mx-2"></div>
             <NavItem step={ScreenState.PROFILE} icon={Activity} label="Profile" />
             <div className="h-4 w-px bg-slate-800 mx-2"></div>
             <NavItem step={ScreenState.CHAT} icon={MessageCircle} label="Interaction" />
             <div className="h-4 w-px bg-slate-800 mx-2"></div>
             <NavItem step={ScreenState.ANALYSIS} icon={FileBarChart} label="Analysis" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl animate-fade-in">
        {title && (
          <div className="mb-8 border-b border-slate-800 pb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-indigo-100 font-serif tracking-tight">{title}</h2>
            <div className="text-xs text-slate-500 font-mono">SECURE CONNECTION • GEMINI 2.5</div>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2024 AI Persona Simulator. Powered by Google Gemini 2.5 Flash.</p>
        </div>
      </footer>
    </div>
  );
};