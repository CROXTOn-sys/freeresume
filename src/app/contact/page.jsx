import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us',
  description:
    'Contact ResumeLab for support with our free AI resume builder. Email us at croxtontechnologies@gmail.com — we respond to all requests within 24 to 48 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | ResumeLab',
    description: 'Get in touch with the ResumeLab team for support with our free AI resume builder.',
    url: 'https://resumelab.duckdns.org/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
