import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

const MODEL_FALLBACKS = [
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
];

const emptyResumeData = () => ({
  personal: { fullName: '', professionalTitle: '', phoneNumber: '', emailAddress: '', linkedInUrl: '' },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  education: [],
});

const makeId = () => Date.now() + Math.random();

function safeJsonParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function mergeImportedData(primary = {}, fallback = {}) {
  const merged = emptyResumeData();
  const mergeItems = (pArr, fArr, mapper) => {
    const max = Math.max(pArr.length, fArr.length);
    return Array.from({ length: max }, (_, i) => mapper(pArr[i] || {}, fArr[i] || {})).filter(Boolean);
  };
  merged.personal = {
    fullName: primary.personal?.fullName?.trim?.() || fallback.personal?.fullName || '',
    professionalTitle: primary.personal?.professionalTitle?.trim?.() || fallback.personal?.professionalTitle || '',
    phoneNumber: primary.personal?.phoneNumber?.trim?.() || fallback.personal?.phoneNumber || '',
    emailAddress: primary.personal?.emailAddress?.trim?.() || fallback.personal?.emailAddress || '',
    linkedInUrl: primary.personal?.linkedInUrl?.trim?.() || fallback.personal?.linkedInUrl || '',
  };
  merged.summary = primary.summary?.trim?.() || fallback.summary || '';
  merged.skills = mergeItems(primary.skills || [], fallback.skills || [], (a, b) => ({
    id: a.id || b.id || makeId(),
    category: a.category?.trim?.() || b.category || 'Skills',
    items: (Array.isArray(a.items) && a.items.some((x) => String(x).trim())) ? a.items.filter(Boolean) : (Array.isArray(b.items) ? b.items.filter(Boolean) : []),
  }));
  merged.experience = mergeItems(primary.experience || [], fallback.experience || [], (a, b) => ({
    id: a.id || b.id || makeId(),
    companyName: a.companyName?.trim?.() || b.companyName || '',
    role: a.role?.trim?.() || b.role || '',
    startDate: a.startDate?.trim?.() || b.startDate || '',
    endDate: a.endDate?.trim?.() || b.endDate || '',
    bullets: Array.isArray(a.bullets) && a.bullets.some((x) => String(x).trim()) ? a.bullets.filter(Boolean) : Array.isArray(b.bullets) ? b.bullets.filter(Boolean) : [''],
  }));
  merged.projects = mergeItems(primary.projects || [], fallback.projects || [], (a, b) => ({
    id: a.id || b.id || makeId(),
    projectName: a.projectName?.trim?.() || b.projectName || '',
    technologiesUsed: a.technologiesUsed?.trim?.() || b.technologiesUsed || '',
    bullets: Array.isArray(a.bullets) && a.bullets.some((x) => String(x).trim()) ? a.bullets.filter(Boolean) : Array.isArray(b.bullets) ? b.bullets.filter(Boolean) : [''],
  }));
  merged.certifications = mergeItems(primary.certifications || [], fallback.certifications || [], (a, b) => ({
    id: a.id || b.id || makeId(),
    certificationName: a.certificationName?.trim?.() || b.certificationName || '',
    issuer: a.issuer?.trim?.() || b.issuer || '',
  }));
  merged.education = mergeItems(primary.education || [], fallback.education || [], (a, b) => ({
    id: a.id || b.id || makeId(),
    degree: a.degree?.trim?.() || b.degree || '',
    institution: a.institution?.trim?.() || b.institution || '',
    graduationYear: a.graduationYear?.trim?.() || b.graduationYear || '',
    gpa: a.gpa?.trim?.() || b.gpa || '',
  }));
  return merged;
}

