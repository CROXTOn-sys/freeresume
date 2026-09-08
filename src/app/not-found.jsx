import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found (404)',
  description: 'The page you are looking for could not be found. Return to ResumeLab, the free AI resume builder, to continue building your resume.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] py-[40px]">
      <div className="mx-auto w-full max-w-[480px] text-center">
        <div className="mx-auto mb-[20px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[rgba(108,99,255,0.1)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        <p className="text-[64px] font-black leading-[1] tracking-[-0.04em] text-[#6C63FF]">404</p>
        <h1 className="mt-[8px] text-[24px] font-extrabold tracking-[-0.02em] text-black lg:text-[28px]">
          Page Not Found
        </h1>
        <p className="mx-auto mt-[10px] max-w-[380px] text-[14px] leading-[1.6] text-[#666]">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to building a great resume.
        </p>

        <div className="mt-[28px] flex flex-col items-center justify-center gap-[10px] sm:flex-row">
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[24px] py-[13px] text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(108,99,255,0.22)] transition-transform hover:-translate-y-[1px] sm:w-auto"
          >
            Back to Home
          </Link>
          <Link
            href="/resume-builder"
            className="flex w-full items-center justify-center rounded-[14px] border border-[#e5e7eb] bg-white px-[24px] py-[13px] text-[14px] font-bold text-black transition-colors hover:border-[#6C63FF] hover:text-[#6C63FF] sm:w-auto"
          >
            Build a Resume
          </Link>
        </div>

        <div className="mt-[28px] flex flex-wrap items-center justify-center gap-x-[14px] gap-y-[8px] text-[12px] text-[#999]">
          <Link href="/ats-checker" className="hover:text-[#6C63FF] transition-colors">ATS Checker</Link>
          <span>·</span>
          <Link href="/interview-prep" className="hover:text-[#6C63FF] transition-colors">Interview Prep</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-[#6C63FF] transition-colors">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
