import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { rateLimit } from '../../../lib/rate-limit.js';

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
    location: a.location?.trim?.() || b.location || '',
    role: a.role?.trim?.() || b.role || '',
    startDate: a.startDate?.trim?.() || b.startDate || '',
    endDate: a.endDate?.trim?.() || b.endDate || '',
    toolsUsed: a.toolsUsed?.trim?.() || b.toolsUsed || '',
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
    description: a.description?.trim?.() || b.description || '',
  }));
  merged.education = mergeItems(primary.education || [], fallback.education || [], (a, b) => ({
    id: a.id || b.id || makeId(),
    degree: a.degree?.trim?.() || b.degree || '',
    institution: a.institution?.trim?.() || b.institution || '',
    startDate: a.startDate?.trim?.() || b.startDate || '',
    endDate: a.endDate?.trim?.() || b.endDate || '',
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
    location: item.location || '',
    role: item.role || item.position || item.title || '',
    startDate: item.startDate || item.start_date || '',
    endDate: item.endDate || item.end_date || '',
    toolsUsed: item.toolsUsed || item.tools_used || '',
    bullets: Array.isArray(item.bullets) ? item.bullets.filter(Boolean) : typeof item.description === 'string' ? [item.description] : [''],
  }));
  resume.projects = (Array.isArray(payload.projects) ? payload.projects : []).map((item) => ({
    id: makeId(),
    projectName: item.projectName || item.project_name || '',
    year: item.year || '',
    technologiesUsed: item.technologiesUsed || item.technologies || '',
    startDate: item.startDate || item.start_date || '',
    endDate: item.endDate || item.end_date || '',
    bullets: Array.isArray(item.bullets) ? item.bullets.filter((b) => !/^live[:\s]|^code[:\s]|^https?:\/\//i.test(b)).filter(Boolean) : typeof item.description === 'string' ? [item.description] : [''],
    links: Array.isArray(item.links) ? item.links.filter(Boolean) : Array.isArray(item.bullets) ? item.bullets.filter((b) => /^live[:\s]|^code[:\s]|^https?:\/\//i.test(b)) : [],
  }));
  resume.certifications = (Array.isArray(payload.certifications) ? payload.certifications : []).map((item) => ({
    id: makeId(),
    certificationName: item.certificationName || item.cert_title || '',
    issuer: item.issuer || '',
    description: item.description || item.cert_description || '',
  }));
  resume.education = (Array.isArray(payload.education) ? payload.education : []).map((item) => {
    let startDate = item.startDate || item.start_date || '';
    let endDate = item.endDate || item.end_date || '';
    // If graduationYear contains a date range like "Aug 2013 - Jun 2017", split it
    if (!startDate && !endDate) {
      const gradYear = item.graduationYear || item.graduation_date || '';
      const rangeMatch = gradYear.match(/^(.+?)\s*[-\u2013\u2014]+\s*(.+)$/);
      if (rangeMatch) {
        startDate = rangeMatch[1].trim();
        endDate = rangeMatch[2].trim();
      } else if (gradYear) {
        endDate = gradYear;
      }
    }
    return {
      id: makeId(),
      degree: item.degree || '',
      institution: item.institution || '',
      startDate,
      endDate,
      gpa: item.gpa || item.score || '',
    };
  });
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
  const prompt = `You are converting an imported resume into a structured JSON object for a resume builder.\nReturn only valid JSON and nothing else.\n\nTarget schema:\n{"personal":{"fullName":"","professionalTitle":"","phoneNumber":"","emailAddress":"","linkedInUrl":""},"summary":"","skills":[{"category":"","items":[""]}],"experience":[{"companyName":"","location":"","role":"","startDate":"","endDate":"","toolsUsed":"","bullets":[""]}],"projects":[{"projectName":"","technologiesUsed":"","bullets":[""]}],"certifications":[{"certificationName":"","issuer":""}],"education":[{"degree":"","institution":"","graduationYear":"","gpa":""}]}\n\nRules:\n- Map the imported resume into the schema above.\n- "companyName" is the organization/company name (e.g. "Adobe", "Google"). "role" is the job title/position (e.g. "Computer Scientist", "Software Engineer"). "location" is the city/place (e.g. "Bangalore", "New York"). Do NOT mix these up.\n- "toolsUsed" is the comma-separated list of technologies/tools used in that role (e.g. "Java, Python, AWS, Docker"). This is NOT a bullet point.\n- Normalize headings into our standard sections.\n- Preserve meaning.\n- Split text into short resume-ready bullets when possible.\n- Do not invent facts.\n- Return strict JSON only.\n\nImported resume text:\n${text}`;
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
    { key: 'projects', pattern: /^(projects|project work|project experience|academic projects|personal projects|key projects)$/i },
    { key: 'certifications', pattern: /^(certifications|certificates|awards & certifications|awards and certifications|awards and certificates|awards|licenses|credentials)$/i },
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
  //   "Company, Location         Date Range"
  //   "Role"
  //   - bullets
  // OR:
  //   "Company · Location  Date"
  //   "Role"
  //   - bullets
  const expBlock = findSection('experience');
  if (expBlock.length) {
    const entries = [];
    let cur = null;

    const flushCur = () => { if (cur && (cur.role || cur.company || cur.bullets.length)) entries.push(cur); };
    const newEntry = () => ({ company: '', location: '', role: '', startDate: '', endDate: '', bullets: [], toolsUsed: '' });

    // Detect if a line is a "Live:" link or URL-only line (not a new entry)
    const isLiveLink = (line) => /^live[:\s]/i.test(line) || /^https?:\/\//i.test(line);
    // Detect middle-dot separator for "Company · Location" format
    const splitDotSep = (text) => text.split(/\s*[\u00b7\u2022\u2027\u22c5]\s*/);
    // Extract location from "Company, Location" pattern
    const splitCompanyLocation = (text) => {
      const commaMatch = text.match(/^(.+?),\s*([A-Z][A-Za-z\s]+)$/);
      if (commaMatch) return { company: commaMatch[1].trim(), location: commaMatch[2].trim() };
      return { company: text, location: '' };
    };
    // Detect if a line is a tools/technologies list (comma-separated tech keywords, not a company name)
    const techKeywords = /\b(java|python|typescript|javascript|c\+\+|c#|go|rust|ruby|swift|kotlin|scala|php|r\b|sql|nosql|html|css|sass|less|react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|\.net|rails|laravel|svelte|nuxt|gatsby|remix|aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci\/cd|git|linux|mongodb|postgresql|mysql|redis|dynamodb|elasticsearch|elastic\s*search|kafka|rabbitmq|graphql|rest|grpc|tensorflow|pytorch|keras|scikit|pandas|numpy|spark|hadoop|hive|airflow|mlflow|tableau|power\s*bi|excel|figma|jira|confluence|agile|scrum|microservices|serverless|lambda|s3|ec2|sqs|sns|cloudformation|step\s*functions|batch|athena|lightgbm|xgboost|bert|transformers|opencv|nltk|spacy)\b/i;
    const isTechLine = (line) => {
      // A tech line has 3+ commas and most segments match tech keywords
      const commas = (line.match(/,/g) || []).length;
      if (commas < 2) return false;
      const segments = line.split(/,/).map((s) => s.trim()).filter(Boolean);
      const techMatches = segments.filter((s) => techKeywords.test(s)).length;
      return techMatches >= segments.length * 0.5;
    };

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
          // First line with date = company line
          const dotParts = splitDotSep(textWithoutDate);
          if (dotParts.length >= 2) {
            cur.company = dotParts[0].trim();
            cur.location = dotParts.slice(1).join(', ').trim();
          } else {
            const { company, location } = splitCompanyLocation(textWithoutDate);
            cur.company = company;
            cur.location = location;
          }
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
        } else if (!cur) {
          cur = newEntry();
          const dotParts = splitDotSep(textWithoutDate);
          if (dotParts.length >= 2) {
            cur.company = dotParts[0].trim();
            cur.location = dotParts.slice(1).join(', ').trim();
          } else {
            const { company, location } = splitCompanyLocation(textWithoutDate);
            cur.company = company;
            cur.location = location;
          }
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
        } else if (!cur.startDate) {
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
          if (textWithoutDate && !cur.company) {
            const { company, location } = splitCompanyLocation(textWithoutDate);
            cur.company = company;
            cur.location = location;
          } else if (textWithoutDate && !cur.role) {
            cur.role = textWithoutDate;
          }
        } else {
          flushCur();
          cur = newEntry();
          const dotParts = splitDotSep(textWithoutDate);
          if (dotParts.length >= 2) {
            cur.company = dotParts[0].trim();
            cur.location = dotParts.slice(1).join(', ').trim();
          } else {
            const { company, location } = splitCompanyLocation(textWithoutDate);
            cur.company = company;
            cur.location = location;
          }
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
        }
      } else {
        // Non-bullet, non-date, non-link line
        if (!cur) cur = newEntry();

        if (cur.bullets.length > 0) {
          // After bullets - check if it's a tech/tools line that belongs to current entry
          if (isTechLine(cleanLine)) {
            cur.toolsUsed = cleanLine;
          } else if (/^[A-Z]/.test(line) && line.length < 100 && !isLiveLink(cleanLine)) {
            flushCur();
            cur = newEntry();
            // First line after flush = company line
            const dotParts = splitDotSep(cleanLine);
            if (dotParts.length >= 2) {
              cur.company = dotParts[0].trim();
              cur.location = dotParts.slice(1).join(', ').trim();
            } else {
              const { company, location } = splitCompanyLocation(cleanLine);
              cur.company = company;
              cur.location = location;
            }
          } else {
            cur.bullets.push(cleanLine);
          }
        } else if (!cur.company) {
          // First line of entry = company (+ possible location)
          const dotParts = splitDotSep(cleanLine);
          if (dotParts.length >= 2) {
            cur.company = dotParts[0].trim();
            cur.location = dotParts.slice(1).join(', ').trim();
          } else {
            const { company, location } = splitCompanyLocation(cleanLine);
            cur.company = company;
            cur.location = location;
          }
        } else if (!cur.role) {
          // Second line of entry = role
          cur.role = cleanLine;
        } else {
          // Extra header line - treat as bullet
          cur.bullets.push(cleanLine);
        }
      }
    }
    flushCur();

    // Post-process: if the last bullet of an entry is a tech/tools line, move it to toolsUsed
    for (const entry of entries) {
      if (entry.bullets.length > 0 && !entry.toolsUsed) {
        const lastBullet = entry.bullets[entry.bullets.length - 1];
        if (isTechLine(lastBullet)) {
          entry.toolsUsed = lastBullet;
          entry.bullets.pop();
        }
      }
    }

    // Post-process: if the role field contains "Tools Used:" text, separate it
    for (const entry of entries) {
      if (entry.role && !entry.toolsUsed) {
        const toolsMatch = entry.role.match(/\s*Tools?\s*Used\s*[:\s]\s*(.+)$/i);
        if (toolsMatch) {
          entry.toolsUsed = toolsMatch[1].trim();
          entry.role = entry.role.replace(/\s*Tools?\s*Used\s*[:\s]\s*.+$/i, '').trim();
        }
      }
    }

    resume.experience = entries.filter((e) => e.role || e.company || e.bullets.length).map((e) => ({
      id: makeId(), companyName: e.company, location: e.location || '', role: e.role, startDate: e.startDate, endDate: e.endDate,
      toolsUsed: e.toolsUsed || '',
      bullets: e.bullets.length ? e.bullets : [''],
    })).slice(0, 10);
  }

  // --- PROJECTS ---
  const projBlock = findSection('projects');
  if (projBlock.length) {
    const entries = [];
    let cur = null;
    const flushP = () => { if (cur && (cur.name || cur.bullets.length)) entries.push(cur); };
    const newProj = () => ({ name: '', year: '', tech: '', startDate: '', endDate: '', bullets: [] });
    const isLiveLink = (line) => /^live[:\s]/i.test(line) || /^https?:\/\//i.test(line) || /^code[:\s]/i.test(line);
    const titleYearRe = /^([A-Z][A-Za-z\s\-'\/\+\(\)]+?)\s*\((\d{4})\)\s*:\s*(.*)$/;

    for (const line of projBlock) {
      const cleanLine = line.replace(bulletRe, '').trim();
      if (!cleanLine) continue;

      // Always check for "Title (Year): description" pattern first
      const titleYearMatch = cleanLine.match(titleYearRe);
      if (titleYearMatch) {
        flushP();
        cur = newProj();
        cur.name = titleYearMatch[1].trim();
        cur.year = titleYearMatch[2].trim();
        cur.bullets = titleYearMatch[3].trim() ? [titleYearMatch[3].trim()] : [];
        continue;
      }

      // Check for live/code links
      if (isLiveLink(cleanLine)) {
        if (!cur) cur = newProj();
        cur.bullets.push(cleanLine);
        continue;
      }

      const hasBullet = isBullet(line);
      const hasDate = dateRangeRe.test(line);

      // If we already have a current project and this is a non-title line
      if (cur && cur.name) {
        if (hasBullet) {
          // Explicit bullet - add as new bullet
          cur.bullets.push(cleanLine);
        } else if (hasDate && /^[A-Z]/.test(line)) {
          // New project header with date - flush and start new
          flushP();
          cur = newProj();
          const dateStr = line.match(dateRangeRe)?.[0] || '';
          const dateParts = dateStr.split(/\s*[-\u2013\u2014]+\s*/);
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
          let namePart = cleanLine.replace(dateRangeRe, '').trim();
          const parts = namePart.split(/\s*[|\u00b7\u2027\u22c5]\s*/);
          cur.name = parts[0]?.trim() || namePart;
          if (parts.length > 1) cur.tech = parts.slice(1).join(' · ').trim();
        } else if (!hasBullet && /^[A-Z]/.test(line) && line.length < 100) {
          // Potential new project header (capitalized, no bullet) - flush and start new
          flushP();
          cur = newProj();
          const parts = cleanLine.split(/\s*[|\u00b7\u2027\u22c5]\s*/);
          cur.name = parts[0]?.trim() || cleanLine;
          if (parts.length > 1) cur.tech = parts.slice(1).join(' · ').trim();
        } else {
          // Continuation text - append to last bullet
          if (cur.bullets.length) {
            cur.bullets[cur.bullets.length - 1] += ' ' + cleanLine;
          } else {
            cur.bullets.push(cleanLine);
          }
        }
      } else if (!hasBullet && /^[A-Z]/.test(line)) {
        // Non-bullet capitalized line = new project header (standard format)
        if (cur && cur.bullets.length > 0) { flushP(); cur = null; }
        if (!cur) cur = newProj();
        let namePart = cleanLine;
        if (hasDate) {
          const dateStr = line.match(dateRangeRe)?.[0] || '';
          const dateParts = dateStr.split(/\s*[-\u2013\u2014]+\s*/);
          cur.startDate = dateParts[0]?.trim() || '';
          cur.endDate = dateParts[1]?.trim() || '';
          namePart = cleanLine.replace(dateRangeRe, '').trim();
        }
        const parts = namePart.split(/\s*[|\u00b7\u2027\u22c5]\s*/);
        cur.name = parts[0]?.trim() || namePart;
        if (parts.length > 1) cur.tech = parts.slice(1).join(' · ').trim();
      } else {
        // Regular bullet or text
        if (!cur) cur = newProj();
        cur.bullets.push(cleanLine);
      }
    }
    flushP();

    // Tech keyword pattern for detecting trailing technologies in project descriptions
    const projTechKeywords = /\b(java|python|typescript|javascript|c\+\+|c#|go|rust|ruby|swift|kotlin|scala|php|sql|nosql|html|css|sass|less|react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|\.net|rails|laravel|svelte|nuxt|gatsby|remix|aws|azure|gcp|docker|kubernetes|terraform|jenkins|git|linux|mongodb|postgresql|mysql|redis|dynamodb|elasticsearch|elastic\s*search|kafka|rabbitmq|graphql|rest|grpc|tensorflow|pytorch|keras|scikit|pandas|numpy|spark|hadoop|hive|airflow|mlflow|tableau|power\s*bi|beautifulsoup|beautiful\s*soup|selenium|opencv|opengl|nltk|spacy|weka|matplotlib|d3|scipy|jupyter|flask|fastapi|celery|redis|neo4j|cassandra|firebase|heroku|netlify|vercel)\b/i;

    // Post-process: extract trailing tech from the end of description
    for (const p of entries) {
      if (p.tech || !p.bullets.length) continue;
      const lastBullet = p.bullets[p.bullets.length - 1];
      // Look for trailing comma-separated tech at the end of the last bullet
      // Split on the last sentence-ending period and check if the remainder is a tech list
      const lastPeriodIdx = lastBullet.lastIndexOf('.');
      if (lastPeriodIdx < 0) continue;
      const afterPeriod = lastBullet.slice(lastPeriodIdx + 1).trim();
      if (!afterPeriod) continue;
      const segments = afterPeriod.split(/,/).map((s) => s.trim()).filter(Boolean);
      if (segments.length < 2) continue;
      const techMatches = segments.filter((s) => projTechKeywords.test(s)).length;
      if (techMatches >= segments.length * 0.5) {
        p.tech = afterPeriod;
        p.bullets[p.bullets.length - 1] = lastBullet.slice(0, lastPeriodIdx + 1).trim();
      }
    }

    resume.projects = entries.filter((p) => p.name || p.bullets.length).map((p) => {
      const links = p.bullets.filter((b) => /^live[:\s]|^code[:\s]|^https?:\/\//i.test(b));
      const bullets = p.bullets.filter((b) => !/^live[:\s]|^code[:\s]|^https?:\/\//i.test(b));
      return {
        id: makeId(), projectName: p.name, year: p.year || '', technologiesUsed: p.tech,
        startDate: p.startDate || '', endDate: p.endDate || '',
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

      let title = '';
      let issuer = '';
      let description = '';

      // Step 1: Split on colon to separate title portion from description
      const colonIdx = clean.indexOf(':');
      let titlePart = clean;
      if (colonIdx > 0 && colonIdx < clean.length - 1) {
        titlePart = clean.slice(0, colonIdx).trim();
        const afterColon = clean.slice(colonIdx + 1).trim();
        // Check if after colon there's a dash separating issuer from description
        const dashIdx = afterColon.search(/\s[-\u2013\u2014]\s/);
        if (dashIdx > 0) {
          issuer = afterColon.slice(0, dashIdx).trim();
          description = afterColon.slice(dashIdx + 3).trim();
        } else {
          description = afterColon;
        }
      } else {
        // No colon — check for " - " or " – " separator
        const dashIdx = clean.search(/\s[-\u2013\u2014]\s/);
        if (dashIdx > 0) {
          titlePart = clean.slice(0, dashIdx).trim();
          description = clean.slice(dashIdx + 3).trim();
        }
      }

      // Step 2: Extract issuer from title using "at" or "on" patterns
      // e.g. "Mentor at Scaler Academy" → title: "Mentor", issuer: "Scaler Academy"
      // e.g. "Data Engineering Nanodegree on Udacity" → title: "Data Engineering Nanodegree", issuer: "Udacity"
      if (!issuer) {
        const atMatch = titlePart.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
        const onMatch = titlePart.match(/^(.+?)\s+on\s+([A-Z][A-Za-z\s]+)$/);
        if (atMatch) {
          title = atMatch[1].trim();
          issuer = atMatch[2].trim();
        } else if (onMatch) {
          title = onMatch[1].trim();
          issuer = onMatch[2].trim();
        } else {
          title = titlePart;
        }
      } else {
        // Issuer already extracted from after colon, still check title for "at/on" patterns
        const atMatch = titlePart.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
        const onMatch = titlePart.match(/^(.+?)\s+on\s+([A-Z][A-Za-z\s]+)$/);
        if (atMatch) {
          title = atMatch[1].trim();
          // Prefer the "at" issuer over the one from after colon if issuer was from colon section
          if (!issuer) issuer = atMatch[2].trim();
          else title = titlePart; // keep full title if issuer already set
        } else if (onMatch) {
          title = onMatch[1].trim();
          if (!issuer) issuer = onMatch[2].trim();
          else title = titlePart;
        } else {
          title = titlePart;
        }
      }

      return { id: makeId(), certificationName: title, issuer, description };
    }).filter(Boolean).slice(0, 10);
  }

  // --- EDUCATION ---
  const eduBlock = findSection('education');
  if (eduBlock.length) {
    const entries = [];
    let cur = { degree: '', institution: '', startDate: '', endDate: '', gpa: '', coursework: '' };

    for (const line of eduBlock) {
      const clean = line.replace(bulletRe, '').trim();
      if (!clean) continue;

      // Check for "Relevant Coursework:" line
      const courseworkMatch = clean.match(/^relevant\s*coursework\s*:\s*(.+)$/i);
      if (courseworkMatch) {
        cur.coursework = courseworkMatch[1].trim();
        continue;
      }

      // Extract GPA pattern like "CGPA: 8.2 / 10" or "7.96/10"
      const gpaMatch = clean.match(/(?:CGPA|GPA)\s*[:\s]\s*(\d+(?:\.\d+)?\s*\/\s*\d+)/i) || clean.match(/(\d+\.\d+\s*\/\s*\d+)/);
      // Extract year or date range
      const yearMatch = clean.match(/(?:graduated[:\s]*)?\b((?:19|20)\d{2})\b/i);
      const dateRangeMatch = clean.match(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4})\s*[-\u2013\u2014]+\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4})/i);

      // Clean content
      let content = clean
        .replace(/(?:CGPA|GPA)\s*[:\s]\s*\d+(?:\.\d+)?\s*\/\s*\d+/i, '')
        .replace(/graduated[:\s]*\d{4}/i, '')
        .replace(/((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4})\s*[-\u2013\u2014]+\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4})/i, '')
        .trim().replace(/^[,|:\-]\s*/, '').replace(/[,|:\-]\s*$/, '').trim();

      const hasDegreeKeyword = /(\bb\.?s\.?c\.?\b|\bb\.?tech\b|\bm\.?tech\b|\bb\.?sc\b|\bm\.?sc\b|\bb\.?e\.?\b|\bm\.?e\.?\b|\bb\.?a\b\.?|\bm\.?a\b\.?|\bb\.?com\b|\bm\.?com\b|\bbachelor\b|\bmaster\b|\bphd\b|\bph\.?d\b|\bdiploma\b|\bdegree\b|\bassociate\b|\bmba\b|\bbba\b|information technology|computer science|\bengineering\b)/i.test(content);
      const hasInstitutionKeyword = /(college|university|institute|institution|campus|school|academy|iit|nit|bits|iiit)/i.test(content);

      if (hasInstitutionKeyword && !hasDegreeKeyword) {
        if (cur.institution && cur.degree) { entries.push({ ...cur }); cur = { degree: '', institution: '', startDate: '', endDate: '', gpa: '', coursework: '' }; }
        cur.institution = content;
        if (dateRangeMatch) { cur.startDate = dateRangeMatch[1].trim(); cur.endDate = dateRangeMatch[2].trim(); }
        else if (yearMatch && !cur.endDate) cur.endDate = yearMatch[1];
        if (gpaMatch && !cur.gpa) cur.gpa = gpaMatch[1] || gpaMatch[0];
      } else if (hasDegreeKeyword) {
        cur.degree = content;
        if (dateRangeMatch) { cur.startDate = dateRangeMatch[1].trim(); cur.endDate = dateRangeMatch[2].trim(); }
        else if (yearMatch && !cur.endDate) cur.endDate = yearMatch[1];
        if (gpaMatch && !cur.gpa) cur.gpa = gpaMatch[1] || gpaMatch[0];
      } else if (gpaMatch && !cur.gpa) {
        cur.gpa = gpaMatch[1] || gpaMatch[0];
        if (dateRangeMatch) { cur.startDate = dateRangeMatch[1].trim(); cur.endDate = dateRangeMatch[2].trim(); }
        else if (yearMatch && !cur.endDate) cur.endDate = yearMatch[1];
      } else if (dateRangeMatch && !cur.endDate) {
        cur.startDate = dateRangeMatch[1].trim();
        cur.endDate = dateRangeMatch[2].trim();
      } else if (yearMatch && !cur.endDate) {
        cur.endDate = yearMatch[1];
      } else if (!cur.institution && content.length < 50) {
        cur.institution = content;
      } else if (!cur.degree) {
        cur.degree = content;
      }
    }
    if (cur.degree || cur.institution || cur.startDate || cur.endDate) entries.push(cur);
    resume.education = entries.filter((e) => e.degree || e.institution || e.startDate || e.endDate).map((e) => ({
      id: makeId(), degree: e.degree, institution: e.institution, startDate: e.startDate || '', endDate: e.endDate || '', gpa: e.gpa, coursework: e.coursework || '',
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
  const { success } = rateLimit(request, { limit: 5, windowMs: 60000 });
  if (!success) return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // File size limit: 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 413 });
    }
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
