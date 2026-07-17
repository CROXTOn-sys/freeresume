'use client';

import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[40px] pt-[24px]">
      <div className="mx-auto w-full max-w-[520px]">
        <button type="button" onClick={() => router.back()} className="mb-[20px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-black">Terms of Service</h1>
        <p className="mt-[6px] text-[13px] text-[#888]">Last updated: July 2026</p>

        <div className="mt-[20px] flex flex-col gap-[16px] text-[14px] leading-[1.7] text-[#444]">
          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Acceptance of Terms</h2>
            <p>By using ResumeLab, you agree to these terms. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Service Description</h2>
            <p>ResumeLab is an online resume builder that helps users create ATS-friendly resumes. We provide templates, AI-powered content enhancement, and PDF/DOCX export.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Free & Paid Usage</h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>Your first resume download is free of charge</li>
              <li>Additional downloads require a one-time payment of ₹19 for unlimited access</li>
              <li>AI enhancement is available to all users</li>
              <li>Sign-in (via Google or email) is required to download</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">User Responsibilities</h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>You are responsible for the accuracy of the information in your resume</li>
              <li>You must not use the service for any unlawful purpose</li>
              <li>You must not attempt to bypass payment mechanisms or abuse the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Intellectual Property</h2>
            <p>You own the content of your resume. ResumeLab retains ownership of its templates, designs, AI models, and platform. You may not copy, redistribute, or sell our templates.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Disclaimer</h2>
            <p>ResumeLab does not guarantee employment or interview success. Our service provides tools to create professional resumes, but hiring decisions are made by employers independently.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Limitation of Liability</h2>
            <p>ResumeLab is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from the use of our service, including but not limited to lost opportunities or data loss.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Contact</h2>
            <p>For questions about these terms, contact us at <strong>croxtontechnologies@gmail.com</strong>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
