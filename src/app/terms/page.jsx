import TermsClient from './TermsClient';

export const metadata = {
  title: 'Terms and Conditions',
  description:
    'Read the ResumeLab Terms and Conditions. Understand the terms of using our free AI resume builder, including free and paid usage, user responsibilities, and more.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms and Conditions | ResumeLab',
    description: 'The terms of service for using ResumeLab, the free AI resume builder.',
    url: 'https://resumelab.duckdns.org/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
