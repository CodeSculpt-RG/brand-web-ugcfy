import React from 'react';
import { PlayCircle, Image as ImageIcon, BarChart2, MoreHorizontal } from 'lucide-react';

export default function CampaignDashboardMockup() {
  const deliverables = [
    { type: "Video", platform: "TikTok", creator: "@miastyles", status: "Approved", icon: PlayCircle, color: "text-rose-500", bg: "bg-rose-100" },
    { type: "Image", platform: "Instagram", creator: "@jake_fits", status: "In Review", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-100" },
    { type: "Video", platform: "YouTube", creator: "@sarahj.beauty", status: "Drafting", icon: PlayCircle, color: "text-blue-500", bg: "bg-blue-100" },
  ];

  return (
    <div className="w-full h-full bg-slate-50 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden text-sm relative">
      <div className="bg-white border-b border-slate-200 px-5 py-4 flex justify-between items-center">
        <div>
          <div className="font-bold text-slate-800">Summer Launch &apos;26</div>
          <div className="text-slate-500 text-xs">Campaign Dashboard</div>
        </div>
        <div className="w-10 h-10 rounded-full border-4 border-rose-100 flex items-center justify-center">
          <div className="text-xs font-bold text-rose-600">85%</div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-1">
          <div className="font-semibold text-slate-700">Recent Deliverables</div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>
        
        {deliverables.map((item, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-xs">{item.type} for {item.platform}</div>
                <div className="text-[10px] text-slate-500">{item.creator}</div>
              </div>
            </div>
            
            <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              item.status === 'Approved' ? 'bg-green-100 text-green-700' :
              item.status === 'In Review' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-600'
            }`}>
              {item.status}
            </div>
          </div>
        ))}

        <div className="mt-2 bg-slate-900 text-white p-3 rounded-xl shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Total Reach</div>
            <div className="text-xl font-black">2.4M</div>
          </div>
          <BarChart2 className="w-12 h-12 text-slate-700 absolute -right-2 -bottom-2 z-0 opacity-50" />
        </div>
      </div>
    </div>
  );
}
