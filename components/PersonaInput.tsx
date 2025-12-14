import React, { useState } from 'react';
import { PersonaInputData } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (data: PersonaInputData) => void;
  isLoading: boolean;
}

export const PersonaInput: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PersonaInputData>({
    ageGroup: 'Senior (65+)',
    gender: 'Female',
    occupationCategory: 'Retired / Homemaker',
    healthContext: 'Chronic Illness (Diabetes/Hypertension)',
    customPrompt: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 shadow-lg border border-slate-700 rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-2">Parameter Setup</h2>
          <p className="text-slate-400 text-sm">
            Define the demographic variables. The <b>Persona Input Module</b> will automatically populate psychometrics, health functional impacts, and life narratives based on WHO frameworks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Age Group</label>
              <select 
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                className="w-full border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-900 text-slate-100"
              >
                <option>Young Adult (18-25)</option>
                <option>Adult (26-45)</option>
                <option>Middle Age (46-64)</option>
                <option>Senior (65+)</option>
                <option>Super Senior (80+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gender Identity</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-900 text-slate-100"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Not Specified</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Occupation / Role</label>
              <select 
                name="occupationCategory"
                value={formData.occupationCategory}
                onChange={handleChange}
                className="w-full border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-900 text-slate-100"
              >
                <option>Student</option>
                <option>Tech Worker</option>
                <option>Service Industry</option>
                <option>Healthcare Professional</option>
                <option>Manual Labor</option>
                <option>Retired / Homemaker</option>
                <option>Unemployed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Health Baseline (WHO)</label>
              <select 
                name="healthContext"
                value={formData.healthContext}
                onChange={handleChange}
                className="w-full border border-slate-600 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-900 text-slate-100"
              >
                <option>Healthy / Robust</option>
                <option>Minor Functional Limitations</option>
                <option>Chronic Illness (Diabetes/Hypertension)</option>
                <option>Mobility Impaired</option>
                <option>Sensory Impaired (Vision/Hearing)</option>
                <option>Cognitive Decline Risk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Research Specific Context (Optional)
              <span className="ml-2 text-xs text-slate-500 font-normal">Add specific scenario requirements</span>
            </label>
            <textarea 
              name="customPrompt"
              value={formData.customPrompt}
              onChange={handleChange}
              placeholder="E.g., The persona has just lost their phone and is feeling anxious about digital banking."
              rows={3}
              className="w-full border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-900 text-slate-100 resize-none placeholder-slate-600"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-3.5 px-4 border border-transparent rounded-lg shadow-md shadow-indigo-900/20 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <Sparkles className="animate-spin h-5 w-5 mr-2" />
                  <span>Generating Persona Model...</span>
                </>
              ) : (
                <>
                  <span>Generate Persona</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};