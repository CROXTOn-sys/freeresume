import './globals.css';

export const metadata = {
  title: 'ResumeLab - ATS Friendly Resume Builder',
  description: 'Build an ATS-friendly resume in minutes with ResumeLab.',
  manifest: '/manifest.json',
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
      <body>{children}</body>
    </html>
  );
}
