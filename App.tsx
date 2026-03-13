import React, { useState, useEffect } from 'react';
import { ViewState, AnalysisResult } from './types';
import { RAW_DATA } from './data';
import { analyzeFirmsData } from './services/geminiService';
import Dashboard from './components/Dashboard';
import FirmList from './components/FirmList';
import StrategyView from './components/StrategyView';
import { LayoutDashboard, List, Trophy, Lightbulb, Loader2, Sparkles, Building, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.IDLE);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'strategy'>('dashboard');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startAnalysis = async () => {
    setViewState(ViewState.ANALYZING);
    setErrorMsg(null);
    try {
      const result = await analyzeFirmsData(RAW_DATA);
      setAnalysisResult(result);
      setViewState(ViewState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Analiz sırasında bir hata oluştu.");
      setViewState(ViewState.ERROR);
    }
  };

  const renderContent = () => {
    if (viewState === ViewState.IDLE) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fadeIn">
          <div className="bg-blue-50 p-6 rounded-full mb-8">
            <Sparkles className="text-blue-600 w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            İzmir Mimarlık BI Analisti
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8 leading-relaxed">
            Gemini AI ve Google Arama entegrasyonu ile mimarlık firmalarının dijital olgunluk seviyelerini analiz edin, liderleri belirleyin ve "Venice Panjur" için özel B2B stratejileri oluşturun.
          </p>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-md w-full mb-8 text-left">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
              <Building className="mr-2 text-slate-400" size={18}/> 
              Analiz Kapsamı
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>45+ Kurumsal Mimarlık Ofisi</li>
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Web Sitesi ve Blog Sıklığı</li>
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>Instagram & LinkedIn Etkileşimi</li>
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>Google Haritalar Görünürlüğü</li>
            </ul>
          </div>
          <button 
            onClick={startAnalysis}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Analizi Başlat
            <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
          <p className="mt-4 text-xs text-slate-400">Gemini 3 Flash Preview & Google Search Grounding Kullanır</p>
        </div>
      );
    }

    if (viewState === ViewState.ANALYZING) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-pulse">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-8" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Veriler Analiz Ediliyor...</h2>
          <p className="text-slate-500 text-center max-w-md">
            Gemini, İzmir'deki mimarlık firmalarını Google üzerinden tarıyor, sosyal medya varlıklarını inceliyor ve dijital skorlarını hesaplıyor. Bu işlem birkaç saniye sürebilir.
          </p>
          <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-progressBar"></div>
          </div>
        </div>
      );
    }

    if (viewState === ViewState.ERROR) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="bg-red-50 p-6 rounded-full mb-6">
            <AlertTriangle className="text-red-500 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-slate-500 mb-6 max-w-lg text-center">{errorMsg}</p>
          <button 
            onClick={() => setViewState(ViewState.IDLE)}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      );
    }

    if (viewState === ViewState.COMPLETE && analysisResult) {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard data={analysisResult} />;
        case 'list':
          return <FirmList data={analysisResult} />;
        case 'strategy':
          return <StrategyView data={analysisResult} />;
        default:
          return <Dashboard data={analysisResult} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center text-blue-600 font-bold text-xl tracking-tight">
                <Building className="mr-2" />
                Digital<span className="text-slate-900">Architect</span>BI
              </div>
            </div>
            {viewState === ViewState.COMPLETE && (
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <LayoutDashboard size={16} className="mr-2" />
                  Genel Bakış
                </button>
                <button 
                  onClick={() => setActiveTab('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'list' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <List size={16} className="mr-2" />
                  Firmalar
                </button>
                <button 
                  onClick={() => setActiveTab('strategy')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'strategy' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Lightbulb size={16} className="mr-2" />
                  B2B Strateji
                </button>
              </div>
            )}
             {viewState === ViewState.IDLE && (
                 <div className="flex items-center">
                     <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">v1.0.0 Beta</span>
                 </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes progressBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
        .animate-progressBar {
          animation: progressBar 8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
