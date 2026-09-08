import RefundClient from './RefundClient';

export const metadata = {
  title: 'Refund Policy',
  description:
    'Read the ResumeLab Refund Policy. Understand the terms around downloads and payments for our free AI resume builder.',
  alternates: { canonical: '/refund' },
  openGraph: {
    title: 'Refund Policy | ResumeLab',
    description: 'The refund policy for ResumeLab, the free AI resume builder.',
    url: 'https://resumelab.duckdns.org/refund',
    type: 'website',
  },
};

export default function RefundPage() {
  return <RefundClient />;
}
