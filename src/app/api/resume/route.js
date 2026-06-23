import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Mustache from 'mustache';
import puppeteer from 'puppeteer-core';

const templatePath = path.join(process.cwd(), 'templates', 'resume-template.html');
const edgeExecutablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function decodePayload(value) {
  if (!value) return {};
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return {};
  }
}

function normalizeData(data = {}) {
  const personal = data.personal || {};
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const education = Array.isArray(data.education) ? data.education : [];

  return {
    name: data.name || personal.fullName || 'Your Name',
    job_title: data.job_title || personal.professionalTitle || 'Professional Title',
    phone: data.phone || personal.phoneNumber || 'Phone Number',
    email: data.email || personal.emailAddress || 'Email Address',
    linkedin: data.linkedin || personal.linkedInUrl || 'LinkedIn',
    summary: data.summary || '',
    skills_categories: Array.isArray(data.skills_categories)
      ? data.skills_categories.map((group) => ({
          category_label: group.category_label || group.category || 'Category',
          skills_list: Array.isArray(group.skills)
            ? group.skills.filter(Boolean).join(', ')
            : Array.isArray(group.items)
              ? group.items.filter(Boolean).join(', ')
              : String(group.skills_list || '').trim(),
        }))
      : skills.map((group) => ({
          category_label: group.category || 'Category',
          skills_list: Array.isArray(group.items) ? group.items.filter(Boolean).join(', ') : '',
        })),
    experience: experience.map((item) => ({
      company: item.company || item.companyName || '',
      role: item.role || item.position || item.title || '',
      start_date: item.start_date || item.startDate || '',
      end_date: item.end_date || item.endDate || '',
      bullets: Array.isArray(item.bullets) ? item.bullets.filter(Boolean) : [],
    })),
    projects: projects.map((item) => ({
      project_name: item.project_name || item.projectName || '',
      technologies: item.technologies || item.technologiesUsed || '',
      bullets: Array.isArray(item.bullets) ? item.bullets.filter(Boolean) : [],
    })),
    certifications: certifications.map((item) => ({
      cert_title: item.cert_title || item.certificationName || '',
      issuer: item.issuer || '',
    })),
    education: education.map((item) => ({
      degree: item.degree || '',
      institution: item.institution || '',
      graduation_date: item.graduation_date || item.graduationYear || '',
      score: item.score || item.gpa || '',
    })),
  };
}

async function loadTemplateHtml() {
  try {
    return await readFile(templatePath, 'utf8');
  } catch {
    return '';
  }
}

async function renderResumeHtml(data) {
  const template = await loadTemplateHtml();
  const normalized = normalizeData(data);
  return template && template.trim() ? Mustache.render(template, normalized) : buildFallbackHtml(normalized);
}

