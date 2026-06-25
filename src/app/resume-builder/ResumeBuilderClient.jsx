'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Template1Preview from '../../components/template-previews/Template1Preview';

const steps = ['Personal Information', 'Summary', 'Skills', 'Experience', 'Projects', 'Certifications', 'Education'];
const makeId = () => Date.now() + Math.random();

const initialData = {
  personal: { fullName: '', professionalTitle: '', phoneNumber: '', emailAddress: '', linkedInUrl: '' },
  summary: '',
  skills: [{ id: makeId(), category: '', items: [''] }],
  experience: [{ id: makeId(), companyName: '', role: '', startDate: '', endDate: '', bullets: [''] }],
  projects: [{ id: makeId(), projectName: '', technologiesUsed: '', bullets: [''], links: [] }],
  certifications: [{ id: makeId(), certificationName: '', issuer: '' }],
  education: [{ id: makeId(), degree: '', institution: '', graduationYear: '', gpa: '' }],
};

const skillSuggestions = [
  'Communication',
  'Problem-Solving',
  'Teamwork',
  'Adaptability',
  'Time Management',
  'Critical Thinking',
  'Data Analysis',
  'Project Management',
  'Customer Service',
  'Microsoft Office Suite',
];

const slideTips = [
  {
    title: 'PRO TIP',
    text: 'Keep your name and title consistent across your resume, LinkedIn, and portfolio.',
  },
  {
    title: 'PRO TIP',
    text: 'A short summary should show value fast: who you are, what you do, and what you bring.',
  },
  {
    title: 'PRO TIP',
    text: 'Use a mix of core skills and role-specific skills so recruiters can spot your fit quickly.',
  },
  {
    title: 'PRO TIP',
    text: 'Start each bullet with a strong action and keep the achievement clear and measurable.',
  },
  {
    title: 'PRO TIP',
    text: 'Projects look stronger when you mention the problem, the tools, and the result.',
  },
  {
    title: 'PRO TIP',
    text: 'Certifications are best when the issuer and exact credential name are written clearly.',
  },
  {
    title: 'PRO TIP',
    text: 'Education reads better when the degree, institution, and year stay concise and consistent.',
  },
];

const Input = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label className="block">
    <span className="mb-[6px] block text-[12px] font-semibold text-black">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[44px] w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]"
    />
  </label>
);

const TextArea = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={6}
    className="w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] py-[12px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]"
  />
);

const Card = ({ title, description, children }) => (
  <section className="rounded-[22px] border border-[color:rgba(229,231,235,0.95)] bg-white p-[14px] shadow-[0_10px_26px_rgba(17,24,39,0.06)] md:p-[16px]">
    <h2 className="text-[18px] font-bold tracking-[-0.02em] text-black">{title}</h2>
    {description ? <p className="mt-[4px] text-[12.5px] leading-[1.5] text-[#666]">{description}</p> : null}
    <div className="mt-[14px]">{children}</div>
  </section>
);

const addItem = (list, item) => [...list, item];
const updateItem = (list, index, updater) => list.map((item, i) => (i === index ? updater(item) : item));
const removeItem = (list, index) => list.filter((_, i) => i !== index);

