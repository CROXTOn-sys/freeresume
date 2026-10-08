'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { rolesList, getKeywordsForRole } from '../../lib/ats-keywords-data';
import { getAtsGrade, getKeywordMatch, normalizeText, splitKeywords, formatKeyword } from '../../lib/ats-score';

function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(rolesList);

  const handleInput = (v) => {
    onChange(v);
    const q = v.toLowerCase().trim();
    setFiltered(q ? rolesList.filter(r => r.toLowerCase().includes(q)) : rolesList);
    setOpen(true);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="e.g. Data Analyst, DevOps Engineer..."
        className="h-[48px] w-full rounded-[14px] border border-[color:var(--border)] bg-[var(--card-bg)] px-[16px] text-[14px] text-[var(--text-dark)] outline-none focus:border-[#6C63FF]"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-[52px] z-[100] max-h-[180px] overflow-y-auto rounded-[12px] border border-[color:var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-sm)]">
          {filtered.slice(0, 10).map((role) => (
            <button
              key={role}
              type="button"
              onMouseDown={() => { onChange(role); setOpen(false); }}
              className="flex w-full items-center px-[14px] py-[10px] text-left text-[13px] text-[var(--text-dark)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
            >
              {role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function computeAtsCheck(resumeText, jobTitle, jobDescription) {
  if (!resumeText.trim()) return null;

  const usesJobDescription = Boolean(jobDescription.trim());
  const keywords = usesJobDescription
    ? splitKeywords(jobDescription)
    : getKeywordsForRole(jobTitle) || [];
  if (!keywords.length) return { score: 0, matched: [], missing: [] };

  const matched = [];
  const missing = [];

  keywords.forEach((kw) => {
    const match = getKeywordMatch(resumeText, kw);
    if (match) {
      matched.push({ keyword: kw, ...match });
    } else if (normalizeText(kw)) {
      missing.push(kw);
    }
  });

  const jobText = normalizeText(jobDescription);
  const prioritizedMissing = usesJobDescription
    ? missing
      .map((keyword, index) => {
        const term = normalizeText(keyword);
        const occurrences = jobText.split(term).length - 1;
        return { keyword, index, occurrences, words: term.split(' ').length };
      })
      .sort((a, b) => b.occurrences - a.occurrences || b.words - a.words || a.index - b.index)
      .map(({ keyword }) => keyword)
    : missing;
  const total = matched.length + missing.length;
  const score = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return { score, matched, missing: prioritizedMissing };
}

export default function AtsCheckerPage() {
  const [step, setStep] = useState(0); // 0=upload, 1=role, 2=result
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/import-resume', { method: 'POST', body: formData });
      const payload = await res.json().catch(() => ({}));
      const text = payload.rawText || '';
      if (text.trim()) {
        setResumeText(text);
        setStep(1);
      } else {
        alert('Could not extract text from this file. Try a different PDF/DOCX.');
      }
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCheck = () => {
    if (!jobTitle.trim() && !jobDescription.trim()) return;
    const res = computeAtsCheck(resumeText, jobTitle, jobDescription);
    setResult(res);
    setStep(2);
  };

  const handleReset = () => {
    setStep(0);
    setResumeText('');
    setFileName('');
    setJobTitle('');
    setJobDescription('');
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-[var(--page-bg-mid)] pt-[68px] text-[var(--text-dark)] transition-colors duration-200">
      <div className="mx-auto w-full max-w-[480px] lg:max-w-none">
        <Navbar />
      </div>
      {/* Header */}
      <section className="relative bg-[linear-gradient(135deg,#1a1a2e_0%,#2d2b55_100%)] px-[16px] py-[36px] text-center md:py-[48px] xl:py-[56px] 2xl:py-[64px]">
        <Link
          href="/"
          className="absolute right-[16px] top-[16px] flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#b0b0c8] hover:text-white hover:border-[rgba(255,255,255,0.4)] transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>
        <h1 className="text-[24px] font-bold text-white md:text-[32px] xl:text-[36px] 2xl:text-[40px]">ATS Score Checker</h1>
        <p className="mx-auto mt-[8px] max-w-[420px] text-[13px] text-[#b0b0c8] md:text-[15px]">
          Upload your resume and get an instant ATS keyword match score.
        </p>
      </section>

      <div className="mx-auto max-w-[560px] xl:max-w-[640px] 2xl:max-w-[720px] px-[16px] py-[32px]">
        {/* Step 0: Upload */}
        {step === 0 && (
          <div className="animate-[fadeIn_0.2s] rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[24px] shadow-[var(--shadow-sm)] text-center">
            <div className="mx-auto mb-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[rgba(108,99,255,0.08)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/>
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-[var(--text-dark)]">Upload Your Resume</h2>
            <p className="mt-[6px] text-[13px] text-[var(--text-light)]">PDF or DOCX — we'll extract the text and check it against ATS keywords.</p>
            <label className="mt-[20px] inline-flex cursor-pointer items-center gap-[8px] rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[24px] py-[14px] text-[14px] font-bold text-white transition-opacity hover:opacity-90">
              {uploading ? 'Extracting...' : 'Choose File'}
              <input type="file" accept=".pdf,.docx" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            {fileName && <p className="mt-[10px] text-[12px] text-[var(--text-light)]">{fileName}</p>}
          </div>
        )}

        {/* Step 1: Select Role / Paste JD */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.2s] rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[24px] shadow-[var(--shadow-sm)]">
            <h2 className="text-[18px] font-bold text-[var(--text-dark)]">What role are you targeting?</h2>
            <p className="mt-[4px] text-[13px] text-[var(--text-light)]">Select a role or paste a job description for comparison.</p>
            <div className="mt-[16px] grid gap-[12px]">
              <label className="block">
                <span className="mb-[6px] block text-[12px] font-semibold text-[var(--text-dark)]">Job Title <span className="text-red-500">*</span></span>
                <RoleDropdown value={jobTitle} onChange={setJobTitle} />
              </label>
              <label className="block">
                <span className="mb-[6px] block text-[12px] font-semibold text-[var(--text-dark)]">Job Description <span className="text-[var(--text-light)] font-normal">(optional)</span></span>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a job description for more accurate scoring, or leave blank to use role keywords..."
                  rows={5}
                  className="w-full rounded-[12px] border border-[color:var(--border)] bg-[var(--card-bg)] px-[14px] py-[12px] text-[14px] text-[var(--text-dark)] outline-none focus:border-[#6C63FF]"
                />
              </label>
            </div>
            <div className="mt-[18px] flex gap-[10px]">
              <button type="button" onClick={handleReset} className="h-[48px] flex-1 rounded-[14px] border border-[color:var(--border)] bg-[var(--card-bg)] text-[14px] font-bold text-[var(--text-dark)]">Back</button>
              <button type="button" onClick={handleCheck} disabled={!jobTitle.trim()} className="h-[48px] flex-1 rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[14px] font-bold text-white disabled:opacity-50">Check Score</button>
            </div>
          </div>
        )}

        {/* Step 2: Result */}
        {step === 2 && result && (
          <div className="animate-[fadeIn_0.2s]">
            {/* ATS score */}
            <div className="rounded-[18px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[24px] shadow-[var(--shadow-sm)] text-center">
              {(() => {
                const grade = getAtsGrade(result.score);
                const gradeColor = grade === 'Strong' ? '#10b981' : grade === 'Good' ? '#22c55e' : grade === 'Fair' ? '#f59e0b' : '#ef4444';
                const gradeDesc = grade === 'Strong'
                  ? 'Your resume shows strong alignment with this role.'
                  : grade === 'Good'
                    ? 'Your resume is aligned with this role, with a few areas to strengthen.'
                    : grade === 'Fair'
                      ? 'Your resume has some relevant alignment; focused updates can make it clearer.'
                      : 'Your resume may benefit from stronger role alignment. Review the suggestions and focus on experience you can support.';
                return (
                  <>
                    <div className="mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full border-[5px]" style={{ borderColor: gradeColor }}>
                      <span className="text-[18px] font-black" style={{ color: gradeColor }}>ATS</span>
                    </div>
                    <p className="mt-[12px] text-[22px] font-black" style={{ color: gradeColor }}>{grade}</p>
                    <p className="mt-[6px] text-[13px] text-[var(--text-mid)]">{gradeDesc}</p>
                    <p className="mt-[8px] text-[12px] text-[var(--text-light)]">Estimated alignment for {jobTitle}{jobDescription.trim() ? ' and the job description' : ''}.</p>
                  </>
                );
              })()}
            </div>

            {/* Matched Keywords */}
            {result.matched.length > 0 && (
              <div className="mt-[16px] rounded-[14px] border border-[color:var(--border)] bg-[var(--card-bg)] p-[16px]">
                <h3 className="text-[13px] font-bold text-[#059669]">✓ Matched skills and keywords</h3>
                <div className="mt-[10px] grid gap-[8px] sm:grid-cols-2">
                  {result.matched.map(({ keyword, type, matchedTerm, explanation }) => (
                    <div key={keyword} className="rounded-[10px] border border-[rgba(16,185,129,0.16)] bg-[rgba(16,185,129,0.05)] px-[10px] py-[8px]">
                      <div className="flex flex-wrap items-center gap-[6px]">
                        <span className="text-[12px] font-semibold text-[#047857]">{formatKeyword(keyword)}</span>
                        <span className="rounded-full bg-white px-[7px] py-[2px] text-[9px] font-semibold text-[#059669]">
                          {type === 'exact' ? 'Exact match' : type === 'synonym' ? `Equivalent: ${formatKeyword(matchedTerm)}` : `Related: ${formatKeyword(matchedTerm)}`}
                        </span>
                      </div>
                      <p className="mt-[4px] text-[10px] leading-[1.4] text-[var(--text-mid)]">{explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missing.length > 0 && (
              <div className="mt-[12px] rounded-[14px] border border-[rgba(16,185,129,0.2)] bg-[var(--card-bg)] p-[16px]">
                <h3 className="text-[13px] font-bold text-[#059669]">Priority suggestions</h3>
                <p className="mt-[4px] text-[11px] text-[var(--text-light)]">{jobDescription.trim() ? 'Prioritized by prominence in the job description. Start with the most relevant suggestions.' : 'Prioritized from the selected role’s keyword list. Start with the most relevant suggestions.'}</p>
                <div className="mt-[10px] flex flex-wrap gap-[6px]">
                  {result.missing.slice(0, 8).map((kw, i) => (
                    <span key={kw} className={`rounded-full border px-[10px] py-[5px] text-[11px] font-medium ${i < 3 ? 'border-[rgba(16,185,129,0.24)] bg-[rgba(16,185,129,0.10)] text-[#047857]' : 'border-[rgba(16,185,129,0.14)] bg-[rgba(16,185,129,0.05)] text-[#059669]'}`}>
                      {i < 3 ? 'Priority · ' : ''}{formatKeyword(kw)}
                    </span>
                  ))}
                </div>
                <p className="mt-[14px] rounded-[10px] border border-[color:var(--border)] bg-[var(--page-bg-mid)] px-[12px] py-[10px] text-[12px] font-semibold leading-[1.5] text-black">
                  “Add a suggested skill only if it genuinely reflects your experience. You can demonstrate it in your skills, projects, or work history.”
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-[20px] flex gap-[10px]">
              <button type="button" onClick={handleReset} className="h-[48px] flex-1 rounded-[14px] border border-[color:var(--border)] bg-[var(--card-bg)] text-[14px] font-bold text-[var(--text-dark)]">Check Another</button>
              <Link href="/?action=templates" className="flex h-[48px] flex-1 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[14px] font-bold text-white">
                Build Resume →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
