import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "UGC FY — AI-Powered Influencer Marketing Platform",
  description:
    "UGC FY helps brands discover creators, manage UGC campaigns, review content, track performance, and scale influencer marketing with AI-powered workflows.",
  alternates: {
    canonical: "/",
  },
};

import ClientPage from './ClientPage';
import { JsonLd } from '@/components/seo/JsonLd';

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UGC FY",
  url: "https://www.ugcfy.com",
  logo: "https://www.ugcfy.com/android-chrome-512x512.png",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UGC FY",
  url: "https://www.ugcfy.com",
  description:
    "UGC FY helps brands discover creators, manage UGC campaigns, review content, track performance, and scale influencer marketing with AI-powered workflows.",
};

export default function Page() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <ClientPage />
    </>
  );
}
