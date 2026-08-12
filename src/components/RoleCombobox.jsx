'use client';
import { useState, useRef, useEffect } from 'react';
import { rolesList } from '../lib/ats-keywords-data';

export default function RoleCombobox({ value, onChange, placeholder = 'e.g. Frontend Developer' }) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(rolesList);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const q = value.toLowerCase().trim();
    if (!q) { setFiltered(rolesList); return; }
    setFiltered(rolesList.filter(r => r.toLowerCase().includes(q)));
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="h-[44px] w-full rounded-[12px] border border-[color:#e5e7eb] bg-white px-[14px] text-[14px] text-black outline-none focus:border-[color:var(--purple)]"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-[48px] z-[100] max-h-[200px] overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.1)]">
          {filtered.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => { onChange(role); setOpen(false); }}
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
