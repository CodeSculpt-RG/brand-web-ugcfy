import React from 'react';
import { Star, CheckCircle, TrendingUp } from 'lucide-react';

export default function CreatorDiscoveryMockup() {
  const creators = [
    { name: "Mia Takahashi", handle: "@miastyles", niche: "Fashion", followers: "245K", engagement: "4.8%", match: "98%" },
    { name: "Jake Nelson", handle: "@jake_fits", niche: "Fitness", followers: "128K", engagement: "5.2%", match: "94%" },
    { name: "Sarah Jenkins", handle: "@sarahj.beauty", niche: "Beauty", followers: "450K", engagement: "3.9%", match: "91%" },
  ];

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden text-sm">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="font-semibold text-gray-800">Discover Creators</div>
        <div className="flex gap-2">
          <div className="bg-white border border-gray-200 text-xs px-2 py-1 rounded-full text-gray-500">Filter: Fashion</div>
          <div className="bg-white border border-gray-200 text-xs px-2 py-1 rounded-full text-gray-500">Tier: Micro</div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
        {creators.map((creator, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#E11D48]/30 hover:bg-rose-50/30 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-100 to-rose-200 flex items-center justify-center font-bold text-rose-600">
                {creator.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  {creator.name}
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-xs text-gray-500">{creator.handle} • {creator.niche}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block">
                <div className="font-semibold text-gray-900">{creator.followers}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Audience</div>
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-gray-900 flex items-center justify-end gap-1">
                  {creator.engagement} <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Eng. Rate</div>
              </div>
              <div className="bg-[#E11D48]/10 text-[#E11D48] px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> {creator.match} Match
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-center">
        <button className="bg-[#E11D48] text-white font-semibold text-sm px-4 py-2 rounded-lg w-full hover:bg-[#BE123C] transition-colors shadow-sm">
          Select Creators for Campaign
        </button>
      </div>
    </div>
  );
}
