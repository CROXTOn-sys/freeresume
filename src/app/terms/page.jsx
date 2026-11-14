import TermsClient from './TermsClient';

export const metadata = {
  title: 'Terms and Conditions',
  description:
    'Read the ResumeLab Terms and Conditions, including the 30-day free-access promotion, usage limits, and user responsibilities.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms and Conditions | ResumeLab',
    description: 'The terms of service for using ResumeLab, the free AI resume builder.',
    url: 'https://resumebuilderlab.com/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
