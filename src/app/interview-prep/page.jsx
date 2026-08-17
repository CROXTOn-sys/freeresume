'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import interviewData from '../../lib/interview-data';

const categories = [...new Set(interviewData.map((r) => r.category))];

function QuestionAccordion({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#eceef2] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-[12px] px-[16px] py-[14px] text-left transition-colors hover:bg-[rgba(108,99,255,0.03)]"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-medium leading-[1.5] text-[#1a1a2e] md:text-[15px]">{question}</span>
        <svg
          className={`h-[18px] w-[18px] shrink-0 text-[#6C63FF] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-[16px] pb-[16px] pt-[4px]">
            {answer ? (
              <p className="rounded-[12px] bg-[rgba(108,99,255,0.04)] px-[14px] py-[12px] text-[13px] leading-[1.7] text-[#444] md:text-[14px]">
                {answer}
              </p>
            ) : (
              <p className="rounded-[12px] bg-[rgba(245,245,250,0.8)] px-[14px] py-[12px] text-[13px] italic leading-[1.6] text-[#999]">
                Answer coming soon — check back shortly.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleView({ role, onBack }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mx-auto w-full max-w-[720px] animate-[fadeIn_0.2s]">
      <div className="mb-[16px] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-[6px] text-[13px] font-medium text-[#6C63FF] hover:underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Roles
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#666] hover:text-red-500 hover:border-red-200 transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="rounded-[18px] border border-[#eceef2] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.06)]">
        {/* Header */}
        <div className="rounded-t-[18px] bg-[linear-gradient(135deg,#1a1a2e_0%,#2d2b55_100%)] px-[20px] py-[18px]">
          <h2 className="text-[20px] font-bold text-white md:text-[22px]">{role.title}</h2>
          <div className="mt-[6px] flex items-center gap-[10px]">
            <span className="rounded-full bg-[rgba(108,99,255,0.25)] px-[10px] py-[3px] text-[11px] font-semibold text-[#c4c0ff]">
              {role.category}
            </span>
            <span className="text-[12px] font-medium text-[#8b94a7]">{role.salary}</span>
          </div>
        </div>

        {/* Questions */}
        <div>
          {role.questions.map((item, idx) => (
            <QuestionAccordion
              key={idx}
              question={`${idx + 1}. ${item.q}`}
              answer={item.a}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-[24px] rounded-[14px] border border-[#eceef2] bg-[rgba(108,99,255,0.03)] p-[16px] text-center">
        <p className="text-[13px] text-[#555]">Ready to build a resume tailored for this role?</p>
        <Link
          href="/?action=templates"
          className="mt-[10px] inline-block rounded-[12px] bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[20px] py-[10px] text-[13px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Build Resume →
        </Link>
      </div>
    </div>
  );
}

export default function InterviewPrepPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    let list = interviewData;
    if (activeCategory !== 'All') list = list.filter((r) => r.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeCategory]);

  if (selectedRole) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-[16px] py-[24px] md:px-[40px] xl:px-[64px] 2xl:px-[80px] md:py-[40px]">
        <RoleView role={selectedRole} onBack={() => setSelectedRole(null)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="relative bg-[linear-gradient(135deg,#1a1a2e_0%,#2d2b55_100%)] px-[16px] py-[40px] text-center md:py-[56px] xl:py-[64px] 2xl:py-[72px]">
        <Link
          href="/"
          className="absolute right-[16px] top-[16px] flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] text-[#b0b0c8] hover:text-white hover:border-[rgba(255,255,255,0.4)] transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>
        <h1 className="text-[26px] font-bold leading-[1.2] text-white md:text-[36px] xl:text-[42px] 2xl:text-[48px]">
          Interview Prep
        </h1>
        <p className="mx-auto mt-[10px] max-w-[500px] text-[14px] leading-[1.6] text-[#b0b0c8] md:text-[16px]">
          Top 10 most-asked questions for 70+ roles — with expert answers. Free forever.
        </p>
        <div className="mx-auto mt-[20px] max-w-[400px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="h-[44px] w-full rounded-[14px] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] px-[16px] text-[14px] text-white placeholder-[#8b94a7] outline-none backdrop-blur-[4px] focus:border-[#6C63FF]"
          />
        </div>
      </section>

      {/* Category filters */}
      <div className="overflow-x-auto px-[16px] py-[16px] md:px-[40px] xl:px-[64px] 2xl:px-[80px]">
        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={`shrink-0 rounded-full px-[14px] py-[7px] text-[12px] font-semibold transition-colors ${activeCategory === 'All' ? 'bg-[#6C63FF] text-white' : 'bg-white text-[#555] border border-[#e5e7eb] hover:border-[#6C63FF] hover:text-[#6C63FF]'}`}
          >
            All ({interviewData.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-[14px] py-[7px] text-[12px] font-semibold transition-colors ${activeCategory === cat ? 'bg-[#6C63FF] text-white' : 'bg-white text-[#555] border border-[#e5e7eb] hover:border-[#6C63FF] hover:text-[#6C63FF]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Role cards grid */}
      <div className="px-[16px] pb-[40px] md:px-[40px] xl:px-[64px] 2xl:px-[80px]">
        {filtered.length === 0 ? (
          <p className="py-[40px] text-center text-[14px] text-[#999]">No roles found matching &ldquo;{search}&rdquo;</p>
        ) : (
          <div className="grid gap-[12px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filtered.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role)}
                className="group flex flex-col rounded-[16px] border border-[#eceef2] bg-white p-[16px] text-left shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:border-[#6C63FF] hover:shadow-[0_6px_20px_rgba(108,99,255,0.1)]"
              >
                <h3 className="text-[14px] font-bold text-[#1a1a2e] group-hover:text-[#6C63FF] transition-colors md:text-[15px]">
                  {role.title}
                </h3>
                <div className="mt-[8px] flex items-center gap-[8px]">
                  <span className="rounded-full bg-[rgba(108,99,255,0.08)] px-[8px] py-[2px] text-[10px] font-semibold text-[#6C63FF]">
                    {role.category}
                  </span>
                  <span className="text-[11px] font-medium text-[#10b981]">{role.salary}</span>
                </div>
                <p className="mt-[8px] text-[11px] text-[#8b94a7]">10 Questions</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
