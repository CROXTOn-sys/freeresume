import { NextResponse } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopType,
  LineRuleType,
} from 'docx';

function normalizeData(data = {}) {
  const personal = data.personal || {};
  const skills = Array.isArray(data.skills_categories) ? data.skills_categories : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const education = Array.isArray(data.education) ? data.education : [];

  return {
    name: data.name || personal.fullName || '',
    job_title: data.job_title || personal.professionalTitle || '',
    phone: data.phone || personal.phoneNumber || '',
    email: data.email || personal.emailAddress || '',
    linkedin: data.linkedin || personal.linkedInUrl || '',
    github: data.github || personal.github || '',
    summary: data.summary || '',
    skills_categories: skills.map((s) => ({
      category_label: s.category_label || s.category || 'Skills',
      skills_list: s.skills_list || (Array.isArray(s.items) ? s.items.filter(Boolean).join(', ') : ''),
    })),
    experience: experience.map((e) => ({
      company: e.company || e.companyName || '',
      location: e.location || '',
      role: e.role || '',
      start_date: e.start_date || e.startDate || '',
      end_date: e.end_date || e.endDate || '',
      bullets: Array.isArray(e.bullets) ? e.bullets.filter(Boolean) : [],
      tools_used: e.tools_used || e.toolsUsed || '',
    })),
    projects: projects.map((p) => ({
      project_name: p.project_name || p.projectName || '',
      year: p.year || '',
      description: p.description || '',
      technologies: p.technologies || p.technologiesUsed || '',
      start_date: p.start_date || p.startDate || '',
      end_date: p.end_date || p.endDate || '',
      bullets: Array.isArray(p.bullets) ? p.bullets.filter(Boolean) : [],
    })),
    certifications: certifications.map((c) => ({
      cert_title: c.cert_title || c.certificationName || '',
      issuer: c.issuer || '',
      cert_description: c.cert_description || c.description || '',
    })),
    education: education.map((e) => ({
      institution: e.institution || '',
      degree: e.degree || '',
      start_date: e.start_date || e.startDate || '',
      end_date: e.end_date || e.endDate || e.graduation_date || '',
      score: e.score || e.gpa || '',
      score_label: e.score_label || e.scoreLabel || 'CGPA',
      coursework: e.coursework || '',
    })),
  };
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 1: Times New Roman, normal-case headings, dash bullets
// ═══════════════════════════════════════════════════════════
// Line spacing: 280 twips ≈ 14pt line height (matches PDF line-height:1.4 at 10pt)
const T1_LINE = { line: 280, lineRule: LineRuleType.AT_LEAST };
// Right tab position: A4 width (11906) - left margin (850) - right margin (850) = 10206
const T1_RIGHT_TAB = 10206;

function sectionHeadingT1(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 22, font: 'Times New Roman' })],
    spacing: { before: 140, after: 40, line: 240, lineRule: LineRuleType.AT_LEAST },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' } },
  });
}

function dashBullet(text, font, size = 20) {
  return new Paragraph({
    children: [new TextRun({ text: `\u2013 ${text}`, size, font })],
    spacing: { after: 10, ...T1_LINE },
    indent: { left: 200, hanging: 200 },
  });
}

