/**
 * Import Animation Hook — Ghost Typing / AI Scanning Effect
 * ═══════════════════════════════════════════════════════════
 * Progressive reveal: the resume preview fills section-by-section,
 * text appears character-by-character over ~4.5 seconds.
 *
 * The hook stores animatedData in STATE (not computed) to guarantee
 * React re-renders the preview on every animation frame.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const ANIMATION_DURATION_MS = 4500; // 4.5 seconds

// Section timeline: each section gets a slice of the total duration
const SECTION_TIMELINE = [
  { key: 'personal', start: 0.00, end: 0.10 },
  { key: 'summary', start: 0.10, end: 0.22 },
  { key: 'skills', start: 0.22, end: 0.36 },
  { key: 'experience', start: 0.36, end: 0.62 },
  { key: 'projects', start: 0.62, end: 0.78 },
  { key: 'certifications', start: 0.78, end: 0.88 },
  { key: 'education', start: 0.88, end: 1.00 },
];

function getSectionProgress(globalProgress, key) {
  const s = SECTION_TIMELINE.find((t) => t.key === key);
  if (!s) return globalProgress >= 1 ? 1 : 0;
  if (globalProgress <= s.start) return 0;
  if (globalProgress >= s.end) return 1;
  return (globalProgress - s.start) / (s.end - s.start);
}

function revealText(text, progress) {
  if (!text || progress >= 1) return text || '';
  if (progress <= 0) return '';
  return String(text).slice(0, Math.ceil(String(text).length * progress));
}

function revealBullets(bullets, progress) {
  if (!Array.isArray(bullets) || !bullets.length) return [];
  if (progress >= 1) return bullets;
  if (progress <= 0) return [];
  const total = bullets.length;
  const exactIdx = progress * total;
  const fullyDone = Math.floor(exactIdx);
  const partial = exactIdx - fullyDone;
  const result = bullets.slice(0, fullyDone);
  if (fullyDone < total) {
    const current = bullets[fullyDone];
    if (typeof current === 'string') {
      result.push(revealText(current, partial));
    } else {
      result.push(current);
    }
  }
  return result;
}

/**
 * Build the animated preview data snapshot for a given global progress.
 * This returns a "previewData-shaped" object that the preview components
 * can render directly — with partial text for the typing effect.
 */
