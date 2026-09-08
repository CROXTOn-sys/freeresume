import './globals.css';
import Script from 'next/script';

const SITE_URL = 'https://resumelab.duckdns.org';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Resume Builder - Free AI Resume Builder | ResumeLab',
    template: '%s | ResumeLab',
  },
  description:
    'ResumeLab is a free AI resume builder that helps you create an ATS-friendly resume in minutes. Use our best free resume builder with professional templates, online resume builder tools, and AI resume builder features — completely free.',
  keywords: [
    'resume builder',
    'free resume builder',
    'ai resume builder',
    'resume builder free',
    'ai resume builder free',
    'resume builder ai',
    'best resume builder',
    'best free resume builder',
    'resume builder template',
    'resume builder for free',
    'free ai resume builder',
    'online resume builder',
    'ATS resume builder',
    'ATS friendly resume',
  ],
  applicationName: 'ResumeLab',
  authors: [{ name: 'ResumeLab' }],
  creator: 'ResumeLab',
  publisher: 'ResumeLab',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ResumeLab',
    title: 'Resume Builder - Free AI Resume Builder | ResumeLab',
    description:
      'Create an ATS-friendly resume in minutes with ResumeLab, the best free AI resume builder. Professional resume builder templates, online resume builder, and AI resume builder tools — free to use.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'ResumeLab - Free AI Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume Builder - Free AI Resume Builder | ResumeLab',
    description:
      'Build an ATS-friendly resume in minutes with the best free AI resume builder. Professional templates, online resume builder, and AI-powered tools — free.',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: [
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ResumeLab',
  },
  themeColor: '#6C63FF',
};

export const viewport = {
  themeColor: '#6C63FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ResumeLab" />
        <meta name="application-name" content="ResumeLab" />
        <meta name="msapplication-TileColor" content="#6C63FF" />
        <meta name="msapplication-TileImage" content="/images/logo.png" />
      </head>
      <body>
        <Script id="structured-data-app" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ResumeLab',
            alternateName: 'ResumeLab AI Resume Builder',
            url: SITE_URL,
            description:
              'ResumeLab is a free AI resume builder that helps you create an ATS-friendly resume in minutes with professional templates and AI-powered tools.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '2400',
            },
            featureList: [
              'Free AI resume builder',
              'ATS-friendly resume templates',
              'Online resume builder',
              'AI-powered content enhancement',
              'One-click PDF and DOCX export',
            ],
          })}
        </Script>
        <Script id="structured-data-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ResumeLab',
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo.png`,
          })}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-0JKSFPH61G" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0JKSFPH61G');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
