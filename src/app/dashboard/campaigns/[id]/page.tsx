'use client';

import React, { use } from 'react';
import { ArrowLeft, Users, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CampaignDetailsPage({ params }: PageProps) {
  // 1. Unwrap the dynamic route promise
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* Header & Back Navigation */}
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard/campaigns" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Summer Collection Launch</h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-gray-500">ID: {campaignId} • Instagram • $15,000 Budget</p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Edit Brief
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors">
              Review Submissions
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column: The Brief */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Creative Brief
            </h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>We are launching our new Summer 2026 line. The focus should be on outdoor lifestyles, vibrant colors, and natural lighting. Do not use artificial filters.</p>
              <h3 className="text-gray-900 font-bold mt-4 mb-2">Required Deliverables:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>2x Instagram Reels (9:16, 15-30 seconds)</li>
                <li>3x Instagram Story frames tagging the brand</li>
                <li>Raw footage files uploaded to Escrow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Creators */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Hired Creators
            </h2>
            
            {/* Mock Creator Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <Image src="https://i.pravatar.cc/150?img=1" alt="Creator" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Elena Rodriguez</p>
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Approval
                  </p>
                </div>
              </div>
              <button className="text-sm text-red-600 font-medium hover:text-red-700">Review</button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <Image src="https://i.pravatar.cc/150?img=33" alt="Creator" className="w-full h-full object-cover" width={40} height={40} unoptimized />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Marcus Johnson</p>
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </p>
                </div>
              </div>
              <button className="text-sm text-gray-500 font-medium hover:text-gray-900">View</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
