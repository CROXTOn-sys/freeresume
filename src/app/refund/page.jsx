'use client';

import { useRouter } from 'next/navigation';

export default function RefundPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[40px] pt-[24px]">
      <div className="mx-auto w-full max-w-[520px]">
        <button type="button" onClick={() => router.back()} className="mb-[20px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-black">Refund & Cancellation Policy</h1>
        <p className="mt-[6px] text-[13px] text-[#888]">Last updated: July 2026</p>

        <div className="mt-[20px] flex flex-col gap-[16px] text-[14px] leading-[1.7] text-[#444]">
          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Digital Product</h2>
            <p>ResumeLab provides digital services (resume generation, AI enhancement, and PDF/DOCX export). Once a payment is processed and access is granted, the service is considered delivered.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Refund Policy</h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>Refund requests are accepted within <strong>24 hours</strong> of payment if the service was not used (no downloads made after payment)</li>
              <li>If you have downloaded a resume after payment, no refund will be issued as the service has been delivered</li>
              <li>In case of duplicate payments or technical errors, a full refund will be processed within 5-7 business days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Cancellation</h2>
            <p>Since ResumeLab offers a one-time payment (not a subscription), there is no recurring charge to cancel. Your unlimited access remains active permanently after payment.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">How to Request a Refund</h2>
            <p>To request a refund, email us at <strong>croxtontechnologies@gmail.com</strong> with your registered email address and payment details. We will review and respond within 48 hours.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Contact</h2>
            <p>For any payment-related concerns, reach us at <strong>croxtontechnologies@gmail.com</strong>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
