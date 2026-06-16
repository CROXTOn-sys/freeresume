'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

const templateMeta = {
  '1': {
    image: '/images/template1.png',
    title: 'Why choose this template?',
    features: [
      {
        title: 'Modern Design',
        description:
          'Designed with a modern structure for better visual presentation.',
        icon: <path d="M9.2 16.2 4.9 12l1.4-1.4 2.9 2.9 8.6-8.6 1.4 1.4-10 9.9Z" />,
      },
      {
        title: 'Recruiter Preferred',
        description:
          'Designed using layouts preferred by hiring professionals.',
        icon: <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.7 0-8 1.4-8 4v2h11v-2c0-1.1.3-2.1.8-2.9C10.1 13.4 9.1 13 8 13Zm8 0c-.8 0-1.6.1-2.4.3.8.9 1.4 2 1.4 3.2v2H24v-2c0-2.6-5.3-4-8-4Z" />,
      },
      {
        title: 'Professional Design',
        description: 'Clean structure with modern spacing and typography.',
        icon: <path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h8v2H8V9Zm0 4h5v2H8v-2Z" />,
      },
      {
        title: 'Multi-purpose Template',
        description: 'Suitable for freshers, students and experienced professionals.',
        icon: <path d="M6 4h9l5 5v11H6V4Zm8 1.5V9h3.5L14 5.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z" />,
      },
    ],
  },
  '2': {
    image: '/images/template2.png',
    title: 'Why choose this template?',
    features: [
      {
        title: 'ATS Friendly',
        description:
          'Optimized for Applicant Tracking Systems and improves resume readability.',
        icon: <path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h8v2H8V9Zm0 4h5v2H8v-2Z" />,
      },
      {
        title: 'HR preferred',
        description:
          'Easy for recruiters and hiring managers to review quickly.',
        icon: <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.7 0-8 1.4-8 4v2h11v-2c0-1.1.3-2.1.8-2.9C10.1 13.4 9.1 13 8 13Zm8 0c-.8 0-1.6.1-2.4.3.8.9 1.4 2 1.4 3.2v2H24v-2c0-2.6-5.3-4-8-4Z" />,
      },
      {
        title: 'Clean Sections',
        description:
          'Well-organized sections for better readability.',
        icon: <path d="M6 4h9l5 5v11H6V4Zm8 1.5V9h3.5L14 5.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z" />,
      },
      {
        title: 'Career Focused',
        description:
          'Suitable for students, freshers and professionals.',
        icon: <path d="M9.2 16.2 4.9 12l1.4-1.4 2.9 2.9 8.6-8.6 1.4 1.4-10 9.9Z" />,
      },
    ],
  },
};

function FeatureCard({ title, description, icon }) {
  return (
    <div className="rounded-[14px] border border-[color:#e5e7eb] bg-white p-[14px] shadow-[0_8px_22px_rgba(17,24,39,0.05)]">
      <div className="flex items-start gap-[12px]">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#f3f0ff,#e8e4ff)] text-[var(--purple)]">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
            {icon}
          </svg>
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-black">{title}</h3>
          <p className="mt-[4px] text-[12.5px] leading-[1.5] text-[#666666]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TemplateDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || '1';
  const template = templateMeta[templateId] || templateMeta['1'];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] text-black [scroll-behavior:smooth]">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Close"
        className="fixed right-[16px] top-[16px] z-[50] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(17,24,39,0.12)] transition-transform duration-200 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-black stroke-[2.4]">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-[18px] px-[16px] pb-[96px] pt-[18px]">
        <section className="flex justify-center pt-[38px]">
          <div className="w-[90%] max-w-[720px]">
            <div className="overflow-hidden rounded-[18px] bg-white p-[14px] shadow-[0_16px_40px_rgba(17,24,39,0.08)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]">
              <div className="relative h-[40vh] min-h-[280px] w-full">
                <Image
                  src={template.image}
                  alt="Resume template preview"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 720px"
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-[4px]">
          <h1 className="text-[22px] font-bold tracking-[-0.02em] text-black">
            {template.title}
          </h1>

          <div className="mt-[16px] grid gap-[12px]">
            {template.features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[40] border-t border-[color:rgba(230,228,255,0.9)] bg-[rgba(255,255,255,0.82)] px-[16px] py-[12px] backdrop-blur-[16px]">
        <div className="mx-auto flex w-full max-w-[920px] justify-center">
          <button
            type="button"
            className="h-[56px] w-[90%] max-w-[720px] rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(108,99,255,0.24)] transition-transform duration-200 active:scale-[0.98]"
          >
            Create Resume
          </button>
        </div>
      </div>
    </main>
  );
}
