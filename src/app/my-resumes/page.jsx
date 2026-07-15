'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Template1Preview from '../../components/template-previews/Template1Preview';
import Template2Preview from '../../components/template-previews/Template2Preview';

export default function MyResumesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { router.push('/auth/login'); return; }
      setUser(data.user);
      fetchResumes(data.user);
    });
  }, []);

  const fetchResumes = async (currentUser) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/saved-resumes', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const result = await res.json();
      if (result.resumes) setResumes(result.resumes);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const openResume = async (resume) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/saved-resumes/${resume.id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const result = await res.json();
      if (result.resume) setSelectedResume(result.resume);
    } catch (err) {
      console.error('Failed to load resume:', err);
    }
  };

  const handleDownload = async (format = 'pdf') => {
    if (!selectedResume || downloading) return;
    setDownloading(true);
    try {
      const endpoint = format === 'docx' ? '/api/resume-docx' : '/api/resume';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedResume.resume_data),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      window.alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this saved resume?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`/api/saved-resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (selectedResume?.id === id) setSelectedResume(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Preview view
  if (selectedResume) {
    const data = selectedResume.resume_data;
    const templateId = selectedResume.template_id;
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[100px] pt-[24px]">
        <div className="mx-auto w-full max-w-[520px]">
          <button type="button" onClick={() => setSelectedResume(null)} className="mb-[16px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <h1 className="text-[20px] font-bold text-black mb-[16px]">{selectedResume.name}</h1>
          <div className="rounded-[4px] border border-black bg-white overflow-hidden">
            {templateId === '2' ? <Template2Preview data={data} previewMode /> : <Template1Preview data={data} previewMode />}
          </div>
          <div className="mt-[16px] flex gap-[10px]">
            <button type="button" onClick={() => handleDownload('pdf')} disabled={downloading} className="flex-1 rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-semibold text-white disabled:opacity-70">
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
            <button type="button" onClick={() => handleDownload('docx')} disabled={downloading} className="flex-1 rounded-full border border-[#6C63FF] py-[12px] text-[14px] font-semibold text-[#6C63FF] disabled:opacity-70">
              Download DOCX
            </button>
          </div>
        </div>
      </main>
    );
  }

  // List view
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] px-[16px] pb-[40px] pt-[24px]">
      <div className="mx-auto w-full max-w-[520px]">
        <button type="button" onClick={() => router.back()} className="mb-[20px] flex items-center gap-[8px] text-[14px] font-semibold text-[#6C63FF]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-black">My Resumes</h1>
        <p className="mt-[6px] text-[14px] text-[#666]">Your previously downloaded resumes</p>

        {loading ? (
          <div className="mt-[40px] flex justify-center">
            <img src="/images/loading-star.png" alt="" className="h-[40px] w-[40px] animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="mt-[40px] text-center">
            <p className="text-[14px] text-[#888]">No saved resumes yet. Download a resume to see it here.</p>
          </div>
        ) : (
          <div className="mt-[20px] flex flex-col gap-[12px]">
            {resumes.map((resume, index) => (
              <div key={resume.id} className="flex items-center gap-[12px] rounded-[14px] border border-[#e5e7eb] bg-white p-[14px] shadow-[0_4px_12px_rgba(17,24,39,0.04)]">
                <span className="text-[14px] font-bold text-[#888]">{index + 1}.</span>
                <button type="button" onClick={() => openResume(resume)} className="flex flex-1 items-center gap-[10px] text-left">
                  <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#e5e7eb] bg-[#f9f9fb]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-black">{resume.name}</p>
                    <p className="text-[11px] text-[#888]">Template {resume.template_id} • {new Date(resume.created_at).toLocaleDateString()}</p>
                  </div>
                </button>
                <button type="button" onClick={() => openResume(resume)} className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#e5e7eb] text-[#666] hover:text-[#6C63FF] transition-colors" aria-label="Download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button type="button" onClick={() => handleDelete(resume.id)} className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#e5e7eb] text-[#666] hover:text-red-500 transition-colors" aria-label="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
