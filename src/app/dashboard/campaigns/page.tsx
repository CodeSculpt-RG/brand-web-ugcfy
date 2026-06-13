'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  LayoutGrid, 
  TrendingUp, 
  Wallet, 
  CheckCircle, 
  X, 
  Megaphone,
  Video,
  Camera,
  Calendar,
  Users,
  FileText,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'

type CampaignStatus = 'Draft' | 'Active' | 'Completed'

interface Campaign {
  id: string
  title: string
  status: CampaignStatus
  budget: number
  platform: string
  deliverables: string
  startDate: string
  endDate: string
  targetAudience: string
  brandBrief: string
  moodboardUrl: string
  pendingApprovals: number // Critical for the UI badge
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Summer Collection Launch',
    status: 'Active',
    budget: 15000,
    platform: 'Instagram',
    deliverables: '3 Reels, 5 Stories',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    targetAudience: 'Gen Z, Millennials',
    brandBrief: 'Highlight our new summer styles in everyday urban settings.',
    moodboardUrl: 'https://example.com/moodboard1',
    pendingApprovals: 2
  },
  {
    id: '2',
    title: 'Back to School Promo',
    status: 'Draft',
    budget: 8000,
    platform: 'TikTok',
    deliverables: '2 Dedicated Videos',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    targetAudience: 'Students, High Schoolers',
    brandBrief: 'Creative, energetic transitions using backpacks and notebooks.',
    moodboardUrl: '',
    pendingApprovals: 0
  },
  {
    id: '3',
    title: 'Q1 Brand Awareness',
    status: 'Completed',
    budget: 25000,
    platform: 'YouTube',
    deliverables: '1 Long-form Integration',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    targetAudience: 'Broad Consumer Base',
    brandBrief: 'A deep dive into our sustainability mission and product quality.',
    moodboardUrl: 'https://example.com/moodboard3',
    pendingApprovals: 0
  }
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS)
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Draft' | 'Completed'>('All')
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    platform: 'Instagram',
    budget: '',
    deliverables: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    brandBrief: '',
    moodboardUrl: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substring(7),
      title: formData.title || 'Untitled Campaign',
      status: 'Draft',
      budget: parseFloat(formData.budget) || 0,
      platform: formData.platform,
      deliverables: formData.deliverables || 'TBD',
      startDate: formData.startDate,
      endDate: formData.endDate,
      targetAudience: formData.targetAudience,
      brandBrief: formData.brandBrief,
      moodboardUrl: formData.moodboardUrl,
      pendingApprovals: 0
    }

    setCampaigns([newCampaign, ...campaigns])
    setIsSlideOverOpen(false)
    
    // Reset Form
    setFormData({
      title: '',
      platform: 'Instagram',
      budget: '',
      deliverables: '',
      startDate: '',
      endDate: '',
      targetAudience: '',
      brandBrief: '',
      moodboardUrl: ''
    })
  }

  const activeCount = campaigns.filter(c => c.status === 'Active').length
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const pendingDeliverables = campaigns.filter(c => c.status !== 'Completed').length

  const getStatusClasses = (status: CampaignStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Draft':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Camera className="w-4 h-4" />
      case 'tiktok':
      case 'youtube':
        return <Video className="w-4 h-4" />
      default:
        return <Megaphone className="w-4 h-4" />
    }
  }

  const filteredCampaigns = campaigns.filter(c => activeFilter === 'All' || c.status === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
          <p className="text-gray-500 mt-1">Manage your creator collaborations and active deliverables.</p>
        </div>
        <div className="flex gap-2 items-center">
          {activeFilter !== 'All' && (
            <button 
              onClick={() => setActiveFilter('All')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors"
            >
              Clear Filter
            </button>
          )}
          <button 
            onClick={() => setIsSlideOverOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Top-Level Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <button 
          onClick={() => setActiveFilter('Active')}
          className={`text-left bg-white border ${activeFilter === 'Active' ? 'border-red-500 shadow-md ring-1 ring-red-500' : 'border-gray-200/60'} rounded-2xl p-6 flex items-center justify-between hover:border-red-500 hover:shadow-md cursor-pointer transition-all`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-bold text-gray-900">{activeCount}</span>
              <span className="flex items-center text-sm font-medium text-emerald-600 mb-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <LayoutGrid className="w-6 h-6" />
          </div>
        </button>

        <button 
          onClick={() => setActiveFilter('All')}
          className={`text-left bg-white border ${activeFilter === 'All' ? 'border-red-500 shadow-md ring-1 ring-red-500' : 'border-gray-200/60'} rounded-2xl p-6 flex items-center justify-between hover:border-red-500 hover:shadow-md cursor-pointer transition-all`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">Total Budget Deployed</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">
                ${totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <Wallet className="w-6 h-6" />
          </div>
        </button>

        <button 
          onClick={() => setActiveFilter('Draft')}
          className={`text-left bg-white border ${activeFilter === 'Draft' ? 'border-red-500 shadow-md ring-1 ring-red-500' : 'border-gray-200/60'} rounded-2xl p-6 flex items-center justify-between hover:border-red-500 hover:shadow-md cursor-pointer transition-all`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Deliverables</p>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">{pendingDeliverables}</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* Campaign Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {filteredCampaigns.map(campaign => (
          <div 
            key={campaign.id}
            className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 relative group cursor-pointer flex flex-col justify-between"
          >
            {/* Absolute badge for pending approvals */}
            {campaign.pendingApprovals > 0 && (
              <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                {campaign.pendingApprovals}
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(campaign.status)}`}>
                  {campaign.status}
                </div>
                <div className="text-gray-500 flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                  {getPlatformIcon(campaign.platform)}
                  <span className="font-medium">{campaign.platform}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {campaign.title}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{campaign.startDate ? `${campaign.startDate} to ${campaign.endDate}` : 'Dates TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{campaign.targetAudience || 'Target Audience TBD'}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-700 font-medium line-clamp-1">
                  Deliverables: {campaign.deliverables}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="font-bold text-gray-900 text-lg">
                ${campaign.budget.toLocaleString()}
              </div>
              <Link 
                href={`/dashboard/campaigns/${campaign.id}`}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                View Details &rarr;
              </Link>
            </div>
          </div>
        ))}
        {filteredCampaigns.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-gray-200/60 rounded-2xl border-dashed">
            <p className="text-gray-500">No campaigns found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Slide-Over Form */}
      {isSlideOverOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSlideOverOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-2xl pl-10 pointer-events-none">
            <div className="w-full pointer-events-auto transform transition-transform duration-500 ease-in-out">
              <div className="flex h-full flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                
                {/* Slide-Over Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Launch New Campaign</h2>
                    <p className="text-sm text-gray-500 mt-1">Set up the foundation for your next creator collaboration.</p>
                  </div>
                  <button 
                    onClick={() => setIsSlideOverOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                  <form id="create-campaign-form" onSubmit={handleCreateCampaign} className="space-y-8">
                    
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Details</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                        <input 
                          type="text" 
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                          placeholder="e.g. Winter Holiday Launch"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                          <select 
                            name="platform"
                            value={formData.platform}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                          >
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Twitter">Twitter</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                          <input 
                            type="number" 
                            name="budget"
                            required
                            min="0"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                            placeholder="5000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Audience Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Timeline & Audience</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input 
                            type="date" 
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input 
                            type="date" 
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                        <input 
                          type="text" 
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                          placeholder="e.g. Gen Z, Tech Enthusiasts, US based"
                        />
                      </div>
                    </div>

                    {/* Brief & Deliverables Section */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Briefing</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          Brand Brief
                        </label>
                        <textarea 
                          name="brandBrief"
                          rows={3}
                          value={formData.brandBrief}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm resize-none"
                          placeholder="Describe the main message, tone, and goals for the creators..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                          Moodboard URL
                        </label>
                        <input 
                          type="url" 
                          name="moodboardUrl"
                          value={formData.moodboardUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm"
                          placeholder="https://pinterest.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
                        <textarea 
                          name="deliverables"
                          required
                          rows={2}
                          value={formData.deliverables}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all shadow-sm resize-none"
                          placeholder="e.g. 2 Reels, 3 Stories, Link in Bio"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Slide-Over Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsSlideOverOpen(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    form="create-campaign-form"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <Megaphone className="w-5 h-5" />
                    Launch Campaign
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
