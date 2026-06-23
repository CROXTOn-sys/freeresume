'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ChoiceCard({ title, description, children, active = false }) {
  return (
    <div
      className={`rounded-[16px] border p-[18px] shadow-[0_8px_20px_rgba(17,24,39,0.04)] ${
        active ? 'border-[color:#222] bg-[rgba(255,255,255,0.92)]' : 'border-[color:#d9d9e3] bg-white'
      }`}
    >
      {children}
      <div className="mt-[10px] text-center">
        <h2 className="text-[15px] font-bold text-black">{title}</h2>
        <p className="mt-[6px] text-[12px] leading-[1.45] text-[#666]">{description}</p>
      </div>
    </div>
  );
}

function BuilderChoice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template') || '1';
  const [importing, setImporting] = useState(false);

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

      router.push(`/resume-builder/editor?template=${templateId}`);
    } catch (error) {
      window.alert(error?.message || 'Unable to import resume right now.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-[14px] py-[18px] text-black">
      <input
        id="resume-upload-input"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="mx-auto flex w-full max-w-[520px] flex-col">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-black">
          How would you like to build your resume?
        </h1>
        <p className="mt-[8px] text-[15px] leading-[1.45] text-[#7a7a86]">
          Upload an existing one or start fresh - we&apos;ll make it easy either way!
        </p>

        <div className="mt-[22px] grid grid-cols-2 gap-[12px]">
          <div className="relative cursor-pointer text-left">
            <input
              id="resume-upload-input"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="absolute inset-0 z-[2] h-full w-full cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <ChoiceCard
              title={importing ? 'Importing...' : 'Upload resume'}
              description="PDF, DOCX, or image (.png, .jpeg, .jpg)"
              active
            >
              <div className="flex justify-center text-[30px] text-[#666]">☁</div>
            </ChoiceCard>
          </div>
          <ChoiceCard title="Import LinkedIn" description="Auto-fill from profile">
            <div className="flex justify-center text-[34px] font-bold text-[#0a66c2]">in</div>
          </ChoiceCard>
        </div>

        <div className="mt-[14px] rounded-[16px] border border-[color:#d9d9e3] bg-white p-[16px] shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[18px] font-bold text-white">
              ✦
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-black">Create with AI Assistance</h2>
              <p className="mt-[4px] text-[12px] text-[#666]">Speak or type - we&apos;ll build your resume</p>
            </div>
            <span className="ml-auto rounded-full bg-[rgba(108,99,255,0.12)] px-[10px] py-[4px] text-[11px] font-bold text-[color:var(--purple)]">
              New
            </span>
          </div>
        </div>

        <div className="my-[18px] flex items-center gap-[12px] text-[#a0a0ad]">
          <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
          <span className="text-[13px]">or</span>
          <div className="h-[1px] flex-1 bg-[color:#e5e7eb]" />
        </div>

        <Link
          href={`/resume-builder/editor?template=${templateId}`}
          className="flex h-[52px] items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[15px] font-bold text-white shadow-[0_14px_28px_rgba(108,99,255,0.22)]"
        >
          + Start from scratch
        </Link>
      </div>
    </main>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={null}>
      <BuilderChoice />
    </Suspense>
  );
}
