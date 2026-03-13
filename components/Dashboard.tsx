import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Building2, TrendingUp, Users, Search, Globe, Instagram, MapPin } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const averageScore = (data.analyzedFirms.reduce((acc, firm) => acc + firm.digitalMaturityScore, 0) / data.analyzedFirms.length).toFixed(1);
  const highScorers = data.analyzedFirms.filter(f => f.digitalMaturityScore >= 8).length;
  
  const scoreDistribution = [
    { name: 'Yüksek (8-10)', value: data.analyzedFirms.filter(f => f.digitalMaturityScore >= 8).length, color: '#22c55e' },
    { name: 'Orta (5-7)', value: data.analyzedFirms.filter(f => f.digitalMaturityScore >= 5 && f.digitalMaturityScore < 8).length, color: '#eab308' },
    { name: 'Düşük (1-4)', value: data.analyzedFirms.filter(f => f.digitalMaturityScore < 5).length, color: '#ef4444' },
  ];

  const top5Firms = [...data.analyzedFirms]
    .sort((a, b) => b.digitalMaturityScore - a.digitalMaturityScore)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Analiz Edilen Firma</p>
            <p className="text-2xl font-bold text-slate-800">{data.analyzedFirms.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Ortalama Dijital Skor</p>
            <p className="text-2xl font-bold text-slate-800">{averageScore}<span className="text-sm text-slate-400">/10</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Dijital Liderler</p>
            <p className="text-2xl font-bold text-slate-800">{highScorers}</p>
          </div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Search size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Veri Kaynağı</p>
            <p className="text-lg font-bold text-slate-800">Google Grounding</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">En Yüksek Skorlu 5 Firma</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top5Firms} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 10]} hide />
                <YAxis dataKey="name" type="category" width={150} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="digitalMaturityScore" radius={[0, 4, 4, 0]}>
                   {top5Firms.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Dijital Olgunluk Dağılımı</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-700">{data.analyzedFirms.length}</span>
                <span className="text-xs text-slate-400">Firma</span>
             </div>
          </div>
          <div className="flex justify-center gap-4 text-sm mt-2">
            {scoreDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 List Preview */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Dijital Liderler (Top 10)</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Yüksek Potansiyel</span>
        </div>
        <div className="divide-y divide-slate-100">
          {data.top10.map((firm, idx) => (
            <div key={firm.id || idx} className="p-4 flex items-start space-x-4 hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-semibold text-slate-900">{firm.name}</h4>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700 font-bold text-sm">
                    {firm.digitalMaturityScore}/10
                  </div>
                </div>
                <div className="mt-1 flex items-center text-xs text-slate-500 space-x-3">
                  <span className="flex items-center"><MapPin size={12} className="mr-1" /> {firm.location || "İzmir"}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{firm.reasoning}</p>
                <div className="mt-2 flex space-x-2">
                   {/* Mock indicators based on logic, as real data might vary */}
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                     <Globe size={10} className="mr-1"/> Web Aktif
                   </span>
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-50 text-pink-700">
                     <Instagram size={10} className="mr-1"/> Sosyal Medya
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
