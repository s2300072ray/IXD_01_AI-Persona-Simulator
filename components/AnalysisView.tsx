import React from 'react';
import { ResearchMetrics, Persona, ChatMessage } from '../types';
import { BarChart2, Award, AlertCircle, CheckCircle, RefreshCw, MessageSquare, Copy, Download, Check } from 'lucide-react';

interface Props {
  metrics: ResearchMetrics;
  persona: Persona;
  history: ChatMessage[];
  onReset: () => void;
}

export const AnalysisView: React.FC<Props> = ({ metrics, persona, history, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-900/30 border-emerald-800';
    if (score >= 60) return 'text-amber-400 bg-amber-900/30 border-amber-800';
    return 'text-red-400 bg-red-900/30 border-red-800';
  };

  const generateReportText = () => {
    const date = new Date().toLocaleString();
    const transcript = history.map(h => `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.role.toUpperCase()}: ${h.text}`).join('\n');
    
    return `AI PERSONA SIMULATOR - RESEARCH REPORT
Date: ${date}
Session ID: ${persona.id}

================================
1. PERSONA PROFILE
================================
Name: ${persona.name}
Age: ${persona.age} | Gender: ${persona.gender}
Occupation: ${persona.occupation}
Location: ${persona.location}

[Health Context]
Mobility: ${persona.health.mobility}
Sensory: ${persona.health.visionHearing}
Functional Impact: ${persona.health.functionalImpact}

[Psychology]
Traits: ${persona.personalityTraits.join(', ')}
Motivations: ${persona.motivations.join(', ')}
Fears: ${persona.fears.join(', ')}

================================
2. RESEARCH METRICS
================================
EMPATHY SCORE: ${metrics.empathyScore}/100
INTERACTION COUNT: ${metrics.interactionCount} messages

[Question Types]
- Factual: ${metrics.questionTypes.fact}
- Emotional: ${metrics.questionTypes.emotion}
- Value-based: ${metrics.questionTypes.value}

[Pain Points Identified]
${metrics.painPointsIdentified.length > 0 ? metrics.painPointsIdentified.map(p => `- ${p}`).join('\n') : "(None identified)"}

================================
3. QUALITATIVE FEEDBACK
================================
${metrics.feedback}

================================
4. SESSION TRANSCRIPT
================================
${transcript}
`;
  };

  const handleCopy = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PersonaReport_${persona.name.replace(/\s+/g, '')}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-indigo-100 font-serif">Session Analysis</h2>
          <p className="text-slate-400 text-sm">Comprehensive breakdown of research interaction data.</p>
        </div>
        
        <div className="flex space-x-3">
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-all shadow-sm"
              title="Copy to Clipboard"
            >
               {copied ? <Check size={18} className="text-emerald-400"/> : <Copy size={18} />}
               <span>{copied ? 'Copied!' : 'Copy Report'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-indigo-900/20"
              title="Download as Text File"
            >
               <Download size={18} />
               <span>Export .txt</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Empathy Score Card */}
        <div className={`rounded-xl border p-8 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden ${getScoreColor(metrics.empathyScore)}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <Award size={56} className="mb-4 opacity-90 relative z-10" />
          <h3 className="text-lg font-semibold opacity-90 relative z-10 tracking-wide uppercase text-xs">Empathy Score</h3>
          <span className="text-5xl font-bold mt-2 relative z-10">{metrics.empathyScore}</span>
          <p className="text-[10px] opacity-75 mt-3 relative z-10 uppercase tracking-widest">Out of 100</p>
        </div>

        {/* Interaction Stats */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-md flex flex-col justify-center">
          <div className="flex items-center space-x-3 mb-6 text-indigo-400">
            <div className="p-2 bg-indigo-900/30 rounded-lg">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-100">Interaction Metrics</h3>
          </div>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Exchanges</span>
              <span className="font-bold text-slate-100 text-lg">{metrics.interactionCount}</span>
            </div>
            <div className="h-px bg-slate-700/50"></div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-400">Factual Inquiries</span>
                <span className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-300 font-mono text-xs">{metrics.questionTypes.fact}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-400">Emotional Inquiries</span>
                <span className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-300 font-mono text-xs">{metrics.questionTypes.emotion}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-400">Value-based Inquiries</span>
                <span className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-300 font-mono text-xs">{metrics.questionTypes.value}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pain Points Discovery */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-md flex flex-col">
           <div className="flex items-center space-x-3 mb-6 text-rose-400">
            <div className="p-2 bg-rose-900/30 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-100">Pain Points Found</h3>
          </div>
          <div className="space-y-3 flex-grow overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
            {metrics.painPointsIdentified.length > 0 ? (
              metrics.painPointsIdentified.map((pp, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-sm bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                  <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-slate-300 leading-snug">{pp}</span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 italic text-sm">
                <span>No specific pain points identified.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Qualitative Feedback */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="bg-slate-900/50 px-8 py-4 border-b border-slate-700 flex items-center">
           <BarChart2 size={20} className="mr-3 text-indigo-500"/> 
           <h3 className="text-lg font-bold text-slate-100">Qualitative Assessment</h3>
        </div>
        <div className="p-8">
          <div className="prose prose-invert max-w-none text-slate-300">
            <p className="whitespace-pre-wrap leading-relaxed text-base">{metrics.feedback}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-8 border-t border-slate-800">
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-8 py-3 rounded-lg font-medium shadow-lg transition-all hover:scale-105"
        >
          <RefreshCw size={20} />
          <span>Reset Simulator</span>
        </button>
      </div>
    </div>
  );
};