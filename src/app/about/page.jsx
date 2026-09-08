import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Us - How Our Free Resume Builder Works',
  description:
    'Learn how ResumeLab, the free AI resume builder, works. Choose an ATS-friendly template, add your details, track your ATS score, and download a professional resume in minutes.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us - How Our Free Resume Builder Works | ResumeLab',
    description:
      'Discover how ResumeLab helps you build an ATS-friendly resume with AI-powered tools and professional templates — completely free.',
    url: 'https://resumelab.duckdns.org/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
