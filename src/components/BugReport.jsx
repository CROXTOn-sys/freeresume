'use client';

import { useState, useRef } from 'react';

const issueTypes = ['Website Bug', 'Content Issue', 'Feature Request', 'Template Request', 'Other'];

export default function BugReport() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const reset = () => {
    setType('');
    setDescription('');
    setSteps('');
    setFiles([]);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!type || !description.trim()) return;
    setSubmitting(true);
    try {
      // Send to N8N webhook (configure URL in env)
      const webhookUrl = process.env.NEXT_PUBLIC_BUG_REPORT_WEBHOOK || '';
      if (webhookUrl) {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('description', description);
        formData.append('steps', steps);
        formData.append('url', window.location.href);
        formData.append('userAgent', navigator.userAgent);
        files.forEach((f, i) => formData.append(`file_${i}`, f));
        await fetch(webhookUrl, { method: 'POST', body: formData });
      }
      setSubmitted(true);
      setTimeout(() => { setOpen(false); reset(); }, 1500);
    } catch (err) {
      console.error('Bug report failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []).filter((f) => f.size <= 10 * 1024 * 1024);
    setFiles((prev) => [...prev, ...selected].slice(0, 3));
  };

  return (
    <>
      {/* Floating bug button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[90px] right-[16px] z-[95] flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] shadow-[0_6px_20px_rgba(108,99,255,0.35)]"
        aria-label="Report a bug"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1"/>
          <path d="M12 20c-3.3 0-6-2.7-6-6v-3a6 6 0 0112 0v3c0 3.3-2.7 6-6 6z"/>
          <path d="M12 20v2M6 13H2M22 13h-4M6 17H4M20 17h-2M6 9H4M20 9h-2"/>
        </svg>
      </button>

      {/* Report form modal */}
      {open && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center sm:items-center px-[12px] pb-[12px] sm:pb-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => { setOpen(false); reset(); }} />
          <div className="relative w-full max-w-[400px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-[#1a1a2e] p-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-[18px]">
              <div className="flex items-center gap-[10px]">
                <span className="text-[22px]">👋</span>
                <h3 className="text-[18px] font-bold text-white">Report Issue</h3>
              </div>
              <button
                type="button"
                onClick={() => { setOpen(false); reset(); }}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#2a2a3e] text-[14px] text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center py-[30px]">
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#10b981]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="mt-[12px] text-[14px] font-semibold text-white">Report submitted!</p>
              </div>
            ) : (
              <>
                {/* Type */}
                <div className="mb-[14px]">
                  <label className="mb-[6px] block text-[12px] font-semibold text-white/80">Type <span className="text-red-400">*</span></label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-[42px] w-full appearance-none rounded-[10px] border border-[#3a3a50] bg-[#2a2a3e] px-[12px] text-[13px] text-white outline-none focus:border-[#6C63FF]"
                  >
                    <option value="" disabled>Select issue type</option>
                    {issueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div className="mb-[14px]">
                  <label className="mb-[6px] block text-[12px] font-semibold text-white/80">Detailed Description <span className="text-red-400">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail"
                    rows={3}
                    className="w-full rounded-[10px] border border-[#3a3a50] bg-[#2a2a3e] px-[12px] py-[10px] text-[13px] text-white placeholder-white/40 outline-none focus:border-[#6C63FF]"
                  />
                </div>

                {/* Steps */}
                <div className="mb-[14px]">
                  <label className="mb-[6px] block text-[12px] font-semibold text-white/80">Steps to Reproduce (if any)</label>
                  <textarea
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    placeholder="Provide steps to reproduce the issue"
                    rows={2}
                    className="w-full rounded-[10px] border border-[#3a3a50] bg-[#2a2a3e] px-[12px] py-[10px] text-[13px] text-white placeholder-white/40 outline-none focus:border-[#6C63FF]"
                  />
                </div>

                {/* Attachments */}
                <div className="mb-[18px]">
                  <label className="mb-[6px] block text-[12px] font-semibold text-white/80">Attachments (Screenshots / Video Recording if any)</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center gap-[8px] rounded-[10px] border-[1.5px] border-dashed border-[#3a3a50] bg-[#2a2a3e] px-[16px] py-[20px] hover:border-[#6C63FF] transition-colors"
                  >
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#3a3a50]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <p className="text-[12px] text-white/60">Click to choose a file or drag here</p>
                    <p className="text-[10px] text-white/40">Images or videos (max 10MB each)</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFiles} />
                  {files.length > 0 && (
                    <div className="mt-[8px] flex flex-wrap gap-[6px]">
                      {files.map((f, i) => (
                        <span key={i} className="rounded-full bg-[#3a3a50] px-[8px] py-[3px] text-[10px] text-white/70">{f.name.slice(0, 20)}{f.name.length > 20 ? '...' : ''}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!type || !description.trim() || submitting}
                  className="w-full rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] py-[12px] text-[14px] font-bold text-white disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
