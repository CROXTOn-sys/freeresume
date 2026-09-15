'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function AboutClient() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--page-bg-mid)] pt-[68px] text-[var(--text-dark)] transition-colors duration-200 px-[16px] pb-[40px]">
      <div className="mx-auto w-full max-w-[480px] lg:max-w-none">
        <Navbar />
      </div>
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

        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[var(--text-dark)]">
          How It Works
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.5] text-[var(--text-light)]">
          Build a professional, ATS-optimized resume in minutes. Here&apos;s how to get the best results.
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
            title="Enter Target Job & Description"
            description="Tell us the role you're applying for and paste the job description. This powers ATS keyword scoring, AI suggestions, and ensures your resume matches what recruiters are looking for."
          />
          <StepCard
            number="3"
            title="Upload or Start Fresh"
            description="Upload an existing resume (PDF or DOCX) to auto-fill your details, or start from scratch and fill each section manually. If you come back later, your job title and data are auto-saved."
          />
          <StepCard
            number="4"
            title="Fill Your Details Thoroughly"
            description="Write detailed, descriptive bullet points for experience, projects, and skills. The more context you provide, the better the AI enhancement. Include what you did, tools used, and measurable results."
          />
          <StepCard
            number="5"
            title="Track Your ATS Score"
            description="Watch the Resume Lab ATS Score update live as you type. It shows category breakdowns, strengths, missing keywords, and high-priority fixes. Tap 'Improve Score' to see detailed recommendations."
          />
          <StepCard
            number="6"
            title="Apply Missing Keywords"
            description="The ATS panel shows missing keywords from the job description. Tap individual keywords to add them one by one, or use 'Auto-Apply Missing Keywords' to add all skill-type keywords to your Skills section instantly."
          />
          <StepCard
            number="7"
            title="Enhance with AI"
            description="Tap Enhance All to rewrite your bullet points and descriptions — concise, impactful, and ATS-optimized. Each bullet gets a strong action verb while preserving your original meaning. You can undo any AI change within a few seconds."
          />
          <StepCard
            number="8"
            title="Download & Save"
            description="Sign in and download your polished resume as PDF or DOCX. Your resume is automatically saved to 'My Resumes' for future access and re-download."
          />
        </div>

        {/* ATS Score Section */}
        <div className="mt-[32px] rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[20px] shadow-[var(--shadow-sm)]">
          <h2 className="text-[18px] font-bold text-[var(--text-dark)]">Resume Lab ATS Score</h2>
          <p className="mt-[10px] text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Our built-in ATS scoring engine rates your resume from 0-100 based on 7 categories:
          </p>
          <ul className="mt-[12px] flex flex-col gap-[8px] text-[13px] leading-[1.6] text-[var(--text-mid)]">
            <li className="flex justify-between"><span>Job Description Match</span><span className="font-bold text-[#6C63FF]">40 pts</span></li>
            <li className="flex justify-between"><span>Resume Completeness</span><span className="font-bold text-[#6C63FF]">15 pts</span></li>
            <li className="flex justify-between"><span>Experience Quality</span><span className="font-bold text-[#6C63FF]">10 pts</span></li>
            <li className="flex justify-between"><span>Projects Quality</span><span className="font-bold text-[#6C63FF]">10 pts</span></li>
            <li className="flex justify-between"><span>Skills Quality</span><span className="font-bold text-[#6C63FF]">10 pts</span></li>
            <li className="flex justify-between"><span>Contact Information</span><span className="font-bold text-[#6C63FF]">5 pts</span></li>
            <li className="flex justify-between"><span>Content Structure</span><span className="font-bold text-[#6C63FF]">10 pts</span></li>
          </ul>
          <p className="mt-[12px] text-[12px] leading-[1.5] text-[var(--text-light)]">
            This score estimates alignment with the provided job description and common ATS best practices. Different employers and ATS platforms may evaluate resumes differently.
          </p>
        </div>

        {/* Tips Section */}
        <div className="mt-[20px] rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[20px] shadow-[var(--shadow-sm)]">
          <h2 className="text-[18px] font-bold text-[var(--text-dark)]">Tips for Best Results</h2>
          <ul className="mt-[14px] flex flex-col gap-[12px] text-[14px] leading-[1.6] text-[var(--text-mid)]">
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Always paste the job description — it unlocks keyword matching and can boost your score by 40 points</span>
            </li>
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
              <span>Use the &quot;✨ Fix&quot; button on individual bullets that have suggestions — it fixes specific issues like missing action verbs or weak phrasing</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Tap any missing keyword chip with &quot;+&quot; to add it individually, or use Auto-Apply for bulk addition</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Gray keywords in the missing list are domain terms — mention them in your summary or experience bullets instead of skills</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Use Enhance All after filling all fields, not in between — it works on everything at once</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>All AI actions have an undo button that appears for a few seconds — tap it if you prefer the original</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Red dots on section tabs show which sections still need attention before downloading</span>
            </li>
          </ul>
        </div>

        {/* What is ATS */}
        <div className="mt-[20px] rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[20px] shadow-[var(--shadow-sm)]">
          <h2 className="text-[18px] font-bold text-[var(--text-dark)]">What is ATS?</h2>
          <p className="mt-[10px] text-[14px] leading-[1.7] text-[var(--text-mid)]">
            ATS (Applicant Tracking System) is software that companies use to filter resumes before a human ever reads them. Over 90% of large companies use ATS to scan, rank, and shortlist candidates. If your resume isn&apos;t formatted correctly or lacks the right keywords, it gets rejected automatically — no matter how qualified you are. Our templates are specifically built to pass these scans with clean formatting, proper headings, and parseable text.
          </p>
        </div>

        {/* Quick Info */}
        <div className="mt-[20px] rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[20px] shadow-[var(--shadow-sm)]">
          <h2 className="text-[18px] font-bold text-[var(--text-dark)]">Quick Info</h2>
          <ul className="mt-[14px] flex flex-col gap-[10px] text-[14px] leading-[1.6] text-[var(--text-mid)]">
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>ATS scoring, AI enhancement, and AI suggestions are available for all users</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Sign-in (Google recommended) is required only for downloading</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>First download is free — unlimited downloads for ₹19</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Your data auto-saves as you type — come back anytime to continue editing</span>
            </li>
            <li className="flex gap-[10px]">
              <span className="mt-[2px] text-[#6C63FF]">●</span>
              <span>Downloaded resumes are saved in &quot;My Resumes&quot; for re-download anytime</span>
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
    <div className="flex gap-[14px] rounded-[16px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[16px] shadow-[var(--shadow-sm)]">
      <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[14px] font-bold text-white">
        {number}
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-[var(--text-dark)]">{title}</h3>
        <p className="mt-[6px] text-[13px] leading-[1.6] text-[var(--text-mid)]">{description}</p>
      </div>
    </div>
  );
}