function normalizeImportedSchema(payload = {}) {
  const resume = emptyResumeData();
  const personal = payload.personal || {};
  resume.personal = {
    fullName: personal.fullName || personal.name || '',
    professionalTitle: personal.professionalTitle || personal.jobTitle || '',
    phoneNumber: personal.phoneNumber || personal.phone || '',
    emailAddress: personal.emailAddress || personal.email || '',
    linkedInUrl: personal.linkedInUrl || personal.linkedinUrl || personal.linkedin || '',
  };
  resume.summary = payload.summary || '';
  resume.skills = (Array.isArray(payload.skills) ? payload.skills : []).map((g) => ({
    id: makeId(),
    category: g.category || g.category_label || 'Skills',
    items: Array.isArray(g.items) ? g.items.filter(Boolean) : Array.isArray(g.skills) ? g.skills.filter(Boolean) : typeof g.skills_list === 'string' ? g.skills_list.split(',').map((s) => s.trim()).filter(Boolean) : [],
  }));
  resume.experience = (Array.isArray(payload.experience) ? payload.experience : []).map((item) => ({
    id: makeId(),
    companyName: item.companyName || item.company || '',
    role: item.role || item.position || item.title || '',
    startDate: item.startDate || item.start_date || '',
    endDate: item.endDate || item.end_date || '',
    bullets: Array.isArray(item.bullets) ? item.bullets.filter(Boolean) : typeof item.description === 'string' ? [item.description] : [''],
  }));
  resume.projects = (Array.isArray(payload.projects) ? payload.projects : []).map((item) => ({
    id: makeId(),
    projectName: item.projectName || item.project_name || '',
    technologiesUsed: item.technologiesUsed || item.technologies || '',
    bullets: Array.isArray(item.bullets) ? item.bullets.filter((b) => !/^live[:\s]|^code[:\s]|^https?:\/\//i.test(b)).filter(Boolean) : typeof item.description === 'string' ? [item.description] : [''],
    links: Array.isArray(item.links) ? item.links.filter(Boolean) : Array.isArray(item.bullets) ? item.bullets.filter((b) => /^live[:\s]|^code[:\s]|^https?:\/\//i.test(b)) : [],
  }));
  resume.certifications = (Array.isArray(payload.certifications) ? payload.certifications : []).map((item) => ({
    id: makeId(),
    certificationName: item.certificationName || item.cert_title || '',
    issuer: item.issuer || '',
  }));
  resume.education = (Array.isArray(payload.education) ? payload.education : []).map((item) => ({
    id: makeId(),
    degree: item.degree || '',
    institution: item.institution || '',
    graduationYear: item.graduationYear || item.graduation_date || '',
    gpa: item.gpa || item.score || '',
  }));
  return resume;
}

async function extractPdfText(fileBuffer) {
  const buf = Buffer.from(fileBuffer);
  const uint8 = new Uint8Array(buf);
  try {
    const { extractText } = await import('unpdf');
    const result = await extractText(uint8);
    const text = Array.isArray(result?.text) ? result.text.join('\n\n') : String(result?.text || '');
    if (text.trim()) { console.log('[import-resume] unpdf succeeded, length:', text.length); return text; }
  } catch (err) { console.error('[import-resume] unpdf failed:', err?.message); }
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjs.getDocument({ data: uint8 }).promise;
    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(' '));
      page.cleanup();
    }
    await doc.destroy();
    const text = pages.join('\n\n');
    if (text.trim()) { console.log('[import-resume] pdfjs fallback succeeded, length:', text.length); return text; }
  } catch (err) { console.error('[import-resume] pdfjs failed:', err?.message); }
  return '';
}

async function extractDocxText(fileBuffer) {
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value || '';
}

async function enhanceImportedResume(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  const prompt = `You are converting an imported resume into a structured JSON object for a resume builder.\nReturn only valid JSON and nothing else.\n\nTarget schema:\n{"personal":{"fullName":"","professionalTitle":"","phoneNumber":"","emailAddress":"","linkedInUrl":""},"summary":"","skills":[{"category":"","items":[""]}],"experience":[{"companyName":"","role":"","startDate":"","endDate":"","bullets":[""]}],"projects":[{"projectName":"","technologiesUsed":"","bullets":[""]}],"certifications":[{"certificationName":"","issuer":""}],"education":[{"degree":"","institution":"","graduationYear":"","gpa":""}]}\n\nRules:\n- Map the imported resume into the schema above.\n- Normalize headings into our standard sections.\n- Preserve meaning.\n- Split text into short resume-ready bullets when possible.\n- Do not invent facts.\n- Return strict JSON only.\n\nImported resume text:\n${text}`;
  let lastError = '';
  for (const model of MODEL_FALLBACKS) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'HTTP-Referer': 'http://localhost:3006', 'X-OpenRouter-Title': 'resume.com' },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.2, top_p: 0.95, max_tokens: 2000 }),
    });
    if (!response.ok) { lastError = await response.text(); continue; }
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content || '';
    const json = safeJsonParse(content);
    if (json) return normalizeImportedSchema(json);
    lastError = content;
  }
  console.error('[import-resume] AI mapping failed', lastError);
  return null;
}

