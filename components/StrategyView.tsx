import React from 'react';
import { AnalysisResult } from '../types';
import { Target, Lightbulb, Send, FileText, CheckCircle2 } from 'lucide-react';

interface StrategyViewProps {
  data: AnalysisResult;
}

const StrategyView: React.FC<StrategyViewProps> = ({ data }) => {
  const { marketingStrategy } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{marketingStrategy.title}</h2>
        <p className="text-slate-300 max-w-2xl">
          Dijital analiz sonuçlarına dayalı, yüksek potansiyelli mimarlık firmaları için özelleştirilmiş B2B pazarlama ve iş geliştirme planı.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Value Prop */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Lightbulb size={20} />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Değer Önermesi</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {marketingStrategy.valueProposition}
          </p>
        </div>

        {/* Target Audience */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Target size={20} />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Hedef Kitle Analizi</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {marketingStrategy.targetAudienceAnalysis}
          </p>
        </div>
      </div>

      {/* Outreach Plan */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-3 mb-6">
           <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Send size={20} />
           </div>
           <h3 className="text-xl font-semibold text-slate-800">Eylem Planı (Outreach)</h3>
        </div>
        <div className="space-y-4">
          {marketingStrategy.outreachPlan.map((step, idx) => (
            <div key={idx} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm font-bold mt-0.5 border border-slate-200">
                {idx + 1}
              </div>
              <p className="ml-4 text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email Template */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
               <FileText size={18} />
               <span>Taslak Email Şablonu</span>
            </div>
            <button className="text-xs bg-white border border-slate-200 px-3 py-1 rounded hover:bg-slate-100 transition-colors text-slate-600">
               Kopyala
            </button>
        </div>
        <div className="p-8 bg-slate-50/50">
            <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded shadow-sm p-8">
               <div className="mb-6 border-b border-slate-100 pb-4">
                  <span className="text-slate-400 text-sm block mb-1">Konu:</span>
                  <p className="text-slate-800 font-medium text-lg">{marketingStrategy.emailTemplateSubject}</p>
               </div>
               <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                  {marketingStrategy.emailTemplateBody}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyView;