function parseImportedRawText(rawText = '') {
  const empty = initialData;
  const text = String(rawText || '').trim();
  if (!text) return empty;

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-•\u2022]\s*/, '').trim())
    .filter(Boolean);
  if (!lines.length) return empty;

  const joined = lines.join(' ');
  const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const phone = joined.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0] || '';
  const linkedin = joined.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s)]+/i)?.[0] || '';
  const name = lines[0] || '';
  const title = lines.find((line) => /(engineer|developer|analyst|manager|designer|student|automation|data|software|web|intern|associate)/i.test(line)) || lines[1] || '';

  const sectionRange = (startPatterns) => {
    const start = lines.findIndex((line) => startPatterns.some((pattern) => pattern.test(line)));
    if (start === -1) return [];
    const end = lines.findIndex((line, index) => index > start && /^(skills|experience|projects|certifications|education|summary|professional summary|profile|objective|about)$/i.test(line));
    return lines.slice(start + 1, end === -1 ? lines.length : end);
  };

  const summaryBlock = sectionRange([/^(summary|professional summary|profile|objective|about)$/i]);
  const skillBlock = sectionRange([/^(skills|technical skills|core competencies|competencies|technical expertise)$/i]);
  const experienceBlock = sectionRange([/^(experience|work experience|professional experience|employment history|internship)$/i]);
  const projectBlock = sectionRange([/^(projects|project experience|academic projects)$/i]);
  const certificationBlock = sectionRange([/^(certifications|certificates|awards & certifications|awards)$/i]);
  const educationBlock = sectionRange([/^(education|academic details|qualifications)$/i]);

  const splitTokens = (value) =>
    String(value || '')
      .split(/,|;|\||\/|-/)
      .map((part) => part.trim())
      .filter(Boolean);

  const skills = Array.from(new Set(splitTokens(skillBlock.join(' ')).concat(splitTokens(joined).filter((item) => /(sql|python|excel|power bi|tableau|communication|critical thinking|teamwork|adaptability|project management|data analysis|javascript|typescript|react|node|next\.?js|vercel|automation|n8n)/i.test(item)))));

  const experience = experienceBlock.length
    ? [
        {
          id: makeId(),
          companyName: experienceBlock.find((line) => /(technologies|solutions|company|ltd|inc|studio|school|college|institution)/i.test(line)) || '',
          role: experienceBlock.find((line) => /(engineer|developer|analyst|manager|intern|associate|specialist|lead)/i.test(line)) || '',
          startDate: joined.match(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}|\b\d{4}\s*[-–—]\s*(?:present|current|\d{4})\b)/i)?.[0] || '',
          endDate: '',
          bullets: experienceBlock.filter((line) => !/^(experience|work experience|professional experience|employment history|internship)$/i.test(line)).slice(0, 4),
        },
      ]
    : [];

  const projects = projectBlock.length
    ? [
        {
          id: makeId(),
          projectName: projectBlock[0] || '',
          technologiesUsed: projectBlock.find((line) => /(sql|python|react|next\.?js|node\.?js|vercel|n8n|javascript|typescript|excel|power bi|tableau|aws)/i.test(line)) || '',
          bullets: projectBlock.slice(1, 5),
        },
      ]
    : [];

  const certifications = certificationBlock
    .filter((line) => /(certification|certificate|hackathon|workshop|msme|ieee|vbrit|course|credential)/i.test(line))
    .map((line) => ({
      id: makeId(),
      certificationName: line,
      issuer: '',
    }));

  const education = educationBlock.length
    ? [
        {
          id: makeId(),
          degree: educationBlock.find((line) => /(ece|b\.?tech|b\.?sc|m\.?tech|m\.?sc|diploma|engineering)/i.test(line)) || educationBlock[0] || '',
          institution: educationBlock.find((line) => /(college|university|institute|institution|campus|school)/i.test(line)) || educationBlock[1] || '',
          graduationYear: joined.match(/\b(19|20)\d{2}\b/)?.[0] || '',
          gpa: joined.match(/\b\d(?:\.\d+)?\s*\/\s*\d(?:\.\d+)?\b|\b\d\.\d+\b/)?.[0] || '',
        },
      ]
    : [];

  return {
    personal: {
      fullName: name,
      professionalTitle: title,
      phoneNumber: phone,
      emailAddress: email,
      linkedInUrl: linkedin,
    },
    summary: summaryBlock.slice(0, 4).join(' ') || lines.slice(1, 5).join(' '),
    skills: skills.length ? [{ id: makeId(), category: 'Skills', items: skills.slice(0, 24) }] : empty.skills,
    experience: experience.length ? experience : empty.experience,
    projects: projects.length ? projects : empty.projects,
    certifications: certifications.length ? certifications : empty.certifications,
    education: education.length ? education : empty.education,
  };
}