function heuristicImport(text) {
  const resume = emptyResumeData();
  const rawLines = String(text || '').split(/\r?\n/).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (!rawLines.length) return resume;

  const sectionDefs = [
    { key: 'summary', pattern: /^(summary|professional summary|profile|objective|about me?)$/i },
    { key: 'skills', pattern: /^(skills|technical skills|core competencies|competencies|technical expertise|key skills)$/i },
    { key: 'experience', pattern: /^(experience|work experience|professional experience|employment history|employment|internship|internships)$/i },
    { key: 'projects', pattern: /^(projects|project experience|academic projects|personal projects|key projects)$/i },
    { key: 'certifications', pattern: /^(certifications|certificates|awards & certifications|awards|licenses|credentials)$/i },
    { key: 'education', pattern: /^(education|academic details|qualifications|academic background)$/i },
  ];
  const isSectionHeading = (line) => sectionDefs.some(({ pattern }) => pattern.test(line));
  const bulletRe = /^[-\u2013\u2014\u2022\u25cf\u25e6\u25aa\u2023~]\s/;
  const isBullet = (line) => bulletRe.test(line);
  const dateRangeRe = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*['']?\d{2,4}|\b\d{4})\s*[-\u2013\u2014]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*['']?\d{2,4}|\d{4}|present|current|ongoing|now)/i;

  // --- STEP 1: Rejoin wrapped lines ---
  const lines = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (i === 0 || isSectionHeading(line) || isBullet(line) || dateRangeRe.test(line)) {
      lines.push(line);
    } else if (/^[a-z]/.test(line) && lines.length > 0) {
      // Continuation: starts with lowercase
      lines[lines.length - 1] += ' ' + line;
    } else if (lines.length > 0 && isBullet(lines[lines.length - 1]) && !isSectionHeading(line) && !/^[A-Z][A-Za-z]+\s+[A-Z]/.test(line) && line.length < 80 && !lines[lines.length - 1].endsWith('.')) {
      // Short fragment after a bullet that didn't end with period - continuation
      lines[lines.length - 1] += ' ' + line;
    } else {
      lines.push(line);
    }
  }

  const joinedText = lines.join(' ');
  const findSection = (key) => {
    const def = sectionDefs.find((s) => s.key === key);
    if (!def) return [];
    const start = lines.findIndex((l) => def.pattern.test(l));
    if (start === -1) return [];
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) { if (isSectionHeading(lines[i])) { end = i; break; } }
    return lines.slice(start + 1, end).filter(Boolean);
  };

  // --- PERSONAL INFO ---
  // Try email in joined text first, then scan header lines individually (handles spaced-out extraction)
  let emailMatch = joinedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (!emailMatch) {
    // Try each line individually (some PDFs extract contact lines separately)
    for (const line of lines.slice(0, 10)) {
      const m = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      if (m) { emailMatch = m; break; }
    }
  }
  if (!emailMatch) {
    // Handle spaced-out email: collapse spaces around @ and dots
    const collapsed = joinedText.replace(/\s*@\s*/g, '@').replace(/\s*\.\s*/g, '.');
    emailMatch = collapsed.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  }
  const phoneMatch = joinedText.match(/(\+?\d[\d\s().\-X]{7,}[\dX])/i);
  const linkedInMatch = joinedText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s),|]+/i);
  const firstSectionIdx = lines.findIndex((l) => isSectionHeading(l));
  const headerLines = firstSectionIdx > 0 ? lines.slice(0, firstSectionIdx) : lines.slice(0, 5);

  // Name: first line that looks like a proper name (no @ or digits-heavy)
  const nameLine = headerLines.find((l) => {
    if (/@|\d{5,}/.test(l)) return false;
    if (isSectionHeading(l)) return false;
    return /^[A-Z][A-Za-z.'\-]+(?:\s+[A-Z][A-Za-z.'\-]+){0,3}$/.test(l) && l.length < 45;
  }) || headerLines[0] || '';

  // Title: a line with job-related keywords that isn't the name or a contact line
  const titleLine = headerLines.find((l) => {
    if (l === nameLine) return false;
    if (/@/.test(l) && /\d{4,}/.test(l)) return false;
    return /(analyst|engineer|developer|manager|designer|student|data|software|web|full.?stack|backend|frontend|intern|associate|consultant|architect|specialist|lead|scientist|devops)/i.test(l) && l.length < 60;
  }) || '';

  resume.personal = {
    fullName: nameLine.trim(),
    professionalTitle: titleLine.trim(),
    phoneNumber: phoneMatch?.[0]?.trim() || '',
    emailAddress: emailMatch?.[0]?.trim() || '',
    linkedInUrl: linkedInMatch?.[0]?.trim() || '',
  };

  // --- SUMMARY ---
  const summaryBlock = findSection('summary');
  resume.summary = summaryBlock.join(' ').trim();

  // --- SKILLS ---
  const skillBlock = findSection('skills');
  const skillCategories = [];
  const catPattern = /^([^:]+):\s*(.+)$/;
  for (const line of skillBlock) {
    const clean = line.replace(bulletRe, '').trim();
    const m = clean.match(catPattern);
    if (m) {
      skillCategories.push({ id: makeId(), category: m[1].trim(), items: m[2].split(/,|;/).map((s) => s.trim()).filter(Boolean) });
    } else {
      const items = clean.split(/,|;/).map((s) => s.trim()).filter(Boolean);
      if (items.length > 1) {
        if (skillCategories.length) skillCategories[skillCategories.length - 1].items.push(...items);
        else skillCategories.push({ id: makeId(), category: 'Skills', items });
      } else if (items[0]?.length > 1) {
        if (skillCategories.length) skillCategories[skillCategories.length - 1].items.push(items[0]);
        else skillCategories.push({ id: makeId(), category: 'Skills', items });
      }
    }
  }
  if (skillCategories.length) resume.skills = skillCategories;

  // --- EXPERIENCE ---
  // Formats handled:
  //   "Role Title · Company         Date Range"
  //   "Location · Description"
  //   - bullets
  // OR:
  //   "Role Title                    Date Range"
  //   "Company (Location)"
  //   - bullets
  const expBlock = findSection('experience');
  if (expBlock.length) {
    const entries = [];
    let cur = null;

    const flushCur = () => { if (cur && (cur.role || cur.company || cur.bullets.length)) entries.push(cur); };
    const newEntry = () => ({ company: '', role: '', startDate: '', endDate: '', bullets: [] });

    // Detect if a line is a "Live:" link or URL-only line (not a new entry)
    const isLiveLink = (line) => /^live[:\s]/i.test(line) || /^https?:\/\//i.test(line);
    // Detect middle-dot separator for "Role · Company" format
    const splitDotSep = (text) => text.split(/\s*[\u00b7\u2022\u2027\u22c5]\s*/);

    for (const line of expBlock) {
      const cleanLine = line.replace(bulletRe, '').trim();
      const hasBullet = isBullet(line);
      const hasDate = dateRangeRe.test(line);

      if (hasBullet) {
        if (!cur) cur = newEntry();
        cur.bullets.push(cleanLine);
      } else if (isLiveLink(cleanLine)) {
        // Live link line - add as bullet
        if (!cur) cur = newEntry();
        cur.bullets.push(cleanLine);
      } else if (hasDate) {
        const dateStr = line.match(dateRangeRe)?.[0] || '';
        const dateParts = dateStr.split(/\s*[-\u2013\u2014]+\s*/);
        const textWithoutDate = line.replace(dateRangeRe, '').trim().replace(/[|,\u00b7]\s*$/, '').trim();

        if (cur && cur.bullets.length > 0) {
          // New entry after bullets
          flushCur();
          cur = newEntry();
          // Check if "Role · Company  Date" format
          const dotParts = splitDotSep(textWithoutDate);
          if (dotParts.length >= 2) {
            cur.role = dotParts[0].trim();
            cur.company = dotParts.slice(1).join(' · ').trim();
          } else {
            cur.role = textWithoutDate;
          }
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
        } else if (!cur) {
          cur = newEntry();
          const dotParts = splitDotSep(textWithoutDate);
          if (dotParts.length >= 2) {
            cur.role = dotParts[0].trim();
            cur.company = dotParts.slice(1).join(' · ').trim();
          } else {
            cur.role = textWithoutDate;
          }
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
        } else if (!cur.startDate) {
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
          if (textWithoutDate && !cur.role) cur.role = textWithoutDate;
          else if (textWithoutDate && !cur.company) cur.company = textWithoutDate;
        } else {
          flushCur();
          cur = newEntry();
          const dotParts = splitDotSep(textWithoutDate);
          if (dotParts.length >= 2) {
            cur.role = dotParts[0].trim();
            cur.company = dotParts.slice(1).join(' · ').trim();
          } else {
            cur.role = textWithoutDate;
          }
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
        }
      } else {
        // Non-bullet, non-date, non-link line
        if (!cur) cur = newEntry();

        if (cur.bullets.length > 0) {
          // After bullets - check if it's a new entry header or just a continuation
          if (/^[A-Z]/.test(line) && line.length < 100 && !isLiveLink(cleanLine)) {
            flushCur();
            cur = newEntry();
            const dotParts = splitDotSep(cleanLine);
            if (dotParts.length >= 2) {
              cur.role = dotParts[0].trim();
              cur.company = dotParts.slice(1).join(' · ').trim();
            } else {
              cur.role = cleanLine;
            }
          } else {
            cur.bullets.push(cleanLine);
          }
        } else if (!cur.role) {
          const dotParts = splitDotSep(cleanLine);
          if (dotParts.length >= 2) {
            cur.role = dotParts[0].trim();
            cur.company = dotParts.slice(1).join(' · ').trim();
          } else {
            cur.role = cleanLine;
          }
        } else if (!cur.company) {
          const toolsMatch = cleanLine.match(/tools?\s*used[:\s]*(.*)/i);
          if (toolsMatch) {
            cur.company = cleanLine.replace(/tools?\s*used[:\s]*.*/i, '').trim();
          } else {
            cur.company = cleanLine;
          }
        } else {
          // Extra header line - treat as bullet
          cur.bullets.push(cleanLine);
        }
      }
    }
    flushCur();

    resume.experience = entries.filter((e) => e.role || e.company || e.bullets.length).map((e) => ({
      id: makeId(), companyName: e.company, role: e.role, startDate: e.startDate, endDate: e.endDate,
      bullets: e.bullets.length ? e.bullets : [''],
    })).slice(0, 10);
  }

  // --- PROJECTS ---
  // Formats handled:
  //   "Project Name | Tech     Date Range"   then bullets
  //   "Project Name · Tech · Tech"           then bullets
  //   "Live: https://..."                    (treated as bullet, not new entry)
  const projBlock = findSection('projects');
  if (projBlock.length) {
    const entries = [];
    let cur = null;
    const flushP = () => { if (cur && (cur.name || cur.bullets.length)) entries.push(cur); };
    const newProj = () => ({ name: '', tech: '', bullets: [] });
    const isLiveLink = (line) => /^live[:\s]/i.test(line) || /^https?:\/\//i.test(line) || /^code[:\s]/i.test(line);

    for (const line of projBlock) {
      const cleanLine = line.replace(bulletRe, '').trim();
      const hasBullet = isBullet(line);
      const hasDate = dateRangeRe.test(line);

      if (hasBullet) {
        if (!cur) cur = newProj();
        cur.bullets.push(cleanLine);
      } else if (isLiveLink(cleanLine)) {
        // Live/Code link - add as bullet to current project
        if (!cur) cur = newProj();
        cur.bullets.push(cleanLine);
      } else {
        // Non-bullet line - could be new project header
        if (cur && cur.bullets.length > 0 && /^[A-Z]/.test(line) && !isLiveLink(cleanLine)) {
          // New project after bullets
          flushP();
          cur = newProj();
        }
        if (!cur) cur = newProj();

        if (!cur.name) {
          // Parse project header: strip date first
          let namePart = cleanLine;
          if (hasDate) {
            namePart = cleanLine.replace(dateRangeRe, '').trim();
          }
          // Split by pipe OR middle-dot for "Name | Tech" or "Name · Tech · Tech"
          const parts = namePart.split(/\s*[|\u00b7\u2022\u2027\u22c5]\s*/);
          cur.name = parts[0]?.trim() || namePart;
          if (parts.length > 1) {
            cur.tech = parts.slice(1).join(' · ').trim();
          }
        } else if (!cur.tech) {
          // Tech line (e.g. second line with technologies)
          const parts = cleanLine.split(/\s*[|\u00b7\u2022\u2027\u22c5]\s*/);
          if (parts.length > 1 || /(react|next\.?js|node|python|sql|javascript|typescript|tailwind|express|mongodb|postgresql|aws|docker|git|firebase|flutter|django|spring|angular|vue|streamlit|n8n|supabase|vercel|openrouter|gmail|power bi)/i.test(cleanLine)) {
            cur.tech = cleanLine;
          } else {
            cur.bullets.push(cleanLine);
          }
        } else {
          cur.bullets.push(cleanLine);
        }
      }
    }
    flushP();

    resume.projects = entries.filter((p) => p.name || p.bullets.length).map((p) => {
      const links = p.bullets.filter((b) => /^live[:\s]|^code[:\s]|^https?:\/\//i.test(b));
      const bullets = p.bullets.filter((b) => !/^live[:\s]|^code[:\s]|^https?:\/\//i.test(b));
      return {
        id: makeId(), projectName: p.name, technologiesUsed: p.tech,
        bullets: bullets.length ? bullets : [''],
        links,
      };
    }).slice(0, 10);
  }

  // --- CERTIFICATIONS ---
  const certBlock = findSection('certifications');
  if (certBlock.length) {
    // Merge continuation lines for certs
    const merged = [];
    for (const line of certBlock) {
      if (isBullet(line) || merged.length === 0) {
        merged.push(line);
      } else if (/^[a-z]/.test(line) || (!isBullet(line) && merged.length && !merged[merged.length - 1].endsWith('.'))) {
        merged[merged.length - 1] += ' ' + line;
      } else {
        merged.push(line);
      }
    }
    resume.certifications = merged.map((line) => {
      const clean = line.replace(bulletRe, '').trim();
      if (!clean || clean.length < 3) return null;
      // Split on first " - " or " \u2013 "
      const idx = clean.search(/\s[-\u2013\u2014]\s/);
      if (idx > 0) {
        return { id: makeId(), certificationName: clean.slice(0, idx).trim(), issuer: clean.slice(idx + 3).trim() };
      }
      return { id: makeId(), certificationName: clean, issuer: '' };
    }).filter(Boolean).slice(0, 10);
  }

  // --- EDUCATION ---
  const eduBlock = findSection('education');
  if (eduBlock.length) {
    const entries = [];
    let cur = { degree: '', institution: '', year: '', gpa: '' };

    for (const line of eduBlock) {
      const clean = line.replace(bulletRe, '').trim();
      if (!clean) continue;

      // Extract GPA pattern like "CGPA: 8.2 / 10" or "8.2/10"
      const gpaMatch = clean.match(/(?:CGPA|GPA)\s*[:\s]\s*(\d+(?:\.\d+)?\s*\/\s*\d+)/i) || clean.match(/(\d+\.\d+\s*\/\s*\d+)/);
      // Extract year
      const yearMatch = clean.match(/(?:graduated[:\s]*)?\b((?:19|20)\d{2})\b/i);

      // Clean content: remove gpa and year parts to identify degree/institution
      let content = clean
        .replace(/(?:CGPA|GPA)\s*[:\s]\s*\d+(?:\.\d+)?\s*\/\s*\d+/i, '')
        .replace(/graduated[:\s]*\d{4}/i, '')
        .trim().replace(/^[,|:]\s*/, '').replace(/[,|:]\s*$/, '').trim();

      const hasDegreeKeyword = /(\bb\.?s\.?c\.?\b|\bb\.?tech\b|\bm\.?tech\b|\bb\.?sc\b|\bm\.?sc\b|\bb\.?e\b|\bm\.?e\b|\bb\.?a\b\.?|\bm\.?a\b\.?|\bb\.?com\b|\bm\.?com\b|\bbachelor\b|\bmaster\b|\bphd\b|\bph\.?d\b|\bdiploma\b|\bdegree\b|\bassociate\b|\bmba\b|\bbba\b|information technology|computer science|\bengineering\b)/i.test(content);
      const hasInstitutionKeyword = /(college|university|institute|institution|campus|school|academy)/i.test(content);

      if (hasDegreeKeyword) {
        if (cur.degree && cur.institution) { entries.push({ ...cur }); cur = { degree: '', institution: '', year: '', gpa: '' }; }
        cur.degree = content;
        if (yearMatch && !cur.year) cur.year = yearMatch[1];
        if (gpaMatch && !cur.gpa) cur.gpa = gpaMatch[1] || gpaMatch[0];
      } else if (hasInstitutionKeyword) {
        // Institution line belongs to the current entry (same degree)
        cur.institution = content;
        if (yearMatch && !cur.year) cur.year = yearMatch[1];
        if (gpaMatch && !cur.gpa) cur.gpa = gpaMatch[1] || gpaMatch[0];
      } else if (gpaMatch && !cur.gpa) {
        cur.gpa = gpaMatch[1] || gpaMatch[0];
        if (yearMatch && !cur.year) cur.year = yearMatch[1];
      } else if (yearMatch && !cur.year) {
        cur.year = yearMatch[1];
      } else if (!cur.degree) {
        cur.degree = content;
      } else if (!cur.institution) {
        cur.institution = content;
      }
    }
    if (cur.degree || cur.institution || cur.year) entries.push(cur);
    resume.education = entries.filter((e) => e.degree || e.institution || e.year).map((e) => ({
      id: makeId(), degree: e.degree, institution: e.institution, graduationYear: e.year, gpa: e.gpa,
    })).slice(0, 6);
  }

  // --- Fallbacks ---
  if (!resume.summary) {
    const nonHeading = lines.filter((l) => !isSectionHeading(l) && l !== nameLine && l !== titleLine);
    resume.summary = nonHeading.slice(0, 3).join(' ');
  }
  if (!resume.skills.length) {
    const kw = joinedText.match(/\b(javascript|typescript|python|java|c\+\+|c#|sql|html|css|react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|\.net|aws|azure|docker|kubernetes|git|linux|mongodb|postgresql|mysql|graphql|excel|power bi|tableau|data analysis|project management|communication|teamwork)\b/gi);
    if (kw?.length) resume.skills = [{ id: makeId(), category: 'Skills', items: Array.from(new Set(kw.map((s) => s.trim()))).slice(0, 20) }];
  }

  console.log('[import-resume] heuristic result', { lineCount: lines.length, personal: resume.personal.fullName, summary: resume.summary.length, skills: resume.skills.length, exp: resume.experience.length, proj: resume.projects.length, cert: resume.certifications.length, edu: resume.education.length });
  return resume;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || '';
    const isPdf = mimeType === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
    const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name?.toLowerCase().endsWith('.docx');
    if (!isPdf && !isDocx) {
      return NextResponse.json({ error: 'Only PDF and DOCX import are supported for now' }, { status: 400 });
    }

    let extractedText = '';
    let extractError = '';
    try {
      extractedText = isDocx ? await extractDocxText(buffer) : await extractPdfText(buffer);
      console.log('[import-resume] extracted text', { sourceType: isDocx ? 'docx' : 'pdf', textLength: extractedText.length, isEmpty: !extractedText.trim(), preview: extractedText.slice(0, 400) });
    } catch (error) {
      extractError = error?.message || 'Text extraction failed';
      console.error('[import-resume] extraction FAILED:', error?.message, error?.stack);
    }

    if (!extractedText.trim()) {
      console.warn('[import-resume] WARNING: extracted text is empty!');
    }

    const fallbackData = heuristicImport(extractedText);
    let importedData = fallbackData;
    if (extractedText) {
      try {
        const aiData = await enhanceImportedResume(extractedText);
        if (aiData) {
          console.log('[import-resume] AI mapping success');
          importedData = mergeImportedData(aiData, fallbackData);
        }
      } catch (error) {
        console.error('[import-resume] AI mapping failed', error?.message);
      }
    }

    console.log('[import-resume] final payload', { personal: importedData.personal, summary: importedData.summary?.length, skills: importedData.skills?.length, exp: importedData.experience?.length, proj: importedData.projects?.length, cert: importedData.certifications?.length, edu: importedData.education?.length });

    return NextResponse.json({
      data: importedData,
      rawText: extractedText,
      sourceType: isDocx ? 'docx' : 'pdf',
      warning: extractError || undefined,
    });
  } catch (error) {
    console.error('[import-resume] error', error?.stack || error);
    return NextResponse.json({ error: 'Import failed', details: error?.message || 'Unknown error' }, { status: 500 });
  }
}
