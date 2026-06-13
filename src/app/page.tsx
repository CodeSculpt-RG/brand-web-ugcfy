'use client';

import dynamic from 'next/dynamic';

// Dynamically import the landing page and permanently disable SSR
// This completely isolates the app from browser extension DOM mutations
const ClientLandingPage = dynamic(() => import('./LandingPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FCF6F6]">
      {/* Responsive, centered loading spinner matching the premium brand colors */}
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function Page() {
  return <ClientLandingPage />;
}
