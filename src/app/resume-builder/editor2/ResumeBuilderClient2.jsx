'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Template2Preview from '../../../components/template-previews/Template2Preview';
import { supabase } from '../../../lib/supabase';
import { checkDownloadAccess, initiatePayment, invalidateDownloadCache } from '../../../lib/payment';

const steps = ['Personal Info', 'Skills', 'Work Experience', 'Education', 'Projects', 'Certifications'];
const makeId = () => Date.now() + Math.random();

const initialData = {
  personal: { fullName: '', email: '', phone: '', github: '', linkedin: '' },
  skills: [{ id: makeId(), category: '', items: [''] }],
  experience: [{ id: makeId(), company: '', location: '', role: '', startDate: '', endDate: '', bullets: [''], toolsUsed: '' }],
  education: [{ id: makeId(), institution: '', degree: '', startDate: '', endDate: '', score: '', scoreLabel: 'CGPA', coursework: '' }],
  projects: [{ id: makeId(), name: '', year: '', description: '', technologies: '' }],
  certifications: [{ id: makeId(), title: '', issuer: '', description: '' }],
};

const Input = ({ label, value, onChange, placeholder, error = false, maxLength }) => (
  <label className="block">
    <span className="mb-[6px] block text-[12px] font-semibold text-black">{label}</span>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
      className={`h-[44px] w-full rounded-[12px] border bg-white px-[14px] text-[14px] text-black outline-none focus:border-[color:var(--purple)] ${error ? 'border-red-400' : 'border-[color:#e5e7eb]'}`} />
  </label>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3, maxLength }) => (
  <label className="block">
    <span className="mb-[6px] block text-[12px] font-semibold text-black">{label}</span>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} maxLength={maxLength}
      className="w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] py-[10px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]" />
  </label>
);

const Card = ({ title, description, children }) => (
  <section className="rounded-[22px] border border-[color:rgba(229,231,235,0.95)] bg-white p-[14px] shadow-[0_10px_26px_rgba(17,24,39,0.06)] md:p-[16px]">
    <h2 className="text-[18px] font-bold tracking-[-0.02em] text-black">{title}</h2>
    {description && <p className="mt-[4px] text-[12.5px] leading-[1.5] text-[#666]">{description}</p>}
    <div className="mt-[14px]">{children}</div>
  </section>
);

const addItem = (list, item) => [...list, item];
const updateItem = (list, index, updater) => list.map((item, i) => (i === index ? updater(item) : item));
const removeItem = (list, index) => list.filter((_, i) => i !== index);

// Format validation helpers
const isValidName = (v) => !v.trim() || /^[a-zA-Z\s.\-']+$/.test(v.trim());
const isValidPhone = (v) => !v.trim() || /^[0-9+\-\s()]+$/.test(v.trim());
const isValidEmail = (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidLinkedIn = (v) => !v.trim() || /linkedin\.com/i.test(v.trim());
const hasFormatErrors2 = (personal) => {
  if (personal.fullName.trim() && !isValidName(personal.fullName)) return true;
  if (personal.phone.trim() && !isValidPhone(personal.phone)) return true;
  if (personal.email.trim() && !isValidEmail(personal.email)) return true;
  if (personal.linkedin.trim() && !isValidLinkedIn(personal.linkedin)) return true;
  return false;
};

// Post-import cleanup: extract contact info from summary-like fields
function cleanupImportedSrc(src) {
  if (!src) return src;
  // Template 2 doesn't have a summary field, but the personal fields might have junk
  // Clean email/phone/linkedin if they ended up with extra content
  const personal = { ...(src.personal || {}) };
  // If emailAddress has extra text, extract just the email
  const rawEmail = personal.emailAddress || personal.email || '';
  const emailMatch = rawEmail.match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i);
  if (emailMatch) { personal.emailAddress = emailMatch[0]; personal.email = emailMatch[0]; }
  // If phone has letters, extract just numbers
  const rawPhone = personal.phoneNumber || personal.phone || '';
  const phoneMatch = rawPhone.match(/(\+?\d[\d\s()\-]{7,}\d)/);
  if (phoneMatch) { personal.phoneNumber = phoneMatch[0].trim(); personal.phone = phoneMatch[0].trim(); }
  // If linkedin has extra text, extract just the URL
  const rawLinkedin = personal.linkedInUrl || personal.linkedin || '';
  const linkedInMatch = rawLinkedin.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s,|)]+/i);
  if (linkedInMatch) { personal.linkedInUrl = linkedInMatch[0]; personal.linkedin = linkedInMatch[0]; }
  return { ...src, personal };
}

