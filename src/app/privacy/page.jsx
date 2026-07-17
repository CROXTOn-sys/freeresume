'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[40px] pt-[24px]">
      <div className="mx-auto w-full max-w-[520px]">
        <button type="button" onClick={() => router.back()} className="mb-[20px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-black">Privacy Policy</h1>
        <p className="mt-[6px] text-[13px] text-[#888]">Last updated: July 2026</p>

        <div className="mt-[20px] flex flex-col gap-[16px] text-[14px] leading-[1.7] text-[#444]">
          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Information We Collect</h2>
            <p>When you use ResumeLab, we collect:</p>
            <ul className="mt-[8px] list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>Account information (name, email) when you sign up or sign in with Google</li>
              <li>Resume data you enter (stored in your browser and in our database when you download)</li>
              <li>Payment information processed securely by Razorpay (we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">How We Use Your Data</h2>
            <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
              <li>To generate and deliver your resume (PDF/DOCX)</li>
              <li>To save your downloaded resumes for future access</li>
              <li>To enhance your resume content using AI</li>
              <li>To process payments securely</li>
              <li>To improve our service based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Data Storage & Security</h2>
            <p>Your resume data is stored securely in our database (Supabase) and is accessible only to you when signed in. We use encryption in transit (HTTPS) and follow industry-standard security practices. We do not sell, share, or rent your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Your Rights</h2>
            <p>You can delete your saved resumes at any time from the My Resumes section. To delete your account entirely, contact us at support@croxton.in.</p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-black mb-[6px]">Contact</h2>
            <p>For any privacy-related questions, reach us at <strong>croxtontechnologies@gmail.com</strong>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