export default function ResumeBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || '1';
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState('form');
  const [data, setData] = useState(initialData);
  const [enhancing, setEnhancing] = useState({});
  const [isImported, setIsImported] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const stepRailRef = useRef(null);
  const stepButtonRefs = useRef([]);

  useEffect(() => {
    stepButtonRefs.current[step]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [step]);

  useEffect(() => {
    try {
      // Check if this is a fresh start via URL param
      const isFreshStart = searchParams.get('fresh') === 'true';
      // Also check the sessionStorage flag (backup)
      const freshFlag = window.sessionStorage.getItem('ResumeLab-fresh-start');

      if (isFreshStart || freshFlag) {
        window.sessionStorage.removeItem('ResumeLab-fresh-start');
        window.sessionStorage.removeItem('ResumeLab-editor-state');
        window.sessionStorage.removeItem('ResumeLab-imported-resume');
        window.sessionStorage.removeItem('ResumeLab-imported-raw-text');
        setData(initialData);
        return; // Keep initialData, don't load anything
      }

      // First check if there's a new import waiting
      const imported = window.sessionStorage.getItem('ResumeLab-imported-resume');
      if (imported) {
        const rawTextStored = window.sessionStorage.getItem('ResumeLab-imported-raw-text') || '';
        const parsed = JSON.parse(imported);
        console.log('[resume-builder] imported resume payload', {
          personal: parsed?.personal,
          summaryLength: parsed?.summary?.length || 0,
          skillsCount: parsed?.skills?.length || 0,
          experienceCount: parsed?.experience?.length || 0,
          projectsCount: parsed?.projects?.length || 0,
          certificationsCount: parsed?.certifications?.length || 0,
          educationCount: parsed?.education?.length || 0,
          rawTextLength: typeof parsed?.rawText === 'string' ? parsed.rawText.length : 0,
          rawTextStoredLength: rawTextStored.length,
        });
        if (parsed && typeof parsed === 'object') {
          const importedData = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
          const rawText = typeof parsed.rawText === 'string' && parsed.rawText.trim()
            ? parsed.rawText
            : rawTextStored;
          const fallbackParsed = rawText ? parseImportedRawText(rawText) : initialData;
          const hasStructuredContent = importedData && Object.values(importedData).some((value) => {
            if (typeof value === 'string') return value.trim();
            if (Array.isArray(value)) return value.length > 0;
            if (value && typeof value === 'object') return Object.values(value).some(Boolean);
            return false;
          });
          const source = hasStructuredContent ? importedData : fallbackParsed;
          const pickText = (incoming, currentValue) => (typeof incoming === 'string' && incoming.trim() ? incoming : currentValue);
          const pickArray = (incoming, currentValue) => (Array.isArray(incoming) && incoming.length ? incoming : currentValue);
          setData((current) => ({
            ...current,
            ...source,
            personal: {
              ...current.personal,
              ...(source.personal || {}),
              fullName: pickText(source.personal?.fullName, current.personal.fullName),
              professionalTitle: pickText(source.personal?.professionalTitle, current.personal.professionalTitle),
              phoneNumber: pickText(source.personal?.phoneNumber, current.personal.phoneNumber),
              emailAddress: pickText(source.personal?.emailAddress, current.personal.emailAddress),
              linkedInUrl: pickText(source.personal?.linkedInUrl, current.personal.linkedInUrl),
            },
            summary: pickText(source.summary, current.summary),
            skills: pickArray(source.skills, current.skills),
            experience: pickArray(source.experience, current.experience),
            projects: pickArray(source.projects, current.projects),
            certifications: pickArray(source.certifications, current.certifications),
            education: pickArray(source.education, current.education),
          }));
        }
        window.sessionStorage.removeItem('ResumeLab-imported-resume');
        window.sessionStorage.removeItem('ResumeLab-imported-raw-text');
        setIsImported(true);
        return;
      }

      // No new import — restore previously saved editor state (survives refresh)
      const saved = window.sessionStorage.getItem('ResumeLab-editor-state');
      if (saved) {
        const savedData = JSON.parse(saved);
        if (savedData && typeof savedData === 'object' && savedData.personal) {
          setData(savedData);
          setIsImported(true);
        }
      }
    } catch {
      // ignore storage issues
    }
  }, []);

  // Persist editor state to sessionStorage on every change (survives refresh)
  useEffect(() => {
    // Don't save if data is still the initial empty state
    const hasContent = data.personal.fullName || data.personal.emailAddress || data.summary || data.experience.some((e) => e.companyName || e.role);
    if (!hasContent) return;
    try {
      const serialized = JSON.stringify(data);
      window.sessionStorage.setItem('ResumeLab-editor-state', serialized);
    } catch (e) {
      // If quota exceeded, clear old state and try once more
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        try {
          window.sessionStorage.removeItem('ResumeLab-editor-state');
          window.sessionStorage.setItem('ResumeLab-editor-state', JSON.stringify(data));
        } catch {
          // Truly out of space — silently skip
        }
      }
    }
  }, [data]);

  const previewData = useMemo(
    () => ({
      name: data.personal.fullName || 'Your Name',
      job_title: data.personal.professionalTitle || 'Professional Title',
      phone: data.personal.phoneNumber || 'Phone Number',
      email: data.personal.emailAddress || 'Email Address',
      linkedin: data.personal.linkedInUrl || 'LinkedIn',
      linkedin_url: data.personal.linkedInUrl || '#',
      summary: data.summary,
      skills_categories: data.skills.map((s) => ({
        category_label: s.category,
        skills_list: s.items.filter(Boolean).join(', '),
      })),
      experience: data.experience.map((e) => ({
        company: e.companyName,
        role: e.role,
        start_date: e.startDate,
        end_date: e.endDate,
        bullets: e.bullets.filter(Boolean),
      })),
      projects: data.projects.map((p) => ({
        project_name: p.projectName,
        technologies: p.technologiesUsed,
        bullets: [...p.bullets.filter(Boolean), ...(p.links || []).filter(Boolean)],
      })),
      certifications: data.certifications.map((c) => ({
        cert_title: c.certificationName,
        issuer: c.issuer,
      })),
      education: data.education.map((e) => ({
        degree: e.degree,
        institution: e.institution,
        graduation_date: e.graduationYear,
        score: e.gpa,
      })),
    }),
    [data]
  );

  const sections = [
    <Card key="personal" title="Personal Information" description="These details fill the resume header immediately.">
      <div className="grid gap-[12px]">
        <Input label="Full Name" value={data.personal.fullName} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, fullName: v } }))} placeholder="Enter full name" />
        <Input label="Professional Title" value={data.personal.professionalTitle} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, professionalTitle: v } }))} placeholder="Enter professional title" />
        <Input label="Phone Number" value={data.personal.phoneNumber} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, phoneNumber: v } }))} placeholder="Enter phone number" />
        <Input label="Email Address" value={data.personal.emailAddress} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, emailAddress: v } }))} placeholder="Enter email address" />
        <Input label="LinkedIn URL" value={data.personal.linkedInUrl} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, linkedInUrl: v } }))} placeholder="https://linkedin.com/in/your-profile" />
      </div>
    </Card>,
    <Card key="summary" title="Summary" description="Write a short professional summary.">
      <div className="relative">
        <TextArea value={data.summary} onChange={(v) => setData((p) => ({ ...p, summary: v }))} placeholder="Tell a recruiter who you are, what you do, and what you are good at." />
        <button
          type="button"
          onClick={() =>
          enhanceText({
              section: 'summary',
              text: data.summary,
              context: 'resume summary',
              keyId: 'summary',
              onSuccess: (value) => setData((p) => ({ ...p, summary: value })),
            })
          }
          disabled={Boolean(enhancing.summary)}
          className="absolute bottom-[10px] right-[10px] flex h-[20px] w-[20px] items-center justify-center bg-transparent p-0 disabled:opacity-50"
          aria-label="Enhance summary with AI"
          title="Enhance with AI"
        >
          {enhancing.summary ? (
            <span className="h-[12px] w-[12px] animate-spin rounded-full border-[1.5px] border-[color:#6C63FF] border-t-transparent" />
          ) : (
            <img src="/images/AI%20enhancement.png" alt="" aria-hidden="true" className="h-[20px] w-[20px] object-contain" />
          )}
        </button>
      </div>
    </Card>,
    <Card key="skills" title="Skills" description="Create categories and list the skills inside each category.">
      <div className="grid gap-[12px]">
        {!isImported && (
        <div className="rounded-[16px] bg-[linear-gradient(180deg,#fbfbff_0%,#f6f4ff_100%)] p-[12px]">
          <div className="mb-[10px] flex items-center justify-between gap-[10px]">
            <span className="text-[12px] font-semibold text-black">Suggested skills</span>
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {skillSuggestions.map((skill) => {
              const isSelected = data.skills.some((g) => g.items.includes(skill));
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    if (isSelected) return;
                    setData((p) => ({
                      ...p,
                      skills: p.skills.length
                        ? updateItem(p.skills, Math.min(activeSkillCategory, p.skills.length - 1), (group) => ({
                            ...group,
                            items: addItem(group.items, skill),
                          }))
                        : [{ id: makeId(), category: 'Skills', items: [skill] }],
                    }));
                  }}
                  className={`rounded-full border px-[12px] py-[8px] text-[12px] font-semibold shadow-[0_6px_14px_rgba(17,24,39,0.04)] ${
                    isSelected
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-[color:#d8d2ff] bg-white text-black'
                  }`}
                >
                  {isSelected ? '✓' : '+'} {skill}
                </button>
              );
            })}
          </div>
        </div>
        )}
        {data.skills.map((g, gi) => (
          <div key={g.id} className="rounded-[18px] border border-[color:#e8e8f0] bg-white p-[12px] shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
            <div className="grid gap-[12px]">
              <div className="flex items-start justify-between gap-[10px]">
                <div className="flex-1">
                  <label className="block">
                    <span className="mb-[6px] block text-[12px] font-semibold text-black">Category {gi + 1}</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={g.category}
                        onFocus={() => setActiveSkillCategory(gi)}
                        onChange={(e) => setData((p) => ({ ...p, skills: updateItem(p.skills, gi, (item) => ({ ...item, category: e.target.value })) }))}
                        placeholder="Programming & Querying"
                        className="h-[44px] w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] pr-[24px] text-[14px] font-bold text-black outline-none focus:border-[color:var(--purple)]"
                      />
                      <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[15px] font-bold text-black">:</span>
                    </div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setData((p) => ({ ...p, skills: removeItem(p.skills, gi) }))}
                  className="mt-[24px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[18px] leading-none text-black"
                  aria-label="Remove category"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
              {g.items.map((item, ii) => (
                <div key={ii} className="flex gap-[8px]">
                  <input
                    value={item}
                    onFocus={() => setActiveSkillCategory(gi)}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        skills: updateItem(p.skills, gi, (group) => ({
                          ...group,
                          items: updateItem(group.items, ii, () => e.target.value),
                        })),
                      }))
                    }
                    placeholder={ii === 0 ? 'SQL' : ii === 1 ? 'Python' : 'Enter skill'}
                    className="h-[44px] flex-1 rounded-[12px] border border-[color:#e5e7eb] px-[14px] text-[14px] outline-none focus:border-[color:var(--purple)]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        skills: updateItem(p.skills, gi, (group) => ({
                          ...group,
                          items: removeItem(group.items, ii),
                        })),
                      }))
                    }
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[12px] border border-[color:#e5e7eb] text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
                    aria-label="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setData((p) => ({
                    ...p,
                    skills: updateItem(p.skills, gi, (group) => ({
                      ...group,
                      items: addItem(group.items, ''),
                    })),
                  }))
                }
                className="rounded-[14px] bg-[rgba(108,99,255,0.08)] px-[14px] py-[10px] text-[13px] font-semibold text-[color:var(--purple)]"
              >
                Add Skill
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((p) => ({
              ...p,
              skills: addItem(p.skills, { id: makeId(), category: '', items: [''] }),
            }))
          }
          className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white"
        >
          Add Category
        </button>
      </div>
    </Card>,
    <Card key="experience" title="Experience" description="Add unlimited work experience entries with bullet points.">
      <div className="grid gap-[12px]">
        {data.experience.map((exp, ei) => (
          <div key={exp.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button
              type="button"
              onClick={() => setConfirmModal({ message: 'Delete this experience entry?', onConfirm: () => setData((p) => ({ ...p, experience: removeItem(p.experience, ei) })) })}
              className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label="Remove experience"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <div className="grid gap-[12px]">
              <Input label="Company Name" value={exp.companyName} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, companyName: v })) }))} placeholder="Company name" />
              <Input label="Role / Position" value={exp.role} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, role: v })) }))} placeholder="Role / position" />
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Start Date" value={exp.startDate} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, startDate: v })) }))} placeholder="Jan 2023" />
                <Input label="End Date" value={exp.endDate} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, endDate: v })) }))} placeholder="Present" />
              </div>
              <span className="mb-[2px] mt-[4px] block text-[12px] font-semibold text-black">Experience Summary</span>
              {exp.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-[8px]">
                  <div className="relative flex-1">
                    <input
                      value={b}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          experience: updateItem(p.experience, ei, (item) => ({
                            ...item,
                            bullets: updateItem(item.bullets, bi, () => e.target.value),
                          })),
                        }))
                      }
                      placeholder="Add bullet point"
                      className="h-[44px] w-full rounded-[12px] border border-[color:#e5e7eb] px-[14px] pr-[42px] text-[14px] outline-none focus:border-[color:var(--purple)]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        enhanceText({
                          section: 'experience_bullet',
                          text: b,
                          context: `Experience bullet for ${exp.companyName || 'company'} - ${exp.role || 'role'}`,
                          keyId: `experience:${ei}:${bi}`,
                          onSuccess: (value) =>
                            setData((p) => ({
                              ...p,
                              experience: updateItem(p.experience, ei, (item) => ({
                                ...item,
                                bullets: updateItem(item.bullets, bi, () => value),
                              })),
                            })),
                        })
                      }
                      disabled={Boolean(enhancing[`experience:${ei}:${bi}`])}
                      className="absolute bottom-[8px] right-[8px] flex h-[20px] w-[20px] items-center justify-center bg-transparent p-0 disabled:opacity-50"
                      aria-label="Enhance experience bullet"
                      title="Enhance with AI"
                    >
                      {enhancing[`experience:${ei}:${bi}`] ? (
                        <span className="h-[12px] w-[12px] animate-spin rounded-full border-[1.5px] border-[color:#6C63FF] border-t-transparent" />
                      ) : (
                        <img src="/images/AI%20enhancement.png" alt="" aria-hidden="true" className="h-[20px] w-[20px] object-contain" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        experience: updateItem(p.experience, ei, (item) => ({
                          ...item,
                          bullets: removeItem(item.bullets, bi),
                        })),
                      }))
                    }
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[12px] border border-[color:#e5e7eb] text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
                    aria-label="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setData((p) => ({
                    ...p,
                    experience: updateItem(p.experience, ei, (item) => ({
                      ...item,
                      bullets: addItem(item.bullets, ''),
                    })),
                  }))
                }
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-dashed border-[color:#cfc8ff] bg-[rgba(108,99,255,0.04)] text-[color:var(--purple)] hover:bg-[rgba(108,99,255,0.1)] transition-colors"
                aria-label="Add bullet point"
                title="Add bullet point"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((p) => ({
              ...p,
              experience: addItem(p.experience, {
                id: makeId(),
                companyName: '',
                role: '',
                startDate: '',
                endDate: '',
                bullets: [''],
              }),
            }))
          }
          className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white"
        >
          Add Experience
        </button>
      </div>
    </Card>,
    <Card key="projects" title="Projects" description="Add unlimited projects with technologies and bullet points.">
      <div className="grid gap-[12px]">
        {data.projects.map((p, pi) => (
          <div key={p.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button
              type="button"
              onClick={() => setConfirmModal({ message: 'Delete this project entry?', onConfirm: () => setData((d) => ({ ...d, projects: removeItem(d.projects, pi) })) })}
              className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label="Remove project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <div className="grid gap-[12px]">
              <Input label="Project Name" value={p.projectName} onChange={(v) => setData((d) => ({ ...d, projects: updateItem(d.projects, pi, (item) => ({ ...item, projectName: v })) }))} placeholder="Project name" />
              <Input label="Technologies Used" value={p.technologiesUsed} onChange={(v) => setData((d) => ({ ...d, projects: updateItem(d.projects, pi, (item) => ({ ...item, technologiesUsed: v })) }))} placeholder="React, Node, SQL" />
              <span className="mb-[2px] mt-[4px] block text-[12px] font-semibold text-black">Project Summary</span>
              {p.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-[8px]">
                  <div className="relative flex-1">
                    <input
                      value={b}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          projects: updateItem(d.projects, pi, (item) => ({
                            ...item,
                            bullets: updateItem(item.bullets, bi, () => e.target.value),
                          })),
                        }))
                      }
                      placeholder="Add project bullet point"
                      className="h-[44px] w-full rounded-[12px] border border-[color:#e5e7eb] px-[14px] pr-[42px] text-[14px] outline-none focus:border-[color:var(--purple)]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        enhanceText({
                          section: 'project_bullet',
                          text: b,
                          context: `Project bullet for ${p.projectName || 'project'} using ${p.technologiesUsed || 'unknown technologies'}`,
                          keyId: `project:${pi}:${bi}`,
                          onSuccess: (value) =>
                            setData((d) => ({
                              ...d,
                              projects: updateItem(d.projects, pi, (item) => ({
                                ...item,
                                bullets: updateItem(item.bullets, bi, () => value),
                              })),
                            })),
                        })
                      }
                      disabled={Boolean(enhancing[`project:${pi}:${bi}`])}
                      className="absolute bottom-[8px] right-[8px] flex h-[20px] w-[20px] items-center justify-center bg-transparent p-0 disabled:opacity-50"
                      aria-label="Enhance project bullet"
                      title="Enhance with AI"
                    >
                      {enhancing[`project:${pi}:${bi}`] ? (
                        <span className="h-[12px] w-[12px] animate-spin rounded-full border-[1.5px] border-[color:#6C63FF] border-t-transparent" />
                      ) : (
                        <img src="/images/AI%20enhancement.png" alt="" aria-hidden="true" className="h-[20px] w-[20px] object-contain" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        projects: updateItem(d.projects, pi, (item) => ({
                          ...item,
                          bullets: removeItem(item.bullets, bi),
                        })),
                      }))
                    }
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[12px] border border-[color:#e5e7eb] text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
                    aria-label="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    projects: updateItem(d.projects, pi, (item) => ({
                      ...item,
                      bullets: addItem(item.bullets, ''),
                    })),
                  }))
                }
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-dashed border-[color:#cfc8ff] bg-[rgba(108,99,255,0.04)] text-[color:var(--purple)] hover:bg-[rgba(108,99,255,0.1)] transition-colors"
                aria-label="Add bullet point"
                title="Add bullet point"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span className="mb-[2px] mt-[8px] block text-[12px] font-semibold text-black">Links</span>
              {(p.links || []).map((link, li) => (
                <div key={li} className="flex gap-[8px]">
                  <input
                    value={link}
                    onChange={(e) =>
                      setData((d) => ({
                        ...d,
                        projects: updateItem(d.projects, pi, (item) => ({
                          ...item,
                          links: updateItem(item.links || [], li, () => e.target.value),
                        })),
                      }))
                    }
                    placeholder="https://your-project-link.com"
                    className="h-[44px] flex-1 rounded-[12px] border border-[color:#e5e7eb] px-[14px] text-[14px] text-blue-600 outline-none focus:border-[color:var(--purple)]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setData((d) => ({
                        ...d,
                        projects: updateItem(d.projects, pi, (item) => ({
                          ...item,
                          links: removeItem(item.links || [], li),
                        })),
                      }))
                    }
                    className="flex h-[36px] w-[36px] items-center justify-center rounded-[12px] border border-[color:#e5e7eb] text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
                    aria-label="Remove link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    projects: updateItem(d.projects, pi, (item) => ({
                      ...item,
                      links: addItem(item.links || [], ''),
                    })),
                  }))
                }
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-dashed border-[color:#cfc8ff] bg-[rgba(108,99,255,0.04)] text-[color:var(--purple)] hover:bg-[rgba(108,99,255,0.1)] transition-colors"
                aria-label="Add link"
                title="Add link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((p) => ({
              ...p,
              projects: addItem(p.projects, {
                id: makeId(),
                projectName: '',
                technologiesUsed: '',
                bullets: [''],
                links: [],
              }),
            }))
          }
          className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white"
        >
          Add Project
        </button>
      </div>
    </Card>,
    <Card key="certifications" title="Certifications" description="Add unlimited certifications with issuer details.">
      <div className="grid gap-[12px]">
        {data.certifications.map((c, ci) => (
          <div key={c.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button
              type="button"
              onClick={() => setConfirmModal({ message: 'Delete this certification?', onConfirm: () => setData((d) => ({ ...d, certifications: removeItem(d.certifications, ci) })) })}
              className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label="Remove certification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <div className="grid gap-[12px]">
              <Input label="Certification Name" value={c.certificationName} onChange={(v) => setData((d) => ({ ...d, certifications: updateItem(d.certifications, ci, (item) => ({ ...item, certificationName: v })) }))} placeholder="Certification name" />
              <div className="relative">
                <Input label="Issuer" value={c.issuer} onChange={(v) => setData((d) => ({ ...d, certifications: updateItem(d.certifications, ci, (item) => ({ ...item, issuer: v })) }))} placeholder="Issuer" />
                <button
                  type="button"
                  onClick={() =>
                    enhanceText({
                      section: 'issuer',
                      text: c.issuer,
                      context: `Certification issuer for ${c.certificationName || 'certification'}`,
                      keyId: `issuer:${ci}`,
                      onSuccess: (value) =>
                        setData((d) => ({
                          ...d,
                          certifications: updateItem(d.certifications, ci, (item) => ({
                            ...item,
                            issuer: value,
                          })),
                        })),
                    })
                  }
                  disabled={Boolean(enhancing[`issuer:${ci}`])}
                  className="absolute bottom-[8px] right-[8px] flex h-[20px] w-[20px] items-center justify-center bg-transparent p-0 disabled:opacity-50"
                  aria-label="Enhance issuer"
                  title="Enhance with AI"
                >
                  {enhancing[`issuer:${ci}`] ? (
                    <span className="h-[12px] w-[12px] animate-spin rounded-full border-[1.5px] border-[color:#6C63FF] border-t-transparent" />
                  ) : (
                    <img src="/images/AI%20enhancement.png" alt="" aria-hidden="true" className="h-[20px] w-[20px] object-contain" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((p) => ({
              ...p,
              certifications: addItem(p.certifications, {
                id: makeId(),
                certificationName: '',
                issuer: '',
              }),
            }))
          }
          className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white"
        >
          Add Certification
        </button>
      </div>
    </Card>,
    <Card key="education" title="Education" description="Add unlimited education entries with optional CGPA or GPA.">
      <div className="grid gap-[12px]">
        {data.education.map((e, ei) => (
          <div key={e.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button
              type="button"
              onClick={() => setConfirmModal({ message: 'Delete this education entry?', onConfirm: () => setData((d) => ({ ...d, education: removeItem(d.education, ei) })) })}
              className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
              aria-label="Remove education"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <div className="grid gap-[12px]">
              <Input label="Degree" value={e.degree} onChange={(v) => setData((d) => ({ ...d, education: updateItem(d.education, ei, (item) => ({ ...item, degree: v })) }))} placeholder="Degree" />
              <Input label="Institution" value={e.institution} onChange={(v) => setData((d) => ({ ...d, education: updateItem(d.education, ei, (item) => ({ ...item, institution: v })) }))} placeholder="Institution" />
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Graduation Year" value={e.graduationYear} onChange={(v) => setData((d) => ({ ...d, education: updateItem(d.education, ei, (item) => ({ ...item, graduationYear: v })) }))} placeholder="2025" />
                <Input label="CGPA / GPA (optional)" value={e.gpa} onChange={(v) => setData((d) => ({ ...d, education: updateItem(d.education, ei, (item) => ({ ...item, gpa: v })) }))} placeholder="8.5 / 10" />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData((p) => ({
              ...p,
              education: addItem(p.education, {
                id: makeId(),
                degree: '',
                institution: '',
                graduationYear: '',
                gpa: '',
              }),
            }))
          }
          className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white"
        >
          Add Education
        </button>
      </div>
    </Card>,
  ];

  const activeTip = slideTips[step] || slideTips[0];

  const enhanceText = async ({ section, text, context, onSuccess, keyId }) => {
    const currentText = String(text || '').trim();
    if (!currentText) return;

    const key = keyId || `${section}:${context || 'default'}`;
    setEnhancing((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch('/api/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, text: currentText, context }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = payload?.details ? `${payload?.error || 'Enhancement failed'}: ${payload.details}` : payload?.error || 'Enhancement failed';
        throw new Error(message);
      }
      const enhanced = String(payload?.text || '').trim();
      if (enhanced) onSuccess(enhanced);
      else throw new Error('No enhanced text returned');
    } catch (err) {
      console.error('AI enhancement error:', err);
      window.alert('AI enhancement is temporarily unavailable. Please try again in a moment.');
    } finally {
      setEnhancing((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewData),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      window.alert('PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] text-black" style={{ overscrollBehavior: 'none' }}>

      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1280px] flex-col gap-[12px] px-[8px] pb-[12px] pt-[8px] md:px-[16px] lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <div
          className={`${
            mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
          } flex-1 flex-col gap-[12px] pb-[132px] md:gap-[14px] md:pb-0`}
        >
          <div className="rounded-[22px] border border-[color:rgba(229,231,235,0.95)] bg-white p-[10px] shadow-[0_10px_26px_rgba(17,24,39,0.06)] md:p-[16px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-center">
                <div className="rounded-full bg-[rgba(16,185,129,0.12)] px-[12px] py-[6px] text-[12px] font-bold uppercase text-[#10b981]">
                  POPULAR
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <button
                  type="button"
                  onClick={() => setMobileView('form')}
                  className={`flex-1 rounded-full px-[12px] py-[10px] text-[12px] font-bold md:px-[14px] md:py-[11px] md:text-[13px] ${
                    mobileView === 'form'
                      ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white'
                      : 'bg-[rgba(108,99,255,0.08)] text-[color:var(--purple)]'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('preview')}
                  className={`flex-1 rounded-full px-[12px] py-[10px] text-[12px] font-bold md:px-[14px] md:py-[11px] md:text-[13px] ${
                    mobileView === 'preview'
                      ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white'
                      : 'bg-[rgba(108,99,255,0.08)] text-[color:var(--purple)]'
                  }`}
                >
                  Preview
                </button>
                {/* 3-dot menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoreMenu((v) => !v)}
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#f4f4f6] shadow-[0_4px_12px_rgba(17,24,39,0.06)]"
                    aria-label="More options"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-black">
                      <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                    </svg>
                  </button>
                  {showMoreMenu && (
                    <>
                      <div className="fixed inset-0 z-[49]" onClick={() => setShowMoreMenu(false)} />
                      <div className="absolute right-0 top-[46px] z-[50] w-[200px] rounded-[14px] border border-[color:#eceef2] bg-white py-[6px] shadow-[0_12px_32px_rgba(17,24,39,0.14)]">
                        <button type="button" onClick={() => { setShowMoreMenu(false); setMobileView('preview'); }} className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f8f8fa]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                          Preview Resume
                        </button>
                        <button type="button" onClick={() => { setShowMoreMenu(false); handleDownload(); }} className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f8f8fa]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Export Resume
                        </button>
                        <button type="button" className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-[#aaa] cursor-default">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          Duplicate Resume
                        </button>
                        <div className="my-[4px] border-t border-[color:#eceef2]" />
                        <button type="button" onClick={() => { setShowMoreMenu(false); setConfirmModal({ message: 'This will delete all your resume data. This action cannot be undone.', onConfirm: () => { setData(initialData); try { window.sessionStorage.removeItem('ResumeLab-editor-state'); } catch {} } }); }} className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-red-500 hover:bg-red-50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          Clear All Data
                        </button>
                        <button type="button" className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-[#aaa] cursor-default">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                          Reset Template
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {/* X close button */}
                <button
                  type="button"
                  onClick={() => mobileView === 'preview' ? setMobileView('form') : router.push(`/template-details?template=${templateId}`)}
                  className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#f4f4f6] shadow-[0_4px_12px_rgba(17,24,39,0.06)]"
                  aria-label="Close"
                >
                  <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-none stroke-black stroke-[2.4]">
                    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            ref={stepRailRef}
            className="flex gap-[8px] overflow-x-auto pb-[4px] pr-[4px] [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            {steps.map((label, index) => (
              <button
                key={label}
                ref={(el) => {
                  stepButtonRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setStep(index)}
                className={`whitespace-nowrap rounded-full px-[14px] py-[8px] text-[12px] font-bold ${
                  step === index
                    ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white'
                    : 'bg-white text-black shadow-[0_6px_16px_rgba(17,24,39,0.06)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1">{sections[step]}</div>

          <div className="flex items-center justify-between gap-[12px] pt-[4px] lg:pt-0">
            <button
              type="button"
              onClick={() => setStep((p) => Math.max(p - 1, 0))}
              disabled={step === 0}
              className="rounded-[14px] border border-[color:#e5e7eb] bg-white px-[16px] py-[12px] text-[14px] font-bold text-black disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setStep((p) => Math.min(p + 1, steps.length - 1))}
              className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[18px] py-[12px] text-[14px] font-bold text-white"
            >
              Next
            </button>
          </div>

          <div className="rounded-[18px] border border-[color:#b7d9ef] bg-[linear-gradient(180deg,#eef8ff_0%,#dcefff_100%)] px-[14px] py-[12px] shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
            <div className="flex items-start gap-[10px]">
              <div className="mt-[1px] flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[14px] font-black text-[#3aa0d8] shadow-[0_6px_14px_rgba(17,24,39,0.05)]">
                i
              </div>
              <div>
                <div className="text-[11px] font-black tracking-[0.08em] text-[#2291c8]">
                  {activeTip.title}
                </div>
                <p className="mt-[4px] text-[12px] leading-[1.45] text-[#46606f]">
                  {activeTip.text}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${mobileView === 'form' ? 'hidden lg:block' : 'block'} lg:sticky lg:top-[16px] lg:h-[calc(100vh-32px)]`}>
          <div className="flex h-full flex-col rounded-[22px] border border-[color:rgba(229,231,235,0.95)] bg-white p-[12px] shadow-[0_10px_26px_rgba(17,24,39,0.06)] md:p-[14px]">
            <div className="mb-[12px] grid grid-cols-[1fr_auto] items-center gap-[8px]">
              <div className="text-center text-[18px] font-bold tracking-[-0.02em] text-black">
                PREVIEW
              </div>
              <button
                type="button"
                onClick={() => setMobileView('form')}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[18px] font-semibold leading-none text-black shadow-[0_8px_18px_rgba(17,24,39,0.08)]"
                aria-label="Return to edit"
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-[16px] bg-[#f4f4f6] p-[0px]">
              <div className="flex h-full flex-col rounded-[18px] bg-white shadow-[0_8px_18px_rgba(17,24,39,0.06)]">
                <div className="min-h-0 flex-1 overflow-auto">
                <Template1Preview data={previewData} previewMode />
                </div>
              </div>
            </div>
            <div className="mt-[8px] flex items-start gap-[8px] rounded-[12px] bg-[rgba(108,99,255,0.06)] px-[12px] py-[10px]">
              <img src="/images/AI%20enhancement.png" alt="" aria-hidden="true" className="mt-[1px] h-[16px] w-[16px] shrink-0 object-contain" />
              <p className="text-[11px] leading-[1.4] text-[#555]">
                Tap <strong className="text-[color:var(--purple)]">✦</strong> on any field to enhance your text with AI — make every bullet sound professional and recruiter-ready.
              </p>
            </div>
            <div className="mt-auto hidden shrink-0 rounded-[18px] border border-[color:#eceef2] bg-white p-[10px] shadow-[0_8px_18px_rgba(17,24,39,0.06)] md:block">
              <div className="flex items-center justify-between gap-[10px]">
                <button
                  type="button"
                  onClick={() => router.push('/#templates-section')}
                  className="rounded-full border border-[color:#d8d2ff] bg-white px-[14px] py-[8px] text-[12px] font-semibold text-[color:var(--purple)]"
                >
                  Templates
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[14px] py-[8px] text-[12px] font-semibold text-white disabled:opacity-70"
                >
                  {downloading ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[color:#eceef2] bg-white px-[12px] pb-[12px] pt-[10px] shadow-[0_-10px_24px_rgba(17,24,39,0.08)] md:hidden">
        <div className="mx-auto flex max-w-[480px] items-center gap-[10px]">
          <button
            type="button"
            onClick={() => router.push('/#templates-section')}
            className="h-[42px] flex-1 rounded-full border border-[color:#d8d2ff] bg-white px-[14px] text-[12px] font-semibold text-[color:var(--purple)]"
          >
            Templates
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="h-[42px] flex-[1.35] rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[14px] text-[12px] font-semibold text-white disabled:opacity-70"
          >
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-[16px]">
          <div className="w-full max-w-[320px] rounded-[20px] bg-white p-[24px] shadow-[0_20px_50px_rgba(17,24,39,0.18)]">
            <div className="mb-[16px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-red-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </div>
            <h3 className="text-[16px] font-bold text-black">Are you sure?</h3>
            <p className="mt-[6px] text-[13px] leading-[1.4] text-[#666]">{confirmModal.message}</p>
            <div className="mt-[20px] flex gap-[10px]">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 rounded-[12px] border border-[color:#e5e7eb] bg-white py-[10px] text-[13px] font-semibold text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                className="flex-1 rounded-[12px] bg-red-500 py-[10px] text-[13px] font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