export default function ResumeBuilderClient2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState('form');
  const [data, setData] = useState(initialData);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [confirmModal, setConfirmModal] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const downloadMenuRef = useRef(null);
  const stepRailRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_ev, session) => setUser(session?.user || null));
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const requireAuth = (pendingAction) => {
    if (user) return true;
    if (pendingAction) { try { window.sessionStorage.setItem('ResumeLab-pending-action', pendingAction); } catch {} }
    const returnPath = window.location.pathname + window.location.search;
    try { window.sessionStorage.setItem('ResumeLab-return-to', returnPath); } catch {}
    setConfirmModal({ message: 'Sign in to download your resume.', onConfirm: () => { setConfirmModal(null); router.push(`/auth/login?returnTo=${encodeURIComponent(returnPath)}`); }, confirmText: 'Sign In', confirmColor: 'bg-[#6C63FF]' });
    return false;
  };

  // Auto-trigger pending action after login
  useEffect(() => {
    if (!user) return;
    try {
      const pending = window.sessionStorage.getItem('ResumeLab-pending-action');
      if (!pending) return;
      window.sessionStorage.removeItem('ResumeLab-pending-action');
      if (pending === 'pdf') setTimeout(() => handleDownloadWithValidation(handleDownload, 'pdf'), 500);
      else if (pending === 'docx') setTimeout(() => handleDownloadWithValidation(handleDownloadDocx, 'docx'), 500);
      else if (pending === 'enhance') setTimeout(() => runEnhanceAll(), 500);
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      const fresh = searchParams.get('fresh') === 'true';
      if (fresh) {
        window.sessionStorage.removeItem('ResumeLab-editor2-state');
        window.sessionStorage.removeItem('ResumeLab-imported-resume');
        window.sessionStorage.removeItem('ResumeLab-imported-raw-text');
        setData(initialData);
        return;
      }

      // Check for imported resume data
      const imported = window.sessionStorage.getItem('ResumeLab-imported-resume');
      if (imported) {
        const parsed = JSON.parse(imported);
        if (parsed && typeof parsed === 'object') {
          const src = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
          console.log('[editor2] imported data:', { personal: !!src.personal, skills: src.skills?.length, experience: src.experience?.length, projects: src.projects?.length, certifications: src.certifications?.length });
          console.log('[editor2] projects raw:', JSON.stringify(src.projects?.slice(0, 2)));
          console.log('[editor2] certifications raw:', JSON.stringify(src.certifications?.slice(0, 2)));
          const hasContent = src.personal || src.experience || src.skills || src.projects || src.certifications;
          if (hasContent) {
            const cleaned = cleanupImportedSrc(src);
            const p = cleaned.personal || {};
            const mappedProjects = Array.isArray(src.projects) && src.projects.length
              ? src.projects.map((pr) => {
                  const bullets = Array.isArray(pr.bullets) ? pr.bullets.filter(Boolean) : [];
                  const links = Array.isArray(pr.links) ? pr.links.filter(Boolean) : [];
                  const desc = bullets.length ? bullets.join('. ') : (pr.description || '');
                  return { id: makeId(), name: pr.projectName || pr.project_name || pr.name || '', year: pr.year || '', description: desc, technologies: pr.technologiesUsed || pr.technologies || '' };
                })
              : [{ id: makeId(), name: '', year: '', description: '', technologies: '' }];
            const mappedCerts = Array.isArray(src.certifications) && src.certifications.length
              ? src.certifications.map((c) => ({ id: makeId(), title: c.certificationName || c.cert_title || c.title || c.name || '', issuer: c.issuer || '', description: c.description || c.cert_description || '' }))
              : [{ id: makeId(), title: '', issuer: '', description: '' }];
            console.log('[editor2] mapped projects:', mappedProjects.map((p) => p.name));
            console.log('[editor2] mapped certs:', mappedCerts.map((c) => c.title));
            setData({
              personal: {
                fullName: p.fullName || p.name || '',
                email: p.emailAddress || p.email || '',
                phone: p.phoneNumber || p.phone || '',
                github: p.github || p.githubUrl || '',
                linkedin: p.linkedInUrl || p.linkedin || '',
              },
              skills: Array.isArray(src.skills) && src.skills.length
                ? src.skills.map((s) => ({ id: makeId(), category: s.category || s.category_label || '', items: Array.isArray(s.items) ? s.items.filter(Boolean) : (typeof s.skills_list === 'string' ? s.skills_list.split(',').map((x) => x.trim()).filter(Boolean) : ['']) }))
                : [{ id: makeId(), category: '', items: [''] }],
              experience: Array.isArray(src.experience) && src.experience.length
                ? src.experience.map((e) => ({ id: makeId(), company: e.companyName || e.company || '', location: e.location || '', role: e.role || '', startDate: e.startDate || e.start_date || '', endDate: e.endDate || e.end_date || '', bullets: Array.isArray(e.bullets) && e.bullets.filter(Boolean).length ? e.bullets.filter(Boolean) : [''], toolsUsed: e.toolsUsed || e.tools_used || '' }))
                : [{ id: makeId(), company: '', location: '', role: '', startDate: '', endDate: '', bullets: [''], toolsUsed: '' }],
              education: Array.isArray(src.education) && src.education.length
                ? src.education.map((e) => ({ id: makeId(), institution: e.institution || '', degree: e.degree || '', startDate: e.startDate || e.start_date || '', endDate: e.endDate || e.end_date || e.graduationYear || e.graduation_date || '', score: e.gpa || e.score || '', scoreLabel: e.scoreLabel || e.score_label || 'CGPA', coursework: e.coursework || '' }))
                : [{ id: makeId(), institution: '', degree: '', startDate: '', endDate: '', score: '', scoreLabel: 'CGPA', coursework: '' }],
              projects: mappedProjects,
              certifications: mappedCerts,
            });
          }
        }
        window.sessionStorage.removeItem('ResumeLab-imported-resume');
        window.sessionStorage.removeItem('ResumeLab-imported-raw-text');
        return;
      }

      // Restore saved state
      const saved = window.sessionStorage.getItem('ResumeLab-editor2-state');
      if (saved) { const d = JSON.parse(saved); if (d?.personal) setData(d); }
    } catch {}
  }, [searchParams]);

  useEffect(() => {
    const hasContent = data.personal.fullName || data.personal.email || data.experience.some((e) => e.company);
    if (!hasContent) return;
    try { window.sessionStorage.setItem('ResumeLab-editor2-state', JSON.stringify(data)); } catch {}
  }, [data]);

  useEffect(() => {
    if (!showDownloadMenu) return;
    const handleClickOutside = (e) => {
      const isInsideMenu = e.target.closest('[data-download-menu]');
      if (!isInsideMenu) setShowDownloadMenu(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
  }, [showDownloadMenu]);

  const previewData = useMemo(() => ({
    name: data.personal.fullName || 'Your Name',
    email: data.personal.email || '',
    phone: data.personal.phone || '',
    github: data.personal.github || '',
    linkedin: data.personal.linkedin || '',
    skills_categories: data.skills.map((s) => ({ category_label: s.category, skills_list: s.items.filter(Boolean).join(', ') })),
    experience: data.experience.map((e) => ({ company: e.company, location: e.location, role: e.role, start_date: e.startDate, end_date: e.endDate, bullets: e.bullets.filter(Boolean), tools_used: e.toolsUsed })),
    education: data.education.map((e) => ({ institution: e.institution, degree: e.degree, start_date: e.startDate, end_date: e.endDate, score: e.score, score_label: e.scoreLabel, graduation_date: e.endDate, coursework: e.coursework })),
    projects: data.projects.map((p) => ({ project_name: p.name, year: p.year, description: p.description, technologies: p.technologies })),
    certifications: data.certifications.map((c) => ({ cert_title: c.title, issuer: c.issuer, cert_description: c.description })),
    _templateId: '2',
  }), [data]);

  const handleDownload = async () => {
    if (downloading) return;
    setLoadingText('Downloading...');
    setDownloading(true);
    setShowDownloadMenu(false);
    try {
      const res = await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(previewData) });
      if (res.status === 429) { setDownloading(false); setConfirmModal({ message: "You're going too fast! Please wait a moment before trying again.", onConfirm: () => setConfirmModal(null), singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' }); return; }
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'resume.pdf'; a.click();
      URL.revokeObjectURL(url);
      try { const { data: { session } } = await supabase.auth.getSession(); if (session?.access_token) { fetch('/api/saved-resumes', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ name: data.personal.fullName || 'My Resume', template_id: '2', resume_data: previewData }) }); } } catch {}
    } catch (err) { console.error(err); window.alert('PDF generation failed. Please try again.'); }
    finally { setDownloading(false); }
  };

  const handleDownloadDocx = async () => {
    if (downloading) return;
    setDownloading(true);
    setShowDownloadMenu(false);
    try {
      const res = await fetch('/api/resume-docx', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(previewData) });
      if (res.status === 429) { setDownloading(false); setConfirmModal({ message: "You're going too fast! Please wait a moment before trying again.", onConfirm: () => setConfirmModal(null), singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' }); return; }
      if (!res.ok) throw new Error('DOCX generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'resume.docx'; a.click();
      URL.revokeObjectURL(url);
      setShowSuccess(true); setTimeout(() => setShowSuccess(false), 1200);
      try { const { data: { session } } = await supabase.auth.getSession(); if (session?.access_token) { fetch('/api/saved-resumes', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ name: data.personal.fullName || 'My Resume', template_id: '2', resume_data: previewData }) }); } } catch {}
    } catch (err) { console.error(err); window.alert('DOCX generation failed. Please try again.'); }
    finally { setDownloading(false); }
  };

  const handleEnhanceAll = () => {
    if (hasFormatErrors2(data.personal)) {
      setConfirmModal({ message: 'Please fix the highlighted fields before proceeding.', onConfirm: () => setConfirmModal(null), singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' });
      return;
    }
    // Check if enhanceable fields have content
    const hasBullets = data.experience.some((e) => e.bullets.some((b) => b.trim()));
    const hasProjectDesc = data.projects.some((p) => p.description?.trim());
    const hasCertDesc = data.certifications.some((c) => c.description?.trim());
    const hasCoursework = data.education.some((e) => e.coursework?.trim());

    const missing = [];
    if (!hasBullets) missing.push('Experience bullets');
    if (!hasProjectDesc) missing.push('Project descriptions');
    if (!hasCertDesc) missing.push('Certification descriptions');
    if (!hasCoursework) missing.push('Coursework');

    if (missing.length > 0) {
      setConfirmModal({ message: `Please fill in the following fields before enhancing: ${missing.join(', ')}.`, onConfirm: () => setConfirmModal(null), singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' });
      return;
    }

    setConfirmModal({
      message: 'This will enhance the following sections with AI: Experience bullets, Project descriptions, Certification descriptions, and Coursework.',
      onConfirm: () => { setConfirmModal(null); runEnhanceAll(); },
      confirmText: 'Proceed',
      confirmColor: 'bg-[#10b981]',
    });
  };

  const runEnhanceAll = async () => {
    setLoadingText('Enhancing...');
    setDownloading(true);
    try {
      const payload = {
        experience: data.experience.map((e) => ({ bullets: e.bullets.filter(Boolean) })),
        projects: data.projects.map((p) => ({ description: p.description || '' })),
        certifications: data.certifications.map((c) => ({ description: c.description || '' })),
        education: data.education.map((e) => ({ coursework: e.coursework || '' })),
      };
      const res = await fetch('/api/ai-enhance-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.status === 429) { setDownloading(false); setConfirmModal({ message: "You're going too fast! Please wait a moment before trying again.", onConfirm: () => setConfirmModal(null), singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' }); return; }
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Enhancement failed');
      const enhanced = result.enhanced;
      if (!enhanced) throw new Error('No enhanced data returned');
      setData((prev) => {
        const next = { ...prev };
        if (Array.isArray(enhanced.experience)) {
          next.experience = prev.experience.map((exp, i) => {
            const e = enhanced.experience.find((x) => x.index === i);
            return e && Array.isArray(e.bullets) ? { ...exp, bullets: e.bullets } : exp;
          });
        }
        if (Array.isArray(enhanced.projects)) {
          next.projects = prev.projects.map((proj, i) => {
            const p = enhanced.projects.find((x) => x.index === i);
            return p && p.description ? { ...proj, description: p.description } : proj;
          });
        }
        if (Array.isArray(enhanced.certifications)) {
          next.certifications = prev.certifications.map((cert, i) => {
            const c = enhanced.certifications.find((x) => x.index === i);
            return c && c.description ? { ...cert, description: c.description } : cert;
          });
        }
        if (Array.isArray(enhanced.education)) {
          next.education = prev.education.map((edu, i) => {
            const e = enhanced.education.find((x) => x.index === i);
            return e && e.coursework ? { ...edu, coursework: e.coursework } : edu;
          });
        }
        return next;
      });
    } catch (err) { console.error(err); window.alert('AI enhancement is temporarily unavailable. Please try again.'); }
    finally { setDownloading(false); }
  };

  const hasEmptyFields = () => {
    const p = data.personal;
    if (!p.fullName.trim() || !p.email.trim() || !p.phone.trim()) return true;
    if (data.skills.some((s) => !s.category.trim())) return true;
    if (data.experience.some((e) => !e.company.trim() || !e.role.trim())) return true;
    if (data.education.some((e) => !e.institution.trim() || !e.degree.trim())) return true;
    if (data.projects.some((pr) => !pr.name.trim())) return true;
    if (data.certifications.some((c) => !c.title.trim())) return true;
    return false;
  };

  const handleNext = () => {
    setShowErrors(true);
    setStep((p) => Math.min(p + 1, steps.length - 1));
  };

  const handleDownloadWithValidation = async (downloadFn, actionType) => {
    if (!requireAuth(actionType || 'pdf')) return;
    if (hasFormatErrors2(data.personal)) {
      setConfirmModal({ message: 'Please fix the highlighted fields before proceeding.', onConfirm: () => setConfirmModal(null), singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' });
      return;
    }
    if (hasEmptyFields()) {
      setShowErrors(true);
      setConfirmModal({ message: 'Some fields are empty. Please fill all required details before downloading.', onConfirm: () => { setConfirmModal(null); }, singleButton: true, confirmText: 'OK', confirmColor: 'bg-[#6C63FF]' });
      return;
    }
    setShowErrors(false);

    // Check payment status
    try {
      const access = await checkDownloadAccess();
      if (!access.canDownload && !access.isPaid) {
        setConfirmModal({
          message: 'Your free download has been used. Upgrade to unlimited downloads for just ₹19.',
          onConfirm: async () => {
            setConfirmModal(null);
            setLoadingText('Processing...');
            setDownloading(true);
            try {
              const result = await initiatePayment();
              setDownloading(false);
              if (result.paid || result.alreadyPaid) {
                downloadFn();
              }
            } catch (err) {
              setDownloading(false);
              if (err.message !== 'Payment cancelled') {
                window.alert('Payment failed. Please try again.');
              }
            }
          },
          confirmText: 'Pay ₹19',
          confirmColor: 'bg-[#10b981]',
        });
        return;
      }
    } catch {}

    downloadFn();
  };

  const sections = [    // Personal Info
    <Card key="personal" title="Personal Information" description="Your name and contact details.">
      <div className="grid gap-[12px]">
        <Input label="Full Name" value={data.personal.fullName} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, fullName: v } }))} placeholder="Ashish Pratap Singh" error={(showErrors && !data.personal.fullName.trim()) || (data.personal.fullName.trim() && !isValidName(data.personal.fullName))} maxLength={60} />
        <Input label="Email" value={data.personal.email} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, email: v } }))} placeholder="your@email.com" error={(showErrors && !data.personal.email.trim()) || (data.personal.email.trim() && !isValidEmail(data.personal.email))} maxLength={80} />
        <Input label="Phone" value={data.personal.phone} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, phone: v } }))} placeholder="+91 XXXXXXXXXX" error={data.personal.phone.trim() && !isValidPhone(data.personal.phone)} maxLength={20} />
        <Input label="GitHub" value={data.personal.github} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, github: v } }))} placeholder="github.com/username" maxLength={120} />
        <Input label="LinkedIn" value={data.personal.linkedin} onChange={(v) => setData((p) => ({ ...p, personal: { ...p.personal, linkedin: v } }))} placeholder="linkedin.com/in/username" error={data.personal.linkedin.trim() && !isValidLinkedIn(data.personal.linkedin)} maxLength={120} />
      </div>
    </Card>,

    // Skills
    <Card key="skills" title="Skills" description="Technical skills grouped by category.">
      <div className="grid gap-[12px]">
        {data.skills.map((g, gi) => (
          <div key={g.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button type="button" onClick={() => setData((p) => ({ ...p, skills: removeItem(p.skills, gi) }))} className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 transition-colors" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
            <div className="grid gap-[10px]">
              <Input label={`Category ${gi + 1}`} value={g.category} onChange={(v) => setData((p) => ({ ...p, skills: updateItem(p.skills, gi, (item) => ({ ...item, category: v })) }))} placeholder="Languages" error={showErrors && !g.category.trim()} maxLength={50} />
              <Input label="Skills (comma separated)" value={g.items.join(', ')} onChange={(v) => setData((p) => ({ ...p, skills: updateItem(p.skills, gi, (item) => ({ ...item, items: v.split(',').map((s) => s.trim()) })) }))} placeholder="Java, Python, JavaScript, TypeScript" maxLength={300} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setData((p) => ({ ...p, skills: addItem(p.skills, { id: makeId(), category: '', items: [''] }) }))} className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white">Add Category</button>
      </div>
    </Card>,

    // Work Experience
    <Card key="experience" title="Work Experience" description="Your professional experience.">
      <div className="grid gap-[12px]">
        {data.experience.map((exp, ei) => (
          <div key={exp.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button type="button" onClick={() => setConfirmModal({ message: 'Delete this experience?', onConfirm: () => setData((p) => ({ ...p, experience: removeItem(p.experience, ei) })) })} className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 transition-colors" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
            <div className="grid gap-[10px]">
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Company" value={exp.company} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, company: v })) }))} placeholder="Adobe" error={showErrors && !exp.company.trim()} maxLength={80} />
                <Input label="Location" value={exp.location} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, location: v })) }))} placeholder="Bangalore" maxLength={60} />
              </div>
              <Input label="Role" value={exp.role} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, role: v })) }))} placeholder="Computer Scientist" error={showErrors && !exp.role.trim()} maxLength={80} />
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Start Date" value={exp.startDate} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, startDate: v })) }))} placeholder="Mar 2021" maxLength={20} />
                <Input label="End Date" value={exp.endDate} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, endDate: v })) }))} placeholder="Present" maxLength={20} />
              </div>
              <span className="text-[12px] font-semibold text-black">Bullet Points</span>
              {exp.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-[8px]">
                  <input value={b} onChange={(e) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, bullets: updateItem(item.bullets, bi, () => e.target.value) })) }))} placeholder="Achievement or responsibility" maxLength={300} className="h-[44px] flex-1 rounded-[12px] border border-[color:#e5e7eb] px-[14px] text-[14px] outline-none focus:border-[color:var(--purple)]" />
                  <button type="button" onClick={() => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, bullets: removeItem(item.bullets, bi) })) }))} className="flex h-[36px] w-[36px] items-center justify-center rounded-[12px] border border-[color:#e5e7eb] text-[#666] hover:text-red-500 transition-colors" aria-label="Remove">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, bullets: addItem(item.bullets, '') })) }))} className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-dashed border-[color:#cfc8ff] bg-[rgba(108,99,255,0.04)] text-[color:var(--purple)]" aria-label="Add bullet"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
              <Input label="Tools / Technologies Used" value={exp.toolsUsed} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, toolsUsed: v })) }))} placeholder="AWS, EC2, S3, Kafka, Docker" maxLength={150} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setData((p) => ({ ...p, experience: addItem(p.experience, { id: makeId(), company: '', location: '', role: '', startDate: '', endDate: '', bullets: [''], toolsUsed: '' }) }))} className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white">Add Experience</button>
      </div>
    </Card>,

    // Education
    <Card key="education" title="Education" description="Academic background.">
      <div className="grid gap-[12px]">
        {data.education.map((edu, ei) => (
          <div key={edu.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button type="button" onClick={() => setConfirmModal({ message: 'Delete this education?', onConfirm: () => setData((p) => ({ ...p, education: removeItem(p.education, ei) })) })} className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 transition-colors" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
            <div className="grid gap-[10px]">
              <Input label="Institution" value={edu.institution} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, institution: v })) }))} placeholder="BITS Hyderabad" error={showErrors && !edu.institution.trim()} maxLength={100} />
              <Input label="Degree" value={edu.degree} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, degree: v })) }))} placeholder="B.E. in Computer Science" error={showErrors && !edu.degree.trim()} maxLength={100} />
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Start Date" value={edu.startDate} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, startDate: v })) }))} placeholder="Aug 2013" maxLength={20} />
                <Input label="End Date" value={edu.endDate} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, endDate: v })) }))} placeholder="Jun 2017" maxLength={20} />
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Score Label" value={edu.scoreLabel} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, scoreLabel: v })) }))} placeholder="CGPA" maxLength={20} />
                <Input label="Score" value={edu.score} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, score: v })) }))} placeholder="7.96/10" maxLength={20} />
              </div>
              <TextArea label="Relevant Coursework" value={edu.coursework} onChange={(v) => setData((p) => ({ ...p, education: updateItem(p.education, ei, (item) => ({ ...item, coursework: v })) }))} placeholder="Data Structures, Algorithms, Machine Learning..." rows={2} maxLength={300} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setData((p) => ({ ...p, education: addItem(p.education, { id: makeId(), institution: '', degree: '', startDate: '', endDate: '', score: '', scoreLabel: 'CGPA', coursework: '' }) }))} className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white">Add Education</button>
      </div>
    </Card>,

    // Projects
    <Card key="projects" title="Project Work" description="Key projects with descriptions.">
      <div className="grid gap-[12px]">
        {data.projects.map((proj, pi) => (
          <div key={proj.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button type="button" onClick={() => setConfirmModal({ message: 'Delete this project?', onConfirm: () => setData((p) => ({ ...p, projects: removeItem(p.projects, pi) })) })} className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 transition-colors" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
            <div className="grid gap-[10px]">
              <div className="grid grid-cols-[1fr_auto] gap-[10px]">
                <Input label="Project Name" value={proj.name} onChange={(v) => setData((p) => ({ ...p, projects: updateItem(p.projects, pi, (item) => ({ ...item, name: v })) }))} placeholder="Word Lookup Dictionary" error={showErrors && !proj.name.trim()} maxLength={100} />
                <Input label="Year" value={proj.year} onChange={(v) => setData((p) => ({ ...p, projects: updateItem(p.projects, pi, (item) => ({ ...item, year: v })) }))} placeholder="2015" maxLength={20} />
              </div>
              <TextArea label="Description" value={proj.description} onChange={(v) => setData((p) => ({ ...p, projects: updateItem(p.projects, pi, (item) => ({ ...item, description: v })) }))} placeholder="Developed a desktop software for online lookup..." rows={3} maxLength={300} />
              <Input label="Technologies" value={proj.technologies} onChange={(v) => setData((p) => ({ ...p, projects: updateItem(p.projects, pi, (item) => ({ ...item, technologies: v })) }))} placeholder="Python, BeautifulSoup, C++" maxLength={150} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setData((p) => ({ ...p, projects: addItem(p.projects, { id: makeId(), name: '', year: '', description: '', technologies: '' }) }))} className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white">Add Project</button>
      </div>
    </Card>,

    // Certifications
    <Card key="certifications" title="Awards & Certificates" description="Certifications and achievements.">
      <div className="grid gap-[12px]">
        {data.certifications.map((cert, ci) => (
          <div key={cert.id} className="relative rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <button type="button" onClick={() => setData((p) => ({ ...p, certifications: removeItem(p.certifications, ci) }))} className="absolute right-[8px] top-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[#666] hover:text-red-500 transition-colors" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
            <div className="grid gap-[10px]">
              <Input label="Title" value={cert.title} onChange={(v) => setData((p) => ({ ...p, certifications: updateItem(p.certifications, ci, (item) => ({ ...item, title: v })) }))} placeholder="Mentor at Scaler Academy" error={showErrors && !cert.title.trim()} maxLength={120} />
              <Input label="Issuer" value={cert.issuer} onChange={(v) => setData((p) => ({ ...p, certifications: updateItem(p.certifications, ci, (item) => ({ ...item, issuer: v })) }))} placeholder="Scaler" maxLength={80} />
              <TextArea label="Description (optional)" value={cert.description} onChange={(v) => setData((p) => ({ ...p, certifications: updateItem(p.certifications, ci, (item) => ({ ...item, description: v })) }))} placeholder="Helping students get better at problem solving..." rows={2} maxLength={300} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setData((p) => ({ ...p, certifications: addItem(p.certifications, { id: makeId(), title: '', issuer: '', description: '' }) }))} className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[16px] py-[12px] text-[14px] font-bold text-white">Add Certification</button>
      </div>
    </Card>,
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] text-black" style={{ overscrollBehavior: 'none' }}>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1280px] flex-col gap-[12px] px-[8px] pb-[12px] pt-[8px] md:px-[16px] lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <div className={`${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'} flex-1 flex-col gap-[12px] pb-[132px] md:gap-[14px] md:pb-0`}>
          <div className="rounded-[22px] border border-[color:rgba(229,231,235,0.95)] bg-white p-[10px] shadow-[0_10px_26px_rgba(17,24,39,0.06)] md:p-[16px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-center">
                <div className="rounded-full bg-[rgba(16,185,129,0.12)] px-[12px] py-[6px] text-[12px] font-bold uppercase text-[#10b981]">ATS FRIENDLY</div>
              </div>
              <div className="flex items-center gap-[8px]">
                <button type="button" onClick={() => setMobileView('form')} className={`flex-1 rounded-full px-[12px] py-[10px] text-[12px] font-bold ${mobileView === 'form' ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white' : 'bg-[rgba(108,99,255,0.08)] text-[color:var(--purple)]'}`}>Edit</button>
                <button type="button" onClick={() => setMobileView('preview')} className={`flex-1 rounded-full px-[12px] py-[10px] text-[12px] font-bold ${mobileView === 'preview' ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white' : 'bg-[rgba(108,99,255,0.08)] text-[color:var(--purple)]'}`}>Preview</button>
                {/* 3-dot menu */}
                <div className="relative">
                  <button type="button" onClick={() => setShowMoreMenu((v) => !v)} className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#f4f4f6] shadow-[0_4px_12px_rgba(17,24,39,0.06)]" aria-label="More options">
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-black"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                  </button>
                  {showMoreMenu && (
                    <>
                      <div className="fixed inset-0 z-[49]" onClick={() => setShowMoreMenu(false)} />
                      <div className="absolute right-0 top-[46px] z-[50] w-[200px] rounded-[14px] border border-[color:#eceef2] bg-white py-[6px] shadow-[0_12px_32px_rgba(17,24,39,0.14)]">
                        <button type="button" onClick={() => { setShowMoreMenu(false); setMobileView('preview'); }} className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f8f8fa]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                          Preview Resume
                        </button>
                        <button type="button" onClick={() => { setShowMoreMenu(false); setTimeout(() => setShowDownloadMenu(true), 50); }} className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f8f8fa]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Export Resume
                        </button>
                        <button type="button" className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-[#aaa] cursor-default">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          Duplicate Resume
                        </button>
                        <div className="my-[4px] border-t border-[color:#eceef2]" />
                        <button type="button" onClick={() => { setShowMoreMenu(false); setConfirmModal({ message: 'This will delete all your resume data. This action cannot be undone.', onConfirm: () => { setData(initialData); try { window.sessionStorage.removeItem('ResumeLab-editor2-state'); } catch {} } }); }} className="flex w-full items-center gap-[10px] px-[14px] py-[10px] text-[13px] font-medium text-red-500 hover:bg-red-50">
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
                <button type="button" onClick={() => router.push(`/template-details?template=2`)} className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#f4f4f6]" aria-label="Close">
                  <svg viewBox="0 0 24 24" className="h-[16px] w-[16px] fill-none stroke-black stroke-[2.4]"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Step tabs */}
          <div ref={stepRailRef} className="flex gap-[8px] overflow-x-auto pb-[4px] [scrollbar-width:none]">
            {steps.map((label, index) => (
              <button key={label} type="button" onClick={() => setStep(index)} className={`whitespace-nowrap rounded-full px-[14px] py-[8px] text-[12px] font-bold ${step === index ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white' : 'bg-white text-black shadow-[0_6px_16px_rgba(17,24,39,0.06)]'}`}>{label}</button>
            ))}
          </div>

          <div className="flex-1">{sections[step]}</div>

          <div className="flex items-center justify-between gap-[12px] pt-[4px]">
            <button type="button" onClick={() => setStep((p) => Math.max(p - 1, 0))} disabled={step === 0} className="rounded-[14px] border border-[color:#e5e7eb] bg-white px-[16px] py-[12px] text-[14px] font-bold text-black disabled:opacity-50">Previous</button>
            <button type="button" onClick={handleNext} className="rounded-[14px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[18px] py-[12px] text-[14px] font-bold text-white">Next</button>
          </div>
          <div className="mt-[8px] rounded-[16px] border border-[color:#b7d9ef] bg-[linear-gradient(180deg,#eef8ff_0%,#dcefff_100%)] px-[14px] py-[12px] shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
            <div className="flex items-start gap-[10px]">
              <div className="mt-[1px] flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[14px] font-black text-[#3aa0d8] shadow-[0_6px_14px_rgba(17,24,39,0.05)]">i</div>
              <div>
                <div className="text-[11px] font-black tracking-[0.08em] text-[#2291c8]">PRO TIP</div>
                <p className="mt-[4px] text-[12px] leading-[1.45] text-[#46606f]">
                  {step === 0 && 'Keep your name and contact details consistent across your resume, LinkedIn, and portfolio.'}
                  {step === 1 && 'Group skills by category and use keywords from job descriptions to pass ATS filters.'}
                  {step === 2 && 'Start each bullet with a strong action verb and include measurable results.'}
                  {step === 3 && 'List your most recent education first and include relevant coursework if applicable.'}
                  {step === 4 && 'Mention the problem, tools used, and outcome for each project.'}
                  {step === 5 && 'Include the exact credential name and issuer for maximum ATS clarity.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div className={`${mobileView === 'form' ? 'hidden lg:block' : 'block'} lg:sticky lg:top-[16px] lg:h-[calc(100vh-32px)]`}>
          <div className="flex h-full flex-col rounded-[22px] border border-[color:rgba(229,231,235,0.95)] bg-white p-[12px] shadow-[0_10px_26px_rgba(17,24,39,0.06)]">
            <div className="mb-[12px] flex items-center justify-center relative">
              <span className="text-[18px] font-bold text-black">PREVIEW</span>
              <button type="button" onClick={() => setMobileView('form')} className="absolute right-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[18px] text-black lg:hidden">×</button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[4px] border border-black bg-[#f4f4f6]">
              <div className="flex h-full flex-col bg-white">
                <div className="min-h-0 flex-1 overflow-auto">
                  <Template2Preview data={previewData} previewMode />
                </div>
              </div>
              {/* Watermark overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
                <div className="flex flex-col gap-[60px] -rotate-[30deg] opacity-[0.07]">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-[40px]">
                      {[...Array(3)].map((_, j) => (
                        <span key={j} className="whitespace-nowrap text-[28px] font-black tracking-wider text-black">ResumeLab</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-[8px] text-center text-[10px] text-[#aaa]">Download to remove watermark</p>
            <p className="mt-[4px] text-center text-[11px] text-[#888] md:hidden">✦ Tap Enhance All to make every bullet professional and recruiter-ready.</p>
            <div className="mt-[4px] hidden shrink-0 md:block">
              <p className="mb-[4px] text-center text-[11px] text-[#888]">✦ Tap Enhance All to make every bullet professional and recruiter-ready.</p>
              <button type="button" onClick={handleEnhanceAll} disabled={downloading} className="mb-[8px] w-full rounded-full border border-[color:#d8d2ff] bg-white py-[10px] text-[13px] font-semibold text-[color:var(--purple)] disabled:opacity-70">Enhance All</button>
              <div className="relative" ref={downloadMenuRef} data-download-menu>
                <button type="button" onClick={() => setShowDownloadMenu((v) => !v)} disabled={downloading} className="w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[10px] text-[13px] font-semibold text-white disabled:opacity-70">{downloading ? 'Generating...' : 'Download'}</button>
                {showDownloadMenu && (
                  <div className="absolute bottom-full left-0 right-0 z-[100] mb-[6px] overflow-hidden rounded-[12px] border border-[color:#e5e7eb] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                    <button type="button" onClick={() => handleDownloadWithValidation(handleDownload, 'pdf')} className="flex w-full items-center gap-[8px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f4f4f6] transition-colors">
                      <span className="text-[15px]">📄</span> Download as .pdf
                    </button>
                    <button type="button" onClick={() => handleDownloadWithValidation(handleDownloadDocx, 'docx')} className="flex w-full items-center gap-[8px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f4f4f6] transition-colors">
                      <span className="text-[15px]">📝</span> Download as .docx
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {mobileView === 'preview' && (
      <div className="fixed bottom-[72px] left-0 right-0 z-[55] px-[12px] md:hidden">
        <div className="mx-auto max-w-[480px] rounded-[14px] border border-[#e5e7eb] bg-white px-[14px] py-[10px] text-center text-[12px] text-[#666] shadow-[0_4px_12px_rgba(17,24,39,0.04)]">Check each section in Edit mode — imported data may need manual adjustments.</div>
      </div>
      )}

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[color:#eceef2] bg-white px-[12px] pb-[12px] pt-[10px] shadow-[0_-10px_24px_rgba(17,24,39,0.08)] md:hidden">
        <div className="mx-auto flex max-w-[480px] items-center gap-[10px]">
          <button type="button" onClick={handleEnhanceAll} disabled={downloading} className="h-[42px] flex-1 rounded-full border border-[color:#d8d2ff] bg-white px-[14px] text-[12px] font-semibold text-[color:var(--purple)] disabled:opacity-70">Enhance All</button>
          <div className="relative flex-[1.35]" data-download-menu>
            <button type="button" onClick={() => setShowDownloadMenu((v) => !v)} disabled={downloading} className="h-[42px] w-full rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[14px] text-[12px] font-semibold text-white disabled:opacity-70">{downloading ? 'Generating...' : 'Download'}</button>
            {showDownloadMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-[6px] overflow-hidden rounded-[12px] border border-[color:#e5e7eb] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
                <button type="button" onClick={() => handleDownloadWithValidation(handleDownload, 'pdf')} className="flex w-full items-center gap-[8px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f4f4f6] transition-colors">
                  <span className="text-[15px]">📄</span> .pdf
                </button>
                <button type="button" onClick={() => handleDownloadWithValidation(handleDownloadDocx, 'docx')} className="flex w-full items-center gap-[8px] px-[14px] py-[10px] text-[13px] font-medium text-black hover:bg-[#f4f4f6] transition-colors">
                  <span className="text-[15px]">📝</span> .docx
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {downloading && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <img src="/images/loading-star.png" alt="" className="h-[60px] w-[60px] animate-spin" />
            <p className="mt-[16px] text-[15px] font-semibold text-black animate-pulse">{loadingText}</p>
          </div>
        </div>
      )}
      <style jsx>{`@keyframes successPop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}`}</style>

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-[16px]">
          <div className="w-full max-w-[320px] rounded-[20px] bg-white p-[24px] shadow-[0_20px_50px_rgba(17,24,39,0.18)]">
            <h3 className="text-[16px] font-bold text-black">Are you sure?</h3>
            <p className="mt-[6px] text-[13px] text-[#666]">{confirmModal.message}</p>
            <div className="mt-[20px] flex gap-[10px]">
              {!confirmModal.singleButton && <button type="button" onClick={() => setConfirmModal(null)} className="flex-1 rounded-[12px] border border-[color:#e5e7eb] bg-white py-[10px] text-[13px] font-semibold text-black">Cancel</button>}
              <button type="button" onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }} className={`flex-1 rounded-[12px] py-[10px] text-[13px] font-semibold text-white ${confirmModal.confirmColor || 'bg-red-500'}`}>{confirmModal.confirmText || 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
