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

--- PERSONA PROFILE ---
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}
Health Impact: ${persona.health.functionalImpact}
Personality: ${persona.personalityTraits.join(', ')}

--- RESEARCH METRICS ---
Empathy Score: ${metrics.empathyScore}/100
Interaction Count: ${metrics.interactionCount} messages
Question Analysis:
- Factual: ${metrics.questionTypes.fact}
- Emotional: ${metrics.questionTypes.emotion}
- Value-based: ${metrics.questionTypes.value}

Pain Points Identified:
${metrics.painPointsIdentified.map(p => `- ${p}`).join('\n')}

--- QUALITATIVE FEEDBACK ---
${metrics.feedback}

--- TRANSCRIPT ---
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
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Persona_Report_${persona.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-indigo-100 font-serif">Session Analysis</h2>
          <p className="text-slate-400">Research Data & Performance Metrics</p>
        </div>
        
        <div className="flex space-x-3">
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-all"
            >
               {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16} />}
               <span>{copied ? 'Copied!' : 'Copy Report'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-all"
            >
               <Download size={16} />
               <span>Export .txt</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Empathy Score Card */}
        <div className={`rounded-xl border p-6 flex flex-col items-center justify-center text-center ${getScoreColor(metrics.empathyScore)}`}>
          <Award size={48} className="mb-3 opacity-80" />
          <h3 className="text-lg font-semibold opacity-90">Empathy Score</h3>
          <span className="text-4xl font-bold mt-2">{metrics.empathyScore}/100</span>
          <p className="text-xs opacity-75 mt-2">Based on active listening & validation</p>
        </div>

        {/* Interaction Stats */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 text-indigo-400">
            <MessageSquare size={24} />
            <h3 className="text-lg font-bold text-slate-100">Interaction Data</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Exchanges</span>
              <span className="font-bold text-slate-200">{metrics.interactionCount}</span>
            </div>
            <div className="h-px bg-slate-700 my-2"></div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Factual Questions</span>
                <span className="text-slate-300 font-medium">{metrics.questionTypes.fact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Emotional Questions</span>
                <span className="text-slate-300 font-medium">{metrics.questionTypes.emotion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Value-based Questions</span>
                <span className="text-slate-300 font-medium">{metrics.questionTypes.value}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pain Points Discovery */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
           <div className="flex items-center space-x-2 mb-4 text-rose-400">
            <AlertCircle size={24} />
            <h3 className="text-lg font-bold text-slate-100">Pain Points Found</h3>
          </div>
          <div className="space-y-2">
            {metrics.painPointsIdentified.length > 0 ? (
              metrics.painPointsIdentified.map((pp, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-sm">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-slate-300">{pp}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No specific pain points identified in this session.</p>
            )}
          </div>
        </div>
      </div>

      {/* Qualitative Feedback */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8">
        <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
          <BarChart2 size={24} className="mr-2 text-indigo-500"/> 
          Qualitative Feedback
        </h3>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="whitespace-pre-wrap leading-relaxed">{metrics.feedback}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-6">
        <button 
          onClick={onReset}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md shadow-indigo-900/20 transition-all border border-transparent"
        >
          <RefreshCw size={20} />
          <span>Start New Simulation</span>
        </button>
      </div>
    </div>
  );
};