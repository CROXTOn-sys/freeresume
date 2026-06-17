import './globals.css';

export const metadata = {
  title: 'ResumeLab - Build your ATS Resume',
  description: 'Build an ATS-friendly resume in minutes with ResumeLab.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
