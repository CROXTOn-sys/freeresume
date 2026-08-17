'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { rolesList, getKeywordsForRole } from '../../lib/ats-keywords-data';
import { normalizeText, splitKeywords, formatKeyword } from '../../lib/ats-score';

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
        className="h-[48px] w-full rounded-[14px] border border-[#e5e7eb] bg-white px-[16px] text-[14px] text-black outline-none focus:border-[#6C63FF]"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-[52px] z-[100] max-h-[180px] overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.1)]">
          {filtered.slice(0, 10).map((role) => (
            <button
              key={role}
              type="button"
              onMouseDown={() => { onChange(role); setOpen(false); }}
              className="flex w-full items-center px-[14px] py-[10px] text-left text-[13px] text-black hover:bg-[rgba(108,99,255,0.06)] transition-colors"
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

  let keywords = [];
  if (jobDescription.trim()) {
    keywords = splitKeywords(jobDescription);
  } else if (jobTitle.trim()) {
    keywords = getKeywordsForRole(jobTitle) || [];
  }

  if (!keywords.length) return { score: 0, matched: [], missing: [], total: 0 };

  const resumeNorm = normalizeText(resumeText);
  const matched = [];
  const missing = [];

  // Synonym groups for better matching (same as the resume builder engine)
  const SYNONYM_GROUPS = [
    ['react', 'reactjs', 'react.js'],
    ['javascript', 'js'],
    ['typescript', 'ts'],
    ['node', 'nodejs', 'node.js'],
    ['next', 'nextjs', 'next.js'],
    ['vue', 'vuejs', 'vue.js'],
    ['angular', 'angularjs'],
    ['express', 'expressjs', 'express.js'],
    ['postgres', 'postgresql', 'psql'],
    ['mongo', 'mongodb'],
    ['artificial intelligence', 'ai'],
    ['machine learning', 'ml'],
    ['deep learning', 'dl'],
    ['natural language processing', 'nlp'],
    ['computer vision', 'cv'],
    ['amazon web services', 'aws'],
    ['google cloud platform', 'gcp', 'google cloud'],
    ['microsoft azure', 'azure'],
    ['kubernetes', 'k8s'],
    ['continuous integration', 'ci'],
    ['continuous deployment', 'cd'],
    ['ci/cd', 'ci cd', 'cicd'],
    ['docker', 'containerization'],
    ['rest', 'restful', 'rest api', 'restful api'],
    ['graphql', 'graph ql'],
    ['tensorflow', 'tf'],
    ['pytorch', 'torch'],
    ['scikit-learn', 'sklearn', 'scikit learn'],
    ['pandas', 'pd'],
    ['numpy', 'np'],
    ['dotnet', '.net', 'asp.net'],
    ['csharp', 'c#', 'c sharp'],
    ['cpp', 'c++'],
    ['golang', 'go'],
    ['ruby on rails', 'rails', 'ror'],
    ['spring boot', 'springboot', 'spring'],
    ['tailwind', 'tailwindcss', 'tailwind css'],
    ['sass', 'scss'],
    ['mysql', 'my sql'],
    ['redis', 'redis cache'],
    ['elasticsearch', 'elastic search', 'es'],
    ['rabbitmq', 'rabbit mq'],
    ['apache kafka', 'kafka'],
    ['power bi', 'powerbi'],
    ['user experience', 'ux'],
    ['user interface', 'ui'],
    ['microservices', 'micro services'],
    ['serverless', 'lambda', 'cloud functions'],
    ['infrastructure as code', 'iac', 'terraform'],
    ['object oriented', 'oop', 'object-oriented'],
    ['test driven development', 'tdd'],
    ['behavior driven development', 'bdd'],
    ['agile', 'scrum', 'kanban'],
    ['devops', 'dev ops'],
    ['mlops', 'ml ops'],
    ['data warehouse', 'dwh', 'data warehousing'],
    ['etl', 'extract transform load'],
    ['business intelligence', 'bi'],
    ['version control', 'git', 'github', 'gitlab', 'bitbucket'],
    ['solid principles', 'solid'],
    ['design patterns', 'design pattern'],
    ['data structures', 'data structure'],
    ['algorithms', 'algorithm'],
    ['message queues', 'message queue', 'rabbitmq', 'kafka', 'sqs'],
    ['caching', 'cache', 'redis cache', 'memcached'],
    ['clean code', 'clean architecture'],
    ['code review', 'code reviews', 'peer review'],
    ['linux', 'unix', 'ubuntu', 'centos', 'debian'],
    ['nginx', 'apache'],
    ['embedded c', 'embedded-c'],
    ['rtos', 'freertos', 'real-time operating system'],
    ['pcb design', 'pcb layout'],
    ['emi/emc', 'emi', 'emc', 'electromagnetic interference', 'electromagnetic compatibility'],
    ['dfm', 'design for manufacturing'],
    ['dft', 'design for testability'],
    ['bom', 'bill of materials'],
    ['pid controller', 'pid control', 'pid'],
    ['plc', 'programmable logic controller'],
    ['scada', 'supervisory control'],
    ['hvac', 'heating ventilation air conditioning'],
    ['fea', 'finite element analysis'],
    ['cad', 'solidworks', 'autocad', 'catia', 'creo'],
    ['six sigma', '6 sigma', 'dmaic'],
    ['lean manufacturing', 'lean'],
    ['oee', 'overall equipment effectiveness'],
    ['tpm', 'total productive maintenance'],
    ['rcm', 'reliability-centered maintenance'],
    ['mtbf', 'mean time between failures'],
    ['mttr', 'mean time to repair'],
    ['bms', 'battery management system'],
    ['soc', 'state of charge'],
    ['soh', 'state of health'],
    ['can', 'can bus', 'can protocol'],
    ['autosar', 'autosar classic', 'autosar adaptive'],
    ['iso 26262', 'functional safety'],
    ['spc', 'statistical process control'],
    ['cmp', 'chemical-mechanical planarization'],
    ['feol', 'front-end-of-line'],
    ['beol', 'back-end-of-line'],
    ['vrf', 'variable refrigerant flow'],
    ['etp', 'effluent treatment plant'],
    ['stp', 'sewage treatment plant'],
    ['eia', 'environmental impact assessment'],
    ['cpm', 'critical path method'],
    ['gis', 'geographic information system', 'arcgis', 'qgis'],
    ['fsi', 'far', 'floor space index', 'floor area ratio'],
    ['tod', 'transit-oriented development'],
    ['cbr', 'california bearing ratio'],
    ['spt', 'standard penetration test'],
  ];

  // Build synonym lookup
  const synonymLookup = new Map();
  for (const group of SYNONYM_GROUPS) {
    const normalized = group.map((t) => normalizeText(t));
    for (const term of normalized) {
      if (!synonymLookup.has(term)) synonymLookup.set(term, new Set());
      for (const syn of normalized) {
        if (syn !== term) synonymLookup.get(term).add(syn);
      }
    }
  }

  const hasSynonymMatch = (haystack, term) => {
    if (haystack.includes(term)) return true;
    const syns = synonymLookup.get(term);
    if (syns) {
      for (const syn of syns) {
        if (haystack.includes(syn)) return true;
      }
    }
    return false;
  };

  keywords.forEach((kw) => {
    const kwNorm = normalizeText(kw);
    if (kwNorm && hasSynonymMatch(resumeNorm, kwNorm)) {
      matched.push(kw);
    } else if (kwNorm) {
      missing.push(kw);
    }
  });

  const total = matched.length + missing.length;
  const score = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return { score, matched, missing, total };
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
    <main className="min-h-screen bg-[#fafafa]">
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
          <div className="animate-[fadeIn_0.2s] rounded-[18px] border border-[#eceef2] bg-white p-[24px] shadow-[0_8px_24px_rgba(17,24,39,0.06)] text-center">
            <div className="mx-auto mb-[16px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[rgba(108,99,255,0.08)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/>
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-black">Upload Your Resume</h2>
            <p className="mt-[6px] text-[13px] text-[#8b94a7]">PDF or DOCX — we'll extract the text and check it against ATS keywords.</p>
            <label className="mt-[20px] inline-flex cursor-pointer items-center gap-[8px] rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[24px] py-[14px] text-[14px] font-bold text-white transition-opacity hover:opacity-90">
              {uploading ? 'Extracting...' : 'Choose File'}
              <input type="file" accept=".pdf,.docx" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            {fileName && <p className="mt-[10px] text-[12px] text-[#8b94a7]">{fileName}</p>}
          </div>
        )}

        {/* Step 1: Select Role / Paste JD */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.2s] rounded-[18px] border border-[#eceef2] bg-white p-[24px] shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
            <h2 className="text-[18px] font-bold text-black">What role are you targeting?</h2>
            <p className="mt-[4px] text-[13px] text-[#8b94a7]">Select a role or paste a job description for comparison.</p>
            <div className="mt-[16px] grid gap-[12px]">
              <label className="block">
                <span className="mb-[6px] block text-[12px] font-semibold text-black">Job Title <span className="text-red-500">*</span></span>
                <RoleDropdown value={jobTitle} onChange={setJobTitle} />
              </label>
              <label className="block">
                <span className="mb-[6px] block text-[12px] font-semibold text-black">Job Description <span className="text-[#8b94a7] font-normal">(optional)</span></span>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a job description for more accurate scoring, or leave blank to use role keywords..."
                  rows={5}
                  className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[14px] py-[12px] text-[14px] text-black outline-none focus:border-[#6C63FF]"
                />
              </label>
            </div>
            <div className="mt-[18px] flex gap-[10px]">
              <button type="button" onClick={handleReset} className="h-[48px] flex-1 rounded-[14px] border border-[#e5e7eb] bg-white text-[14px] font-bold text-black">Back</button>
              <button type="button" onClick={handleCheck} disabled={!jobTitle.trim()} className="h-[48px] flex-1 rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-[14px] font-bold text-white disabled:opacity-50">Check Score</button>
            </div>
          </div>
        )}

        {/* Step 2: Result */}
        {step === 2 && result && (
          <div className="animate-[fadeIn_0.2s]">
            {/* Grade display */}
            <div className="rounded-[18px] border border-[#eceef2] bg-white p-[24px] shadow-[0_8px_24px_rgba(17,24,39,0.06)] text-center">
              {(() => {
                const count = result.matched.length;
                let grade, gradeColor, gradeEmoji, gradeDesc;
                if (count >= 20) { grade = 'Excellent'; gradeColor = '#10b981'; gradeEmoji = '🏆'; gradeDesc = 'Your resume is very well aligned with this role.'; }
                else if (count >= 15) { grade = 'Strong'; gradeColor = '#22c55e'; gradeEmoji = '💪'; gradeDesc = 'Great keyword coverage — you\'re a strong match.'; }
                else if (count >= 10) { grade = 'Good'; gradeColor = '#6C63FF'; gradeEmoji = '👍'; gradeDesc = 'Solid match. A few more keywords could strengthen it.'; }
                else if (count >= 5) { grade = 'Fair'; gradeColor = '#f59e0b'; gradeEmoji = '📝'; gradeDesc = 'You have some relevant keywords. Consider adding more from the missing list.'; }
                else { grade = 'Needs Work'; gradeColor = '#ef4444'; gradeEmoji = '⚠️'; gradeDesc = 'Low keyword match — tailor your resume to include relevant skills for this role.'; }
                return (
                  <>
                    <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full border-[6px]" style={{ borderColor: gradeColor }}>
                      <span className="text-[36px]">{gradeEmoji}</span>
                    </div>
                    <p className="mt-[12px] text-[22px] font-black" style={{ color: gradeColor }}>{grade}</p>
                    <p className="mt-[6px] text-[13px] text-[#555]">{gradeDesc}</p>
                    <p className="mt-[8px] text-[12px] text-[#8b94a7]">
                      {result.matched.length} of {result.total} role keywords found in your resume
                      {!jobDescription.trim() ? '' : ' (based on job description)'}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Matched Keywords */}
            {result.matched.length > 0 && (
              <div className="mt-[16px] rounded-[14px] border border-[#eceef2] bg-white p-[16px]">
                <h3 className="text-[13px] font-bold text-[#10b981]">✓ Matched Keywords ({result.matched.length})</h3>
                <div className="mt-[10px] flex flex-wrap gap-[6px]">
                  {result.matched.map((kw, i) => (
                    <span key={i} className="rounded-full bg-[rgba(16,185,129,0.08)] px-[10px] py-[4px] text-[11px] font-medium text-[#10b981]">{formatKeyword(kw)}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missing.length > 0 && (
              <div className="mt-[12px] rounded-[14px] border border-[#eceef2] bg-white p-[16px]">
                <h3 className="text-[13px] font-bold text-[#ef4444]">✗ Suggested Keywords ({result.missing.length})</h3>
                <p className="mt-[4px] text-[11px] text-[#8b94a7]">Include the ones relevant to your experience to improve ATS matching</p>
                <div className="mt-[10px] flex flex-wrap gap-[6px]">
                  {result.missing.map((kw, i) => (
                    <span key={i} className="rounded-full bg-[rgba(239,68,68,0.08)] px-[10px] py-[4px] text-[11px] font-medium text-[#ef4444]">{formatKeyword(kw)}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-[20px] flex gap-[10px]">
              <button type="button" onClick={handleReset} className="h-[48px] flex-1 rounded-[14px] border border-[#e5e7eb] bg-white text-[14px] font-bold text-black">Check Another</button>
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
