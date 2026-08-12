'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RoleCombobox from '../../components/RoleCombobox';

const templateMeta = {
  '1': {
    image: '/images/template1.png',
    title: 'Why choose this template?',
    features: [
      {
        title: 'Modern Design',
        description: 'Designed with a modern structure for better visual presentation.',
        icon: <path d="M9.2 16.2 4.9 12l1.4-1.4 2.9 2.9 8.6-8.6 1.4 1.4-10 9.9Z" />,
      },
      {
        title: 'Recruiter Preferred',
        description: 'Designed using layouts preferred by hiring professionals.',
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
        description: 'Optimized for Applicant Tracking Systems and improves resume readability.',
        icon: <path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h8v2H8V9Zm0 4h5v2H8v-2Z" />,
      },
      {
        title: 'HR preferred',
        description: 'Easy for recruiters and hiring managers to review quickly.',
        icon: <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.7 0-8 1.4-8 4v2h11v-2c0-1.1.3-2.1.8-2.9C10.1 13.4 9.1 13 8 13Zm8 0c-.8 0-1.6.1-2.4.3.8.9 1.4 2 1.4 3.2v2H24v-2c0-2.6-5.3-4-8-4Z" />,
      },
      {
        title: 'Clean Sections',
        description: 'Well-organized sections for better readability.',
        icon: <path d="M6 4h9l5 5v11H6V4Zm8 1.5V9h3.5L14 5.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z" />,
      },
      {
        title: 'Career Focused',
        description: 'Suitable for students, freshers and professionals.',
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
          <p className="mt-[4px] text-[12.5px] leading-[1.5] text-[#666666]">{description}</p>
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
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [importing, setImporting] = useState(false);
  const uploadInputRef = useRef(null);
  const isPopularTemplate = templateId === '1' || templateId === '2';

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const openJobModal = () => {
    // Pre-fill from sessionStorage if available
    try {
      const saved = window.sessionStorage.getItem('ResumeLab-target-job');
      if (saved) {
        const parsed = JSON.parse(saved);
        const title = parsed?.title || parsed?.targetJobTitle || '';
        const desc = parsed?.description || parsed?.targetJobDescription || '';
        if (title.trim()) {
          setTargetJobTitle(title);
          setTargetJobDescription(desc);
        }
      }
    } catch {}
    setShowJobModal(true);
  };

  const closeJobModal = () => {
    setShowJobModal(false);
    setBuildStep(0);
    setTargetJobTitle('');
    setTargetJobDescription('');
  };

  const saveTargetJob = () => {
    try {
      window.sessionStorage.setItem(
        'ResumeLab-target-job',
        JSON.stringify({
          title: targetJobTitle.trim(),
          description: targetJobDescription.trim(),
          targetJobTitle: targetJobTitle.trim(),
          targetJobDescription: targetJobDescription.trim(),
        })
      );
    } catch {
      // ignore storage issues
    }
  };

  const goToBuildOptions = () => {
    if (!targetJobTitle.trim()) return;
    saveTargetJob();
    setBuildStep(1);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import-resume', {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      console.log('[upload] API response status:', response.status);
      console.log('[upload] API payload:', {
        hasData: Boolean(payload.data),
        dataKeys: payload.data ? Object.keys(payload.data) : [],
        rawTextLength: payload.rawText?.length || 0,
        sourceType: payload.sourceType,
        warning: payload.warning,
        error: payload.error,
      });
      if (!response.ok) {
        throw new Error(payload?.details || payload?.error || 'Import failed');
      }

      try {
        window.sessionStorage.setItem(
          'ResumeLab-imported-resume',
          JSON.stringify({
            data: payload.data || {},
            rawText: payload.rawText || '',
            sourceType: payload.sourceType || '',
          })
        );
        if (payload.rawText) {
          window.sessionStorage.setItem('ResumeLab-imported-raw-text', payload.rawText);
        }
      } catch {
        // ignore storage issues
      }

      setShowBuildModal(false);
      setShowJobModal(false);
      setBuildStep(0);
      router.push(`/resume-builder/${templateId === '2' ? 'editor2' : 'editor'}?template=${templateId}`);
    } catch (error) {
      window.alert(error?.message || 'Unable to import resume right now.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] text-black [scroll-behavior:smooth]">
      <input
        ref={uploadInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => router.push('/')}
        aria-label="Close"
        className="fixed right-[16px] top-[16px] z-[50] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(17,24,39,0.12)] transition-transform duration-200 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-black stroke-[2.4]">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-[18px] px-[16px] pb-[96px] pt-[18px] lg:max-w-[1120px] lg:pt-[0px] lg:pb-[40px] lg:min-h-[calc(100vh-40px)] lg:justify-center">
        {/* Desktop: two-column layout, Mobile: stacked */}
        <div className="lg:flex lg:items-start lg:gap-[48px]">
          {/* Left: Resume preview */}
          <section className="flex justify-center pt-[38px] lg:pt-0 lg:sticky lg:top-[24px] lg:w-[55%]">
            <div className="w-[90%] max-w-[720px] lg:w-full">
              <div className="overflow-hidden rounded-[18px] bg-white p-[14px] shadow-[0_16px_40px_rgba(17,24,39,0.08)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]">
                <div className="relative h-[40vh] min-h-[280px] w-full lg:h-[60vh] lg:min-h-[480px] border border-[#d1d5db] rounded-[8px]">
                  <Image
                    src={template.image}
                    alt="Resume template preview"
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 720px, 550px"
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right: Features + CTA */}
          <section className="px-[4px] lg:w-[45%] lg:pt-[38px] lg:px-0">
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-black lg:text-[26px]">{template.title}</h1>
            <div className="mt-[16px] grid gap-[12px]">
              {template.features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
            {/* Desktop CTA button (in addition to the fixed bottom bar) */}
            <div className="hidden lg:block mt-[28px]">
              <button
                type="button"
                onClick={isPopularTemplate ? () => openJobModal() : undefined}
                disabled={!isPopularTemplate}
                className={`h-[56px] w-full rounded-[16px] text-[15px] font-bold shadow-[0_14px_28px_rgba(108,99,255,0.24)] transition-transform duration-200 active:scale-[0.98] ${isPopularTemplate ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white' : 'bg-[#e5e7eb] text-[#aaa] cursor-not-allowed'}`}
              >
                {isPopularTemplate ? 'Create Resume' : 'Coming soon'}
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[40] border-t border-[color:rgba(230,228,255,0.9)] bg-[rgba(255,255,255,0.82)] px-[16px] py-[12px] backdrop-blur-[16px] lg:hidden">
        <div className="mx-auto flex w-full max-w-[920px] justify-center">
          <button
            type="button"
            onClick={isPopularTemplate ? () => openJobModal() : undefined}
            disabled={!isPopularTemplate}
            className={`h-[56px] w-[90%] max-w-[720px] rounded-[16px] text-[15px] font-bold shadow-[0_14px_28px_rgba(108,99,255,0.24)] transition-transform duration-200 active:scale-[0.98] ${isPopularTemplate
              ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white'
              : 'cursor-not-allowed bg-[#e8e9f3] text-[#7b7f8f] shadow-none'
              }`}
          >
            Create Resume
          </button>
        </div>
      </div>

      {showJobModal && isPopularTemplate ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(17,24,39,0.42)] px-[10px] py-[10px] backdrop-blur-[6px] md:items-center">
          <div className="relative w-full max-w-[520px] rounded-[24px] bg-white p-[14px] shadow-[0_24px_60px_rgba(17,24,39,0.24)] md:p-[18px]">
            <button
              type="button"
              aria-label="Close"
              onClick={closeJobModal}
              className="absolute right-[14px] top-[14px] z-[10] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[20px] font-light leading-none text-black shadow-[0_8px_18px_rgba(17,24,39,0.08)]"
            >
              x
            </button>

            <main className="relative z-[1] bg-white px-[4px] py-[8px] text-black">
              <div className="mx-auto flex w-full max-w-[520px] flex-col">
                {buildStep === 0 ? (
                  <>
                    <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">What are you applying for?</h1>
                    <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">Tell us the target role first. We&apos;ll use it for ATS scoring and AI suggestions.</p>
                    <div className="mt-[18px] grid gap-[12px]">
                      <label className="block">
                        <span className="mb-[6px] block text-[12px] font-semibold text-black">Target Job Title <span className="text-red-500">*</span></span>
                        <RoleCombobox value={targetJobTitle} onChange={setTargetJobTitle} />
                      </label>
                      <label className="block">
                        <span className="mb-[6px] block text-[12px] font-semibold text-black">Job Description / ATS Keywords <span className="text-[#8b94a7] font-normal">(optional)</span></span>
                        <textarea
                          value={targetJobDescription}
                          onChange={(e) => setTargetJobDescription(e.target.value)}
                          placeholder="Paste a job description from LinkedIn for best ATS accuracy, or leave blank to use role-based keywords..."
                          rows={6}
                          className="w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] py-[12px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]"
                        />
                      </label>
                    </div>
                    <div className="mt-[18px] flex gap-[10px]">
                      <button type="button" onClick={closeJobModal} className="h-[52px] flex-1 rounded-[16px] border border-[color:#e5e7eb] bg-white text-[15px] font-bold text-black">Cancel</button>
                      <button type="button" onClick={goToBuildOptions} disabled={!targetJobTitle.trim()} className="h-[52px] flex-1 rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white disabled:opacity-50">Next</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">How would you like to build your resume?</h1>
                    <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">Upload an existing one or start fresh - we&apos;ll make it easy either way!</p>
                    <div className="mt-[8px] rounded-[14px] bg-[rgba(95,84,240,0.06)] px-[12px] py-[10px] text-[12px] text-[#4a41c8]">Optimizing for: <span className="font-bold">{targetJobTitle}</span></div>
                    <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={handleUploadClick}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleUploadClick();
                          }
                        }}
                        className={`cursor-pointer rounded-[16px] border border-[color:#222] bg-[rgba(255,255,255,0.92)] p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] ${importing ? 'opacity-60' : ''}`}
                      >
                        <div className="flex justify-center text-[30px] text-[#666]">☁</div>
                        <div className="mt-[10px] text-center">
                          <h2 className="text-[15px] font-bold text-black">{importing ? 'Importing...' : 'Upload resume'}</h2>
                          <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">PDF, DOCX . Max file size: 10 MB</p>
                        </div>
                      </div>
                      <div className="relative rounded-[16px] border border-[color:#d9d9e3] bg-white p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] opacity-60">
                        <div className="absolute top-[10px] right-[10px]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        </div>
                        <div className="flex justify-center text-[34px] font-bold text-[#0a66c2]">in</div>
                        <div className="mt-[10px] text-center">
                          <h2 className="text-[15px] font-bold text-black">Import LinkedIn</h2>
                          <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">Coming soon</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-[14px] rounded-[16px] border border-[color:#d9d9e3] bg-white p-[16px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                      <div className="flex items-center gap-[12px]">
                        <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[18px] font-bold text-white">✦</div>
                        <div>
                          <h2 className="text-[15px] font-bold text-black">AI Enhancement</h2>
                          <p className="mt-[4px] text-[12px] text-[#666]">Enhance your bullet points and descriptions with AI</p>
                        </div>
                        <span className="ml-auto rounded-full bg-[rgba(108,99,255,0.12)] px-[10px] py-[4px] text-[11px] font-bold text-[color:var(--purple)]">Free</span>
                      </div>
                    </div>
                    <div className="my-[18px] flex items-center gap-[12px] text-[#a0a0ad]">
                      <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                      <span className="text-[13px]">or</span>
                      <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                    </div>
                    <Link
                      href={`/resume-builder/${templateId === '2' ? 'editor2' : 'editor'}?template=${templateId}&fresh=true`}
                      onClick={() => {
                        saveTargetJob();
                        closeJobModal();
                      }}
                      className={`flex h-[52px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(108,99,255,0.22)] ${importing ? 'pointer-events-none opacity-60' : ''}`}
                    >
                      + Start from scratch
                    </Link>
                    <button type="button" onClick={closeJobModal} className="mt-[10px] h-[48px] w-full rounded-[16px] border border-[color:#e5e7eb] bg-white text-[14px] font-semibold text-black">Cancel</button>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      ) : null}

      {showBuildModal && isPopularTemplate ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(17,24,39,0.42)] px-[10px] py-[10px] backdrop-blur-[6px] md:items-center">
          <div className="relative w-full max-w-[520px] rounded-[24px] bg-white p-[14px] shadow-[0_24px_60px_rgba(17,24,39,0.24)] md:p-[18px]">
            {importing ? (
              <div className="absolute inset-0 z-[5] flex items-center justify-center rounded-[24px] bg-[rgba(255,255,255,0.75)] backdrop-blur-[8px]">
                <div className="rounded-[18px] border border-[color:#e5e7eb] bg-white px-[18px] py-[16px] shadow-[0_14px_34px_rgba(17,24,39,0.14)]">
                  <div className="flex items-center gap-[12px]">
                    <span className="h-[18px] w-[18px] animate-spin rounded-full border-[2px] border-[color:var(--purple)] border-t-transparent" />
                    <div>
                      <div className="text-[14px] font-bold text-black">Importing resume</div>
                      <div className="text-[12px] text-[#666]">Extracting text and filling fields...</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowBuildModal(false)}
              className="absolute right-[14px] top-[14px] z-[10] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[20px] font-light leading-none text-black shadow-[0_8px_18px_rgba(17,24,39,0.08)]"
            >
              ×
            </button>

            <main className="relative z-[1] bg-white px-[4px] py-[8px] text-black">
              <div className="mx-auto flex w-full max-w-[520px] flex-col">
                <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">
                  How would you like to build your resume?
                </h1>
                <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">
                  Upload an existing one or start fresh - we&apos;ll make it easy either way!
                </p>

                <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleUploadClick}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleUploadClick();
                      }
                    }}
                    className={`cursor-pointer rounded-[16px] border border-[color:#222] bg-[rgba(255,255,255,0.92)] p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] ${importing ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-center text-[30px] text-[#666]">☁</div>
                    <div className="mt-[10px] text-center">
                      <h2 className="text-[15px] font-bold text-black">{importing ? 'Importing...' : 'Upload resume'}</h2>
                      <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">
                        PDF, DOCX . Max file size: 10 MB
                      </p>
                    </div>
                  </div>
                  <div className="relative rounded-[16px] border border-[color:#d9d9e3] bg-white p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] opacity-60">
                    <div className="absolute top-[10px] right-[10px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </div>
                    <div className="flex justify-center text-[34px] font-bold text-[#0a66c2]">in</div>
                    <div className="mt-[10px] text-center">
                      <h2 className="text-[15px] font-bold text-black">Import LinkedIn</h2>
                      <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">Coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="mt-[14px] rounded-[16px] border border-[color:#d9d9e3] bg-white p-[16px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[18px] font-bold text-white">
                      ✦
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-black">AI Enhancement</h2>
                      <p className="mt-[4px] text-[12px] text-[#666]">Enhance your bullet points and descriptions with AI</p>
                    </div>
                    <span className="ml-auto rounded-full bg-[rgba(108,99,255,0.12)] px-[10px] py-[4px] text-[11px] font-bold text-[color:var(--purple)]">
                      Free
                    </span>
                  </div>
                </div>

                <div className="my-[18px] flex items-center gap-[12px] text-[#a0a0ad]">
                  <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                  <span className="text-[13px]">or</span>
                  <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
                </div>

                <Link
                  href={`/resume-builder/${templateId === '2' ? 'editor2' : 'editor'}?template=${templateId}&fresh=true`}
                  onClick={() => setShowBuildModal(false)}
                  className={`flex h-[52px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(108,99,255,0.22)] ${importing ? 'pointer-events-none opacity-60' : ''}`}
                >
                  + Start from scratch
                </Link>
              </div>
            </main>
          </div>
        </div>
      ) : null}
    </main>
  );
}