function buildFallbackHtml(data) {
  const normalized = normalizeData(data);
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          *{box-sizing:border-box}
          body{margin:0;font-family:Calibri,Arial,sans-serif;color:#000;background:#fff}
          .page{max-width:760px;margin:0 auto;padding:26px 30px}
          .header{text-align:center;border-bottom:1.8px solid #000;padding-bottom:9px;margin-bottom:9px}
          .name{font-size:20.5pt;font-weight:700;letter-spacing:.045em;text-transform:uppercase;line-height:1.15;margin:0}
          .title{font-size:10.5pt;font-weight:600;margin-top:2px}
          .contact{font-size:9pt;margin-top:4px}
          .section{margin-top:10px}
          .section h2{font-size:10pt;font-weight:700;letter-spacing:.07em;text-transform:uppercase;border-bottom:1.4px solid #000;padding-bottom:2px;margin:0 0 6px}
          .summary{font-size:10pt;line-height:1.45}
          .entry{margin-bottom:8px}
          .row{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
          .bold{font-weight:700}
          .italic{font-style:italic}
          ul{margin:0;padding-left:14px}
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="name">${normalized.name}</div>
            <div class="title">${normalized.job_title}</div>
            <div class="contact">${normalized.phone} | ${normalized.email} | ${normalized.linkedin}</div>
          </div>
          <div class="section">
            <h2>Summary</h2>
            <div class="summary">${normalized.summary}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function pdfEscape(text = '') {
  return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\r?\n/g, ' ');
}

function buildPdfBuffer(data) {
  const n = normalizeData(data);
  const lines = [];
  const push = (text, opts = {}) => {
    lines.push({ text, ...opts });
  };

  push(n.name, { size: 18, bold: true, center: true, gap: 8 });
  push(n.job_title, { size: 11, bold: true, center: true, gap: 8 });
  push(`${n.phone} | ${n.email} | ${n.linkedin}`, { size: 9, center: true, gap: 14 });

  const addSection = (title, contentLines) => {
    push(title, { size: 11, bold: true, section: true, gap: 6 });
    contentLines.forEach((line) => push(line, { size: 10, gap: 4 }));
    push('', { gap: 2 });
  };

  addSection('Summary', [n.summary || '']);

  if (n.skills_categories.length) {
    const skillLines = n.skills_categories.map((item) => `${item.category_label}: ${item.skills_list}`);
    addSection('Skills', skillLines);
  }

  if (n.experience.length) {
    push('Experience', { size: 11, bold: true, section: true, gap: 6 });
    n.experience.forEach((item) => {
      push(`${item.company}  ${item.start_date} - ${item.end_date}`, { size: 10, bold: true, gap: 2 });
      push(item.role || '', { size: 9, italic: true, gap: 2 });
      (item.bullets || []).forEach((bullet) => push(`- ${bullet}`, { size: 9, gap: 2 }));
      push('', { gap: 2 });
    });
  }

  if (n.projects.length) {
    push('Projects', { size: 11, bold: true, section: true, gap: 6 });
    n.projects.forEach((item) => {
      push(`${item.project_name}  ${item.technologies || ''}`, { size: 10, bold: true, gap: 2 });
      (item.bullets || []).forEach((bullet) => push(`- ${bullet}`, { size: 9, gap: 2 }));
      push('', { gap: 2 });
    });
  }

  if (n.certifications.length) {
    push('Certifications', { size: 11, bold: true, section: true, gap: 6 });
    n.certifications.forEach((item) => push(`${item.cert_title}${item.issuer ? ` - ${item.issuer}` : ''}`, { size: 9, gap: 2 }));
    push('', { gap: 2 });
  }

  if (n.education.length) {
    push('Education', { size: 11, bold: true, section: true, gap: 6 });
    n.education.forEach((item) => {
      push(`${item.degree}  ${item.graduation_date || ''}`, { size: 10, bold: true, gap: 2 });
      push(item.institution || '', { size: 9, gap: 2 });
      if (item.score) push(item.score, { size: 9, gap: 2 });
      push('', { gap: 2 });
    });
  }

  const content = [];
  let y = 800;
  const leftX = 48;
  const rightX = 547;
  const maxWidth = rightX - leftX;
  const lineHeight = 14;
  const wrapLine = (text, limit) => {
    const words = String(text).split(/\s+/);
    const out = [];
    let current = '';
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > limit) {
        if (current) out.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) out.push(current);
    return out.length ? out : [''];
  };

  const addPdfText = (text, size, opts = {}) => {
    const wrapped = wrapLine(text, Math.max(20, Math.floor(maxWidth / (size * 0.55))));
    for (const part of wrapped) {
      if (y < 70) {
        content.push('ET');
        y = 800;
      }
      const x = opts.center ? 160 : leftX;
      const renderSize = opts.bold ? Math.max(size, size) : size;
      content.push(`BT /F1 ${renderSize} Tf ${x} ${y} Td (${pdfEscape(part)}) Tj ET`);
      y -= lineHeight;
    }
    y -= opts.gap || 0;
  };

  for (const item of lines) {
    if (item.section) {
      content.push(`BT /F1 ${item.bold ? 11 : 10} Tf ${leftX} ${y} Td (${pdfEscape(item.text)}) Tj ET`);
      y -= 10;
      content.push(`BT /F1 10 Tf ${leftX} ${y} Td (${pdfEscape('____________________________________________________________')}) Tj ET`);
      y -= 12;
      continue;
    }
    addPdfText(item.text, item.size || 10, item);
  }

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${Buffer.byteLength(content.join('\n'))} >> stream\n${content.join('\n')}\nendstream endobj`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = ['0000000000 65535 f '];
  for (const object of objects) {
    offsets.push(String(Buffer.byteLength(pdf)).padStart(10, '0') + ' 00000 n ');
    pdf += `${object}\n`;
  }
  const xrefStart = Buffer.byteLength(pdf);
  pdf += [
    'xref',
    '0 6',
    ...offsets,
    'trailer << /Size 6 /Root 1 0 R >>',
    'startxref',
    String(xrefStart),
    '%%EOF',
  ].join('\n');

  return Buffer.from(pdf, 'utf8');
}

export async function GET(request) {
  const url = new URL(request.url);
  const data = decodePayload(url.searchParams.get('data'));
  const mode = url.searchParams.get('mode') || 'preview';
  const html = await renderResumeHtml(data);

  if (mode === 'preview') {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  return new Response('Unsupported mode', { status: 400 });
}

export async function POST(request) {
  try {
    const data = await request.json();
    const html = await renderResumeHtml(data);

    const browser = await puppeteer.launch({
      executablePath: edgeExecutablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      // Wait for the auto-fit script to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await browser.close();

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Resume API error:', error);
    return new Response('PDF generation failed', { status: 500 });
  }
}
