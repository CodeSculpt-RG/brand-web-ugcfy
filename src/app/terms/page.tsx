import type { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: "Terms of Service — UGC FY",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
