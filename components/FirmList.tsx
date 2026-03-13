import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Search, MapPin, ExternalLink, Star } from 'lucide-react';

interface FirmListProps {
  data: AnalysisResult;
}

const FirmList: React.FC<FirmListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<number | null>(null);

  const filteredFirms = data.analyzedFirms.filter(firm => {
    const matchesSearch = firm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          firm.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = filterScore ? firm.digitalMaturityScore >= filterScore : true;
    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Firma adı veya konum ara..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Skor Filtresi:</span>
            <select 
               className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               onChange={(e) => setFilterScore(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Tümü</option>
              <option value="8">8+ (Liderler)</option>
              <option value="5">5+ (Ortalama)</option>
            </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFirms.map((firm) => (
          <div key={firm.id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                 <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg">
                    {firm.name.charAt(0)}
                 </div>
                 <div className={`px-2 py-1 rounded text-sm font-bold ${
                    firm.digitalMaturityScore >= 8 ? 'bg-green-100 text-green-700' :
                    firm.digitalMaturityScore >= 5 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                 }`}>
                    {firm.digitalMaturityScore}/10
                 </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1" title={firm.name}>{firm.name}</h3>
              <div className="flex items-center text-xs text-slate-500 mb-4">
                 <MapPin size={12} className="mr-1" />
                 {firm.location}
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                 {firm.reasoning}
              </p>

              <div className="space-y-2 mt-auto">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Web Kalitesi</span>
                    <span className={`font-medium ${
                       firm.websiteQuality === 'High' ? 'text-green-600' : 
                       firm.websiteQuality === 'Medium' ? 'text-yellow-600' : 'text-red-500'
                    }`}>{firm.websiteQuality === 'High' ? 'Yüksek' : firm.websiteQuality === 'Medium' ? 'Orta' : 'Düşük'}</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${
                       firm.websiteQuality === 'High' ? 'bg-green-500' : 
                       firm.websiteQuality === 'Medium' ? 'bg-yellow-500' : 'bg-red-400'
                    }`} style={{width: firm.websiteQuality === 'High' ? '100%' : firm.websiteQuality === 'Medium' ? '60%' : '30%'}}></div>
                 </div>

                 <div className="flex justify-between text-xs mt-2">
                    <span className="text-slate-500">Sosyal Medya</span>
                    <span className={`font-medium ${
                       firm.socialMediaPresence === 'High' ? 'text-green-600' : 
                       firm.socialMediaPresence === 'Medium' ? 'text-yellow-600' : 'text-red-500'
                    }`}>{firm.socialMediaPresence === 'High' ? 'Güçlü' : firm.socialMediaPresence === 'Medium' ? 'Orta' : 'Zayıf'}</span>
                 </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${
                       firm.socialMediaPresence === 'High' ? 'bg-green-500' : 
                       firm.socialMediaPresence === 'Medium' ? 'bg-yellow-500' : 'bg-red-400'
                    }`} style={{width: firm.socialMediaPresence === 'High' ? '100%' : firm.socialMediaPresence === 'Medium' ? '60%' : '30%'}}></div>
                 </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
               <span className="text-xs text-slate-400">Son Aktivite: {firm.lastDigitalActivity || "Bilinmiyor"}</span>
               <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center transition-colors">
                  Detaylar <ExternalLink size={12} className="ml-1" />
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredFirms.length === 0 && (
         <div className="text-center py-20 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>Eşleşen firma bulunamadı.</p>
         </div>
      )}
    </div>
  );
};

export default FirmList;
