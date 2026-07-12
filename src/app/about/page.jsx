'use client';

import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[40px] pt-[24px]">
      <div className="mx-auto w-full max-w-[520px]">
        {/* Header */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-[20px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">
          How It Works
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.5] text-[#666]">
          Build a professional, ATS-ready resume in minutes. Here&apos;s how to get the best results.
        </p>

        {/* Steps */}
        <div className="mt-[28px] flex flex-col gap-[16px]">
          <StepCard
            number="1"
            title="Choose a Template"
            description="Pick from our ATS-friendly templates designed to pass recruitment software scans used by 90%+ of companies."
          />
          <StepCard
            number="2"
            title="Upload or Start Fresh"
            description="Upload an existing resume (PDF or DOCX) to auto-fill your details, or start from scratch and fill each section manually."
          />
          <StepCard
            number="3"
            title="Fill Your Details Thoroughly"
            description="This is the most important step. Write detailed, descriptive bullet points for your experience, projects, and skills. The more context you provide, the better the AI enhancement will be. Don't use short phrases — write complete sentences describing what you did, what tools you used, and what results you achieved."
          />
          <StepCard
            number="4"
            title="Review Before Enhancing"
            description="Before tapping Enhance All, review every section. Make sure your bullet points are descriptive enough. If you uploaded a resume, check that the imported content is complete and edit anything that's too brief. Short or vague lines won't give the AI enough to work with."
          />
          <StepCard
            number="5"
            title="Enhance with AI"
            description="Tap the Enhance All button. Our AI will rewrite your bullet points and descriptions to be concise, impactful, and ATS-optimized — starting each with a strong action verb while preserving your original meaning and metrics."
          />
          <StepCard
            number="6"
            title="Download"
            description="Sign in with Google (one tap) and download your polished resume as PDF or DOCX. Your resume is ready to send to recruiters."
          />
        </div>

        {/* Tips Section */}
        <div className="mt-[32px] rounded-[18px] border border-[#e8e8f0] bg-white p-[20px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
          <h2 className="text-[18px] font-bold text-black">Tips for Best Results</h2>
          <ul className="mt-[14px] flex flex-col gap-[12px] text-[14px] leading-[1.6] text-[#444]">
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Write detailed bullet points — &quot;Built a dashboard using React and SQL that reduced reporting time by 40%&quot; is far better than &quot;Built a dashboard&quot;</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Include numbers, metrics, and percentages wherever possible — AI preserves these exactly</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Fill every section completely — even brief entries help AI produce better output</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Use Enhance All after filling all fields, not in between — it works on everything at once</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>If you uploaded a resume, review and expand any lines that were imported too short</span>
            </li>
          </ul>
        </div>

        {/* What is ATS */}
        <div className="mt-[20px] rounded-[18px] border border-[#e8e8f0] bg-white p-[20px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
          <h2 className="text-[18px] font-bold text-black">What is ATS?</h2>
          <p className="mt-[10px] text-[14px] leading-[1.7] text-[#444]">
            ATS (Applicant Tracking System) is software that companies use to filter resumes before a human ever reads them. Over 90% of large companies use ATS to scan, rank, and shortlist candidates. If your resume isn&apos;t formatted correctly, it gets rejected automatically — no matter how qualified you are. Our templates are specifically built to pass these scans with clean formatting, proper headings, and parseable text.
          </p>
        </div>

        {/* Quick Info */}
        <div className="mt-[20px] rounded-[18px] border border-[#e8e8f0] bg-white p-[20px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
          <h2 className="text-[18px] font-bold text-black">Quick Info</h2>
          <ul className="mt-[14px] flex flex-col gap-[10px] text-[14px] leading-[1.6] text-[#444]">
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>AI enhancement is available for all users</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Sign-in (Google recommended) is required only for downloading</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Your data stays in your browser — we don&apos;t store your resume on our servers</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Download available in PDF and DOCX formats</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="flex gap-[14px] rounded-[16px] border border-[#e8e8f0] bg-white p-[16px] shadow-[0_6px_16px_rgba(17,24,39,0.03)]">
      <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[14px] font-bold text-white">
        {number}
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-black">{title}</h3>
        <p className="mt-[6px] text-[13px] leading-[1.6] text-[#555]">{description}</p>
      </div>
    </div>
  );
}