function buildAnimatedPreview(finalPreviewData, progress, templateId) {
  if (!finalPreviewData || progress >= 1) return finalPreviewData;
  if (progress <= 0) return getEmptyPreview(templateId);

  const p = getSectionProgress(progress, 'personal');
  const s = getSectionProgress(progress, 'summary');
  const sk = getSectionProgress(progress, 'skills');
  const ex = getSectionProgress(progress, 'experience');
  const pr = getSectionProgress(progress, 'projects');
  const c = getSectionProgress(progress, 'certifications');
  const e = getSectionProgress(progress, 'education');

  return {
    // Personal
    name: revealText(finalPreviewData.name, p),
    job_title: revealText(finalPreviewData.job_title, p),
    phone: p > 0.5 ? (finalPreviewData.phone || '') : '',
    email: p > 0.3 ? (finalPreviewData.email || '') : '',
    linkedin: p > 0.7 ? (finalPreviewData.linkedin || '') : '',
    linkedin_url: finalPreviewData.linkedin_url || '#',
    github: p > 0.8 ? (finalPreviewData.github || '') : '',
    github_url: finalPreviewData.github_url || '',

    // Summary
    summary: revealText(finalPreviewData.summary, s),

    // Skills
    skills_categories: sk <= 0 ? [] : (finalPreviewData.skills_categories || []).slice(0, Math.max(1, Math.ceil((finalPreviewData.skills_categories || []).length * sk))).map((cat, i, arr) => {
      const isLast = i === arr.length - 1 && sk < 1;
      return {
        category_label: isLast ? revealText(cat.category_label, sk) : cat.category_label,
        skills_list: isLast ? revealText(cat.skills_list, sk) : cat.skills_list,
      };
    }),

    // Experience
    experience: ex <= 0 ? [] : (finalPreviewData.experience || []).slice(0, Math.max(1, Math.ceil((finalPreviewData.experience || []).length * ex))).map((entry, i, arr) => {
      const isLast = i === arr.length - 1 && ex < 1;
      const entryProg = isLast ? (ex * arr.length - i) : 1;
      return {
        company: isLast ? revealText(entry.company, entryProg) : entry.company,
        location: entry.location || '',
        role: entryProg > 0.2 ? (isLast ? revealText(entry.role, Math.max(0, (entryProg - 0.2) / 0.8)) : entry.role) : '',
        start_date: entryProg > 0.3 ? (entry.start_date || '') : '',
        end_date: entryProg > 0.3 ? (entry.end_date || '') : '',
        tools_used: entryProg > 0.8 ? (entry.tools_used || '') : '',
        bullets: entryProg > 0.3 ? revealBullets(entry.bullets || [], Math.max(0, (entryProg - 0.3) / 0.7)) : [],
      };
    }),

    // Projects
    projects: pr <= 0 ? [] : (finalPreviewData.projects || []).slice(0, Math.max(1, Math.ceil((finalPreviewData.projects || []).length * pr))).map((proj, i, arr) => {
      const isLast = i === arr.length - 1 && pr < 1;
      const projProg = isLast ? (pr * arr.length - i) : 1;
      return {
        project_name: isLast ? revealText(proj.project_name, projProg) : proj.project_name,
        technologies: projProg > 0.4 ? (proj.technologies || '') : '',
        year: proj.year || '',
        description: projProg > 0.3 ? revealText(proj.description, Math.max(0, (projProg - 0.3) / 0.7)) : '',
        start_date: proj.start_date || '',
        end_date: proj.end_date || '',
        bullets: projProg > 0.3 ? revealBullets(proj.bullets || [], Math.max(0, (projProg - 0.3) / 0.7)) : [],
      };
    }),

    // Certifications
    certifications: c <= 0 ? [] : (finalPreviewData.certifications || []).slice(0, Math.max(1, Math.ceil((finalPreviewData.certifications || []).length * c))).map((cert, i, arr) => {
      const isLast = i === arr.length - 1 && c < 1;
      return {
        cert_title: isLast ? revealText(cert.cert_title, c) : cert.cert_title,
        issuer: isLast ? '' : (cert.issuer || ''),
        cert_description: isLast ? '' : (cert.cert_description || ''),
      };
    }),

    // Education
    education: e <= 0 ? [] : (finalPreviewData.education || []).slice(0, Math.max(1, Math.ceil((finalPreviewData.education || []).length * e))).map((edu, i, arr) => {
      const isLast = i === arr.length - 1 && e < 1;
      const eduProg = isLast ? (e * arr.length - i) : 1;
      return {
        degree: isLast ? revealText(edu.degree, eduProg) : edu.degree,
        institution: eduProg > 0.3 ? (isLast ? revealText(edu.institution, Math.max(0, (eduProg - 0.3) / 0.7)) : edu.institution) : '',
        graduation_date: eduProg > 0.6 ? (edu.graduation_date || '') : '',
        score: eduProg > 0.8 ? (edu.score || '') : '',
        start_date: edu.start_date || '',
        end_date: edu.end_date || '',
        score_label: edu.score_label || '',
        coursework: eduProg > 0.7 ? (edu.coursework || '') : '',
      };
    }),

    // Pass through template id if present
    _templateId: finalPreviewData._templateId,
  };
}

function getEmptyPreview(templateId) {
  return {
    name: '', job_title: '', phone: '', email: '', linkedin: '', linkedin_url: '#',
    github: '', github_url: '', summary: '',
    skills_categories: [], experience: [], projects: [],
    certifications: [], education: [], _templateId: templateId,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// HOOK EXPORT
// ═══════════════════════════════════════════════════════════════════════

/**
 * @param {object|null} finalPreviewData - The fully-built previewData object
 * @param {string} templateId - '1' or '2'
 * @returns {{ animatedPreviewData, isAnimating, progress, startAnimation }}
 */
export function useImportAnimation(finalPreviewData, templateId = '1') {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedPreviewData, setAnimatedPreviewData] = useState(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const finalDataRef = useRef(finalPreviewData);

  // Keep ref in sync so animation loop always uses latest data
  useEffect(() => {
    finalDataRef.current = finalPreviewData;
  }, [finalPreviewData]);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setProgress(0);
    setAnimatedPreviewData(getEmptyPreview(templateId));
    startTimeRef.current = performance.now();

    // Throttle to ~20fps (50ms intervals) to avoid iframe write thrashing
    const FRAME_INTERVAL = 50;
    let lastFrameTime = 0;

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const rawP = Math.min(elapsed / ANIMATION_DURATION_MS, 1);

      // Only update state every FRAME_INTERVAL ms (or on completion)
      if (now - lastFrameTime >= FRAME_INTERVAL || rawP >= 1) {
        lastFrameTime = now;
        const eased = 1 - Math.pow(1 - rawP, 2.5);
        setProgress(eased);
        const snapshot = buildAnimatedPreview(finalDataRef.current, eased, templateId);
        setAnimatedPreviewData(snapshot);
      }

      if (rawP < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete — show full data
        setAnimatedPreviewData(finalDataRef.current);
        setIsAnimating(false);
        setProgress(1);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [templateId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    animatedPreviewData,
    isAnimating,
    progress,
    startAnimation,
  };
}
