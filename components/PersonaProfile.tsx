import React from 'react';
import { Persona } from '../types';
import { User, Heart, Brain, Briefcase, Target, AlertTriangle, MapPin } from 'lucide-react';

interface Props {
  persona: Persona;
  onStartChat: () => void;
}

export const PersonaProfile: React.FC<Props> = ({ persona, onStartChat }) => {
  const avatarUrl = persona.avatarBase64 || `https://picsum.photos/seed/${persona.id}/200/200`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Left Column: Identity Card */}
      <div className="space-y-6">
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden sticky top-24">
          <div className="h-32 bg-gradient-to-r from-indigo-900 to-purple-900"></div>
          <div className="px-6 pb-6 text-center relative">
            <div className="relative -mt-16 mb-4 inline-block">
               <img 
                src={avatarUrl} 
                alt="Persona Avatar" 
                className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-md object-cover bg-slate-700"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{persona.name}</h2>
            <p className="text-slate-400 font-medium">{persona.occupation}</p>
            
            <div className="mt-4 flex justify-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center">
                <User size={14} className="mr-1" /> {persona.age} y/o
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" /> {persona.location}
              </div>
            </div>
            
            <div className="mt-6 border-t border-slate-700 pt-6 text-left">
               <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Personality (Big 5)</h4>
               <div className="flex flex-wrap gap-2">
                 {persona.personalityTraits.map((trait, i) => (
                   <span key={i} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md border border-slate-600">
                     {trait}
                   </span>
                 ))}
               </div>
            </div>

            <div className="mt-6">
              <button 
                onClick={onStartChat}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Start Interview Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Detailed Modules */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Narrative */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BookIcon />
            <h3 className="text-lg font-bold text-slate-100">Narrative Biography</h3>
          </div>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
            "{persona.biography}"
          </p>
        </div>

        {/* 3 Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Module */}
          <div className="bg-slate-800 rounded-xl shadow-sm border border-red-900/50 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full -mr-8 -mt-8"></div>
            <div className="flex items-center space-x-2 mb-4 text-red-400">
              <Heart size={20} />
              <h3 className="font-bold">Health & Functionality</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500">Mobility</span>
                <span className="font-medium text-slate-200 text-right ml-2">{persona.health.mobility}</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500">Senses</span>
                <span className="font-medium text-slate-200 text-right ml-2">{persona.health.visionHearing}</span>
              </li>
              <li className="pt-1">
                <span className="text-slate-500 block mb-1">Functional Impact:</span>
                <span className="font-medium text-slate-200 italic">"{persona.health.functionalImpact}"</span>
              </li>
            </ul>
          </div>

          {/* Cognitive Module */}
          <div className="bg-slate-800 rounded-xl shadow-sm border border-blue-900/50 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-900/20 rounded-bl-full -mr-8 -mt-8"></div>
             <div className="flex items-center space-x-2 mb-4 text-blue-400">
              <Brain size={20} />
              <h3 className="font-bold">Cognition & Tech</h3>
            </div>
             <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500">Decision Style</span>
                <span className="font-medium text-slate-200 text-right ml-2">{persona.cognitive.decisionMakingStyle}</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-500">Tech Literacy</span>
                <span className="font-medium text-slate-200 text-right ml-2">{persona.cognitive.techLiteracy}</span>
              </li>
               <li className="flex justify-between pb-1">
                <span className="text-slate-500">Attention</span>
                <span className="font-medium text-slate-200 text-right ml-2">{persona.cognitive.attentionSpan}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Life Events Timeline (Simplified) */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
            <Briefcase size={18} className="mr-2 text-slate-500"/> Life Timeline & Events
          </h3>
          <div className="relative border-l-2 border-slate-700 ml-3 space-y-6">
            {persona.lifeEvents.map((event, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-indigo-500"></div>
                <p className="text-slate-300">{event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motivations & Fears Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-emerald-900/20 rounded-xl p-5 border border-emerald-900/50">
             <div className="flex items-center space-x-2 mb-3 text-emerald-400">
               <Target size={18} />
               <h3 className="font-bold">Goals & Motivations</h3>
             </div>
             <ul className="list-disc list-inside text-sm text-emerald-200 space-y-1">
               {persona.motivations.map((m, i) => <li key={i}>{m}</li>)}
               {persona.goals.map((g, i) => <li key={`g-${i}`}>{g}</li>)}
             </ul>
           </div>
           <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-900/50">
             <div className="flex items-center space-x-2 mb-3 text-amber-400">
               <AlertTriangle size={18} />
               <h3 className="font-bold">Fears & Pain Points</h3>
             </div>
             <ul className="list-disc list-inside text-sm text-amber-200 space-y-1">
               {persona.fears.map((f, i) => <li key={i}>{f}</li>)}
               {persona.painPoints.map((p, i) => <li key={`p-${i}`}>{p}</li>)}
             </ul>
           </div>
        </div>

      </div>
    </div>
  );
};

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-400">
    <path fillRule="evenodd" d="M11.25 4.533A9.707 9.707 0 006 3.75c-4.514 0-9 1.97-9 9v5.438c0 .884.716 1.601 1.591 1.637 1.73.071 3.26.687 4.557 1.718l.352.277c.232.182.563.125.738-.125.104-.149.138-.335.093-.511-.045-.176-.082-.35-.112-.522-.11-.636-.17-1.292-.17-1.961V3.75c0-.885.716-1.602 1.591-1.637.894-.037 1.757-.176 2.592-.411.086-.024.175-.042.266-.053.253-.031.515.056.687.24l.065.083A9.724 9.724 0 0018 3.75c4.514 0 9 1.97 9 9v5.438c0 .884-.716 1.601-1.591 1.637-1.73.071-3.26.687-4.557 1.718l-.352.277c-.232.182-.563.125-.738-.125-.104-.149-.138-.335-.093-.511.045-.176.082-.35.112-.522.11-.636.17-1.292.17-1.961V3.75c0-.885-.716-1.602-1.591-1.637-.894-.037-1.757-.176-2.592-.411-.086-.024-.175-.042-.266-.053-.253-.031-.515.056-.687.24l-.065.083z" clipRule="evenodd" />
  </svg>
);