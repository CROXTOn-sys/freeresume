'use client';

import { useRouter } from 'next/navigation';

export default function ContactClient() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[40px] pt-[24px]">
      <div className="mx-auto w-full max-w-[520px] lg:max-w-[640px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-[20px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-black lg:text-[32px]">Contact Us</h1>
        <p className="mt-[8px] text-[15px] leading-[1.5] text-[#666]">
          Have a question about our free AI resume builder? We&apos;d love to hear from you. Reach out through any of the options below.
        </p>

        <div className="mt-[28px] flex flex-col gap-[16px]">
          {/* Email */}
          <div className="flex items-start gap-[14px] rounded-[16px] border border-[#e8e8f0] bg-white p-[18px] shadow-[0_6px_16px_rgba(17,24,39,0.03)]">
            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[rgba(108,99,255,0.1)] text-[#6C63FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-black">Email Support</h2>
              <p className="mt-[4px] text-[13px] text-[#555]">For any questions or support, email us at</p>
              <a href="mailto:croxtontechnologies@gmail.com" className="mt-[4px] inline-block text-[14px] font-semibold text-[#6C63FF] hover:underline">
                croxtontechnologies@gmail.com
              </a>
            </div>
          </div>

          {/* Response time */}
          <div className="flex items-start gap-[14px] rounded-[16px] border border-[#e8e8f0] bg-white p-[18px] shadow-[0_6px_16px_rgba(17,24,39,0.03)]">
            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[rgba(16,185,129,0.1)] text-[#059669]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-black">Response Time</h2>
              <p className="mt-[4px] text-[13px] leading-[1.6] text-[#555]">We typically respond to all written requests within 24 to 48 hours on business days.</p>
            </div>
          </div>

          {/* Company */}
          <div className="flex items-start gap-[14px] rounded-[16px] border border-[#e8e8f0] bg-white p-[18px] shadow-[0_6px_16px_rgba(17,24,39,0.03)]">
            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[rgba(245,158,11,0.1)] text-[#f59e0b]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-black">Company</h2>
              <p className="mt-[4px] text-[13px] leading-[1.6] text-[#555]">ResumeLab is built and maintained by Croxton Technologies.</p>
            </div>
          </div>
        </div>

        <div className="mt-[24px] rounded-[16px] border border-[#e8e8f0] bg-white p-[20px] shadow-[0_6px_16px_rgba(17,24,39,0.03)]">
          <h2 className="text-[16px] font-bold text-black">Frequently Asked</h2>
          <p className="mt-[8px] text-[13px] leading-[1.6] text-[#555]">
            Before reaching out, you may find your answer in our <a href="/#faq-seo-section" className="font-semibold text-[#6C63FF] hover:underline">FAQ section</a> covering common questions about our free resume builder, ATS scores, and AI features.
          </p>
        </div>
      </div>
    </main>
  );
}