function buildDocxTemplate1(data) {
  const n = normalizeData(data);
  const children = [];
  const FONT = 'Times New Roman';

  // Header: Name centered, uppercase
  children.push(new Paragraph({
    children: [new TextRun({ text: n.name.toUpperCase(), bold: true, size: 40, font: FONT })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 20 },
  }));
  // Professional title
  if (n.job_title) {
    children.push(new Paragraph({
      children: [new TextRun({ text: n.job_title, bold: true, size: 21, font: FONT })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
    }));
  }
  // Contact line
  const contactParts = [n.phone, n.email, n.linkedin].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join(' | '), size: 18, font: FONT })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }));
  }

  // Summary
  if (n.summary) {
    children.push(sectionHeadingT1('Summary'));
    children.push(new Paragraph({
      children: [new TextRun({ text: n.summary, size: 20, font: FONT })],
      spacing: { after: 40, ...T1_LINE },
    }));
  }

  // Skills
  if (n.skills_categories.length && n.skills_categories.some((s) => s.skills_list)) {
    children.push(sectionHeadingT1('Skills'));
    for (const skill of n.skills_categories) {
      if (!skill.skills_list) continue;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${skill.category_label}: `, bold: true, size: 20, font: FONT }),
          new TextRun({ text: skill.skills_list, size: 20, font: FONT }),
        ],
        spacing: { after: 20, ...T1_LINE },
      }));
    }
  }

  // Experience
  if (n.experience.length && n.experience.some((e) => e.company || e.role)) {
    children.push(sectionHeadingT1('Experience'));
    for (const exp of n.experience) {
      if (!exp.company && !exp.role) continue;
      const companyText = exp.company + (exp.location ? `, ${exp.location}` : '');
      const dateText = [exp.start_date, exp.end_date].filter(Boolean).join(' - ');
      children.push(new Paragraph({
        children: [
          new TextRun({ text: companyText, bold: true, size: 20, font: FONT }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: dateText, italics: true, size: 19, font: FONT }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: T1_RIGHT_TAB }],
        spacing: { before: 80, after: 10, ...T1_LINE },
      }));
      if (exp.role || exp.tools_used) {
        const roleRuns = [];
        if (exp.role) roleRuns.push(new TextRun({ text: exp.role, italics: true, size: 20, font: FONT }));
        if (exp.tools_used) {
          roleRuns.push(new TextRun({ text: '\t' }));
          roleRuns.push(new TextRun({ text: `Tools Used: ${exp.tools_used}`, italics: true, size: 19, font: FONT }));
        }
        children.push(new Paragraph({
          children: roleRuns,
          tabStops: [{ type: TabStopType.RIGHT, position: T1_RIGHT_TAB }],
          spacing: { after: 20, ...T1_LINE },
        }));
      }
      for (const bullet of exp.bullets) {
        children.push(dashBullet(bullet, FONT));
      }
    }
  }

  // Projects
  if (n.projects.length && n.projects.some((p) => p.project_name)) {
    children.push(sectionHeadingT1('Projects'));
    for (const proj of n.projects) {
      if (!proj.project_name) continue;
      const nameText = proj.project_name + (proj.technologies ? ` | ${proj.technologies}` : '');
      const dateText = proj.start_date ? `${proj.start_date} \u2013 ${proj.end_date || ''}` : '';
      children.push(new Paragraph({
        children: [
          new TextRun({ text: nameText, bold: true, size: 20, font: FONT }),
          dateText ? new TextRun({ text: '\t' }) : null,
          dateText ? new TextRun({ text: dateText, italics: true, size: 19, font: FONT }) : null,
        ].filter(Boolean),
        tabStops: [{ type: TabStopType.RIGHT, position: T1_RIGHT_TAB }],
        spacing: { before: 80, after: 20, ...T1_LINE },
      }));
      const bullets = proj.bullets.length ? proj.bullets : [];
      for (const bullet of bullets) {
        children.push(dashBullet(bullet, FONT));
      }
    }
  }

  // Certifications
  if (n.certifications.length && n.certifications.some((c) => c.cert_title)) {
    children.push(sectionHeadingT1('Certifications'));
    for (const cert of n.certifications) {
      if (!cert.cert_title) continue;
      let certText = cert.cert_title;
      if (cert.issuer) certText += ` \u2013 ${cert.issuer}`;
      if (cert.cert_description) certText += `: ${cert.cert_description}`;
      children.push(new Paragraph({
        children: [new TextRun({ text: `\u2022 `, size: 20, font: FONT }), new TextRun({ text: cert.cert_title, bold: true, size: 20, font: FONT }), ...(cert.issuer ? [new TextRun({ text: ` \u2013 ${cert.issuer}`, size: 20, font: FONT })] : []), ...(cert.cert_description ? [new TextRun({ text: `: ${cert.cert_description}`, size: 20, font: FONT })] : [])],
        spacing: { after: 20, ...T1_LINE },
        indent: { left: 200, hanging: 140 },
      }));
    }
  }

  // Education
  if (n.education.length && n.education.some((e) => e.institution || e.degree)) {
    children.push(sectionHeadingT1('Education'));
    for (const edu of n.education) {
      if (!edu.institution && !edu.degree) continue;
      const gradText = edu.end_date ? `Graduated: ${edu.end_date}` : '';
      children.push(new Paragraph({
        children: [
          new TextRun({ text: edu.degree, bold: true, size: 20, font: FONT }),
          gradText ? new TextRun({ text: '\t' }) : null,
          gradText ? new TextRun({ text: gradText, size: 19, font: FONT }) : null,
        ].filter(Boolean),
        tabStops: [{ type: TabStopType.RIGHT, position: T1_RIGHT_TAB }],
        spacing: { before: 80, after: 10, ...T1_LINE },
      }));
      const instRuns = [new TextRun({ text: edu.institution, italics: true, size: 20, font: FONT })];
      if (edu.score) {
        instRuns.push(new TextRun({ text: '\t' }));
        instRuns.push(new TextRun({ text: `CGPA: ${edu.score}`, italics: true, size: 19, font: FONT }));
      }
      children.push(new Paragraph({
        children: instRuns,
        tabStops: [{ type: TabStopType.RIGHT, position: T1_RIGHT_TAB }],
        spacing: { after: 20, ...T1_LINE },
      }));
    }
  }

  return new Document({
    sections: [{ properties: { page: { margin: { top: 680, bottom: 680, left: 850, right: 850 } } }, children }],
  });
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE 2: Georgia serif, non-uppercase, bullet-style projects
// ═══════════════════════════════════════════════════════════
const T2_LINE = { line: 260, lineRule: LineRuleType.AT_LEAST };
// Right tab position: A4 width (11906) - left margin (800) - right margin (800) = 10306
const T2_RIGHT_TAB = 10306;

function sectionHeadingT2(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 21, font: 'Georgia' })],
    spacing: { before: 140, after: 40, line: 240, lineRule: LineRuleType.AT_LEAST },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
  });
}

function t2Bullet(runs, spacing = {}) {
  return new Paragraph({
    children: Array.isArray(runs) ? runs : [runs],
    spacing: { after: 10, ...T2_LINE, ...spacing },
    indent: { left: 240, hanging: 140 },
  });
}

function buildDocxTemplate2(data) {
  const n = normalizeData(data);
  const children = [];
  const FONT = 'Georgia';

  // Header: Name centered
  children.push(new Paragraph({
    children: [new TextRun({ text: n.name, bold: true, size: 36, font: FONT })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
  }));
  // Contact line
  const contactParts = [n.email, n.phone, n.github, n.linkedin].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join('  |  '), size: 17, font: FONT })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }));
  }

  // Skills
  if (n.skills_categories.length && n.skills_categories.some((s) => s.skills_list)) {
    children.push(sectionHeadingT2('Skills'));
    for (const skill of n.skills_categories) {
      if (!skill.skills_list) continue;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${skill.category_label}: `, bold: true, size: 19, font: FONT }),
          new TextRun({ text: skill.skills_list, size: 19, font: FONT }),
        ],
        spacing: { after: 20, ...T2_LINE },
      }));
    }
  }

  // Work Experience
  if (n.experience.length && n.experience.some((e) => e.company || e.role)) {
    children.push(sectionHeadingT2('Work Experience'));
    for (const exp of n.experience) {
      if (!exp.company && !exp.role) continue;
      const companyText = exp.company + (exp.location ? `, ${exp.location}` : '');
      const dateText = [exp.start_date, exp.end_date].filter(Boolean).join(' - ');
      children.push(new Paragraph({
        children: [
          new TextRun({ text: companyText, bold: true, size: 19, font: FONT }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: dateText, italics: true, size: 18, font: FONT }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: T2_RIGHT_TAB }],
        spacing: { before: 80, after: 10, ...T2_LINE },
      }));
      if (exp.role) {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.role, italics: true, size: 19, font: FONT })],
          spacing: { after: 20, ...T2_LINE },
        }));
      }
      for (const bullet of exp.bullets) {
        children.push(t2Bullet([new TextRun({ text: `\u2022 ${bullet}`, size: 19, font: FONT })]));
      }
      if (exp.tools_used) {
        children.push(t2Bullet([new TextRun({ text: `\u2022 ${exp.tools_used}`, size: 19, font: FONT })]));
      }
    }
  }

  // Education
  if (n.education.length && n.education.some((e) => e.institution || e.degree)) {
    children.push(sectionHeadingT2('Education'));
    for (const edu of n.education) {
      if (!edu.institution && !edu.degree) continue;
      const dateText = [edu.start_date, edu.end_date].filter(Boolean).join(' - ');
      children.push(new Paragraph({
        children: [
          new TextRun({ text: edu.institution, bold: true, size: 19, font: FONT }),
          dateText ? new TextRun({ text: '\t' }) : null,
          dateText ? new TextRun({ text: dateText, size: 18, font: FONT }) : null,
        ].filter(Boolean),
        tabStops: [{ type: TabStopType.RIGHT, position: T2_RIGHT_TAB }],
        spacing: { before: 80, after: 10, ...T2_LINE },
      }));
      const degreeRuns = [new TextRun({ text: edu.degree, italics: true, size: 19, font: FONT })];
      if (edu.score) {
        degreeRuns.push(new TextRun({ text: '\t' }));
        degreeRuns.push(new TextRun({ text: `${edu.score_label}: ${edu.score}`, bold: true, size: 19, font: FONT }));
      }
      children.push(new Paragraph({
        children: degreeRuns,
        tabStops: [{ type: TabStopType.RIGHT, position: T2_RIGHT_TAB }],
        spacing: { after: 20, ...T2_LINE },
      }));
      if (edu.coursework) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: 'Relevant Coursework: ', bold: true, size: 18, font: FONT }),
            new TextRun({ text: edu.coursework, size: 18, font: FONT }),
          ],
          spacing: { after: 20, ...T2_LINE },
        }));
      }
    }
  }

  // Project Work (bullet list style - title (year): description + tech)
  if (n.projects.length && n.projects.some((p) => p.project_name)) {
    children.push(sectionHeadingT2('Project Work'));
    for (const proj of n.projects) {
      if (!proj.project_name) continue;
      const titleText = proj.project_name + (proj.year ? ` (${proj.year})` : '') + ':';
      const descText = proj.description || proj.bullets.join('. ') || '';
      const techText = proj.technologies ? ` ${proj.technologies}` : '';
      children.push(t2Bullet([
        new TextRun({ text: titleText, bold: true, size: 19, font: FONT }),
        new TextRun({ text: ` ${descText}`, size: 19, font: FONT }),
        techText ? new TextRun({ text: techText, italics: true, size: 19, font: FONT }) : null,
      ].filter(Boolean), { after: 40 }));
    }
  }

  // Awards and Certificates
  if (n.certifications.length && n.certifications.some((c) => c.cert_title)) {
    children.push(sectionHeadingT2('Awards and Certificates'));
    for (const cert of n.certifications) {
      if (!cert.cert_title) continue;
      const runs = [new TextRun({ text: `\u2022 `, size: 19, font: FONT }), new TextRun({ text: cert.cert_title, bold: true, size: 19, font: FONT })];
      if (cert.issuer) runs.push(new TextRun({ text: `: ${cert.issuer}`, size: 19, font: FONT }));
      if (cert.cert_description) runs.push(new TextRun({ text: ` \u2013 ${cert.cert_description}`, size: 19, font: FONT }));
      children.push(t2Bullet(runs, { after: 20 }));
    }
  }

  return new Document({
    sections: [{ properties: { page: { margin: { top: 600, bottom: 600, left: 800, right: 800 } } }, children }],
  });
}

// ═══════════════════════════════════════════════════════════
// API HANDLER
// ═══════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    const data = await request.json();
    const templateId = data._templateId || '1';
    const doc = templateId === '2' ? buildDocxTemplate2(data) : buildDocxTemplate1(data);
    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="resume.docx"',
      },
    });
  } catch (error) {
    console.error('[resume-docx] DOCX generation failed:', error);
    return NextResponse.json({ error: 'DOCX generation failed' }, { status: 500 });
  }
}
