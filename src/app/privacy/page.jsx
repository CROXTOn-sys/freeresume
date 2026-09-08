import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Read the ResumeLab Privacy Policy. Learn what information we collect, how we use your data, and how we keep your resume data secure on our free resume builder.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | ResumeLab',
    description: 'How ResumeLab collects, uses, and protects your data on our free AI resume builder.',
    url: 'https://resumelab.duckdns.org/privacy',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
