'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Template1Preview from '../../components/template-previews/Template1Preview';

const steps = ['Personal Information', 'Summary', 'Skills', 'Experience', 'Projects', 'Certifications', 'Education'];
const makeId = () => Date.now() + Math.random();

const initialData = {
  personal: { fullName: '', professionalTitle: '', phoneNumber: '', emailAddress: '', linkedInUrl: '' },
  summary: '',
  skills: [{ id: makeId(), category: 'Programming & Querying', items: ['SQL', 'Python'] }],
  experience: [{ id: makeId(), companyName: '', role: '', startDate: '', endDate: '', bullets: [''] }],
  projects: [{ id: makeId(), projectName: '', technologiesUsed: '', bullets: [''] }],
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

export default function ResumeBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || '1';
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState('form');
  const [data, setData] = useState(initialData);
  const stepRailRef = useRef(null);
  const stepButtonRefs = useRef([]);

  useEffect(() => {
    stepButtonRefs.current[step]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [step]);

  const previewData = useMemo(
    () => ({
      name: data.personal.fullName || 'Your Name',
      job_title: data.personal.professionalTitle || 'Professional Title',
      phone: data.personal.phoneNumber || 'Phone Number',
      email: data.personal.emailAddress || 'Email Address',
      linkedin: 'LinkedIn',
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
        bullets: p.bullets.filter(Boolean),
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
      <TextArea value={data.summary} onChange={(v) => setData((p) => ({ ...p, summary: v }))} placeholder="Tell a recruiter who you are, what you do, and what you are good at." />
    </Card>,
    <Card key="skills" title="Skills" description="Create categories and list the skills inside each category.">
      <div className="grid gap-[12px]">
        {data.skills.map((g, gi) => (
          <div key={g.id} className="rounded-[18px] border border-[color:#e8e8f0] bg-white p-[12px] shadow-[0_8px_18px_rgba(17,24,39,0.04)]">
            <div className="grid gap-[12px]">
              <div className="flex items-start justify-between gap-[10px]">
                <div className="flex-1">
                  <Input label={`Category ${gi + 1}`} value={g.category} onChange={(v) => setData((p) => ({ ...p, skills: updateItem(p.skills, gi, (item) => ({ ...item, category: v })) }))} placeholder="Programming & Querying" />
                </div>
                <button
                  type="button"
                  onClick={() => setData((p) => ({ ...p, skills: removeItem(p.skills, gi) }))}
                  className="mt-[24px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[color:#e5e7eb] bg-white text-[18px] leading-none text-black"
                  aria-label="Remove category"
                >
                  X
                </button>
              </div>
              <div className="rounded-[16px] bg-[linear-gradient(180deg,#fbfbff_0%,#f6f4ff_100%)] p-[12px]">
                <div className="mb-[10px] flex items-center justify-between gap-[10px]">
                  <span className="text-[12px] font-semibold text-black">Suggested skills</span>
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
                    className="rounded-full border border-[color:#cfc8ff] bg-white px-[12px] py-[6px] text-[12px] font-semibold text-[color:var(--purple)]"
                  >
                    + Add skills
                  </button>
                </div>
                <div className="flex flex-wrap gap-[8px]">
                  {skillSuggestions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        setData((p) => ({
                          ...p,
                          skills: updateItem(p.skills, gi, (group) => ({
                            ...group,
                            items: group.items.includes(skill) ? group.items : addItem(group.items, skill),
                          })),
                        }))
                      }
                      className="rounded-full border border-[color:#d8d2ff] bg-white px-[12px] py-[8px] text-[12px] font-semibold text-black shadow-[0_6px_14px_rgba(17,24,39,0.04)]"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
              {g.items.map((item, ii) => (
                <div key={ii} className="flex gap-[8px]">
                  <input
                    value={item}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        skills: updateItem(p.skills, gi, (group) => ({
                          ...group,
                          items: updateItem(group.items, ii, () => e.target.value),
                        })),
                      }))
                    }
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
                    className="rounded-[12px] border border-[color:#e5e7eb] px-[12px] text-[13px] font-semibold text-black"
                  >
                    Remove
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
          <div key={exp.id} className="rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <div className="grid gap-[12px]">
              <Input label="Company Name" value={exp.companyName} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, companyName: v })) }))} placeholder="Company name" />
              <Input label="Role / Position" value={exp.role} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, role: v })) }))} placeholder="Role / position" />
              <div className="grid grid-cols-2 gap-[10px]">
                <Input label="Start Date" value={exp.startDate} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, startDate: v })) }))} placeholder="Jan 2023" />
                <Input label="End Date" value={exp.endDate} onChange={(v) => setData((p) => ({ ...p, experience: updateItem(p.experience, ei, (item) => ({ ...item, endDate: v })) }))} placeholder="Present" />
              </div>
              {exp.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-[8px]">
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
                    className="h-[44px] flex-1 rounded-[12px] border border-[color:#e5e7eb] px-[14px] text-[14px] outline-none focus:border-[color:var(--purple)]"
                  />
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
                    className="rounded-[12px] border border-[color:#e5e7eb] px-[12px] text-[13px] font-semibold text-black"
                  >
                    Remove
                  </button>
                </div>
              ))}
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
          <div key={p.id} className="rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <div className="grid gap-[12px]">
              <Input label="Project Name" value={p.projectName} onChange={(v) => setData((d) => ({ ...d, projects: updateItem(d.projects, pi, (item) => ({ ...item, projectName: v })) }))} placeholder="Project name" />
              <Input label="Technologies Used" value={p.technologiesUsed} onChange={(v) => setData((d) => ({ ...d, projects: updateItem(d.projects, pi, (item) => ({ ...item, technologiesUsed: v })) }))} placeholder="React, Node, SQL" />
              {p.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-[8px]">
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
                    className="h-[44px] flex-1 rounded-[12px] border border-[color:#e5e7eb] px-[14px] text-[14px] outline-none focus:border-[color:var(--purple)]"
                  />
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
                    className="rounded-[12px] border border-[color:#e5e7eb] px-[12px] text-[13px] font-semibold text-black"
                  >
                    Remove
                  </button>
                </div>
              ))}
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
          <div key={c.id} className="rounded-[14px] border border-[color:#eceef2] p-[12px]">
            <div className="grid gap-[12px]">
              <Input label="Certification Name" value={c.certificationName} onChange={(v) => setData((d) => ({ ...d, certifications: updateItem(d.certifications, ci, (item) => ({ ...item, certificationName: v })) }))} placeholder="Certification name" />
              <Input label="Issuer" value={c.issuer} onChange={(v) => setData((d) => ({ ...d, certifications: updateItem(d.certifications, ci, (item) => ({ ...item, issuer: v })) }))} placeholder="Issuer" />
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
          <div key={e.id} className="rounded-[14px] border border-[color:#eceef2] p-[12px]">
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F2FF_100%)] text-black">
      <button
        type="button"
        onClick={() => router.back()}
        className="fixed right-[16px] top-[16px] z-[50] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(17,24,39,0.12)]"
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-black stroke-[2.4]">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>

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
              <div className="grid grid-cols-2 gap-[8px] md:gap-[10px]">
                <button
                  type="button"
                  onClick={() => setMobileView('form')}
                  className={`rounded-full px-[12px] py-[10px] text-[12px] font-bold md:px-[14px] md:py-[11px] md:text-[13px] ${
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
                  className={`rounded-full px-[12px] py-[10px] text-[12px] font-bold md:px-[14px] md:py-[11px] md:text-[13px] ${
                    mobileView === 'preview'
                      ? 'bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] text-white'
                      : 'bg-[rgba(108,99,255,0.08)] text-[color:var(--purple)]'
                  }`}
                >
                  Preview
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
            <div className="mt-auto hidden shrink-0 rounded-[18px] border border-[color:#eceef2] bg-white p-[10px] shadow-[0_8px_18px_rgba(17,24,39,0.06)] md:block">
              <div className="flex items-center justify-between gap-[10px]">
                <button
                  type="button"
                  className="rounded-full border border-[color:#d8d2ff] bg-white px-[14px] py-[8px] text-[12px] font-semibold text-[color:var(--purple)]"
                >
                  Templates
                </button>
                <button
                  type="button"
                  className="rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[14px] py-[8px] text-[12px] font-semibold text-white"
                >
                  Download PDF
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
            className="h-[42px] flex-1 rounded-full border border-[color:#d8d2ff] bg-white px-[14px] text-[12px] font-semibold text-[color:var(--purple)]"
          >
            Templates
          </button>
          <button
            type="button"
            className="h-[42px] flex-[1.35] rounded-full bg-[linear-gradient(135deg,#6C63FF_0%,#8B83FF_100%)] px-[14px] text-[12px] font-semibold text-white"
          >
            Download PDF
          </button>
        </div>
      </div>
    </main>
  );
}
