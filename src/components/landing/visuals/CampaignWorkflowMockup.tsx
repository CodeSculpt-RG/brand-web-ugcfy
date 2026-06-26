import React from 'react';
import { Send, CheckCircle2, Clock, Mail } from 'lucide-react';

export default function CampaignWorkflowMockup() {
  const steps = [
    { title: "Review Profile", status: "completed", icon: CheckCircle2, time: "2m ago" },
    { title: "Generate Brief", status: "completed", icon: CheckCircle2, time: "Just now" },
    { title: "Send Outreach Email", status: "current", icon: Mail, time: "In Progress" },
    { title: "Negotiate Rate", status: "pending", icon: Clock, time: "Waiting" },
  ];

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden text-sm relative">
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-4 text-white flex justify-between items-center">
        <div>
          <div className="font-bold text-lg">Campaign Outreach</div>
          <div className="text-rose-100 text-xs">Summer Collection 2026</div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          32 Pending
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="text-sm font-semibold text-gray-700 mb-2">Outreach Sequence: @miastyles</div>
        
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-6">
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                step.status === 'completed' ? 'bg-green-500 border-green-500' :
                step.status === 'current' ? 'bg-rose-500 border-rose-500 ring-4 ring-rose-100' :
                'bg-white border-gray-300'
              }`} />
              
              <div className="flex justify-between items-start -mt-1">
                <div>
                  <div className={`font-semibold ${
                    step.status === 'completed' ? 'text-gray-900' :
                    step.status === 'current' ? 'text-rose-600' :
                    'text-gray-400'
                  }`}>{step.title}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <step.icon className="w-3 h-3" /> {step.time}
                  </div>
                </div>
                {step.status === 'current' && (
                  <button className="bg-rose-500 text-white p-1.5 rounded-lg shadow-sm hover:bg-rose-600 transition-colors">
                    <Send className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
