/**
 * Resume Lab ATS Score Engine — Phase 1
 * ══════════════════════════════════════
 * Single source of truth for ATS scoring used by both template editors.
 *
 * Scoring Categories (100 points total):
 *   1. Job Description Match  — 40 pts
 *   2. Resume Completeness    — 15 pts
 *   3. Experience Quality     — 10 pts
 *   4. Projects Quality       — 10 pts
 *   5. Skills Section Quality — 10 pts
 *   6. Contact Information    —  5 pts
 *   7. Content Structure      — 10 pts
 *
 * Features:
 *   - Semantic synonym matching (React↔ReactJS, JS↔JavaScript, etc.)
 *   - Action verb detection
 *   - Measurable achievement detection (numbers, percentages)
 *   - Duplicate skill detection
 *   - Score delta tracking
 *   - Category-wise breakdown with strengths/weaknesses
 *
 * Note displayed to users:
 *   "This Resume Lab ATS Score estimates how well your resume aligns with
 *    the provided Job Description and common ATS/recruiter best practices.
 *    Different employers and ATS platforms may evaluate resumes differently."
 */

// ═══════════════════════════════════════════════════════════════════════
// TEXT UTILITIES
// ═══════════════════════════════════════════════════════════════════════

export const normalizeText = (value) =>
  String(value || '').toLowerCase().replace(/[^a-z0-9+#./\- ]+/g, ' ').replace(/\s+/g, ' ').trim();

// ═══════════════════════════════════════════════════════════════════════
// SYNONYM DICTIONARY — Semantic matching without AI
// ═══════════════════════════════════════════════════════════════════════

// Each array is a group of synonyms. If any term in the group appears in the
// job description, any other term in the same group found in the resume counts
// as a match.
const SYNONYM_GROUPS = [
  ['react', 'reactjs', 'react.js'],
  ['javascript', 'js'],
  ['typescript', 'ts'],
  ['node', 'nodejs', 'node.js'],
  ['next', 'nextjs', 'next.js'],
  ['vue', 'vuejs', 'vue.js'],
  ['angular', 'angularjs'],
  ['express', 'expressjs', 'express.js'],
  ['postgres', 'postgresql', 'psql'],
  ['mongo', 'mongodb'],
  ['artificial intelligence', 'ai'],
  ['machine learning', 'ml'],
  ['deep learning', 'dl'],
  ['natural language processing', 'nlp'],
  ['computer vision', 'cv'],
  ['amazon web services', 'aws'],
  ['google cloud platform', 'gcp', 'google cloud'],
  ['microsoft azure', 'azure'],
  ['kubernetes', 'k8s'],
  ['continuous integration', 'ci'],
  ['continuous deployment', 'cd'],
  ['ci/cd', 'ci cd', 'cicd'],
  ['docker', 'containerization'],
  ['rest', 'restful', 'rest api', 'restful api'],
  ['graphql', 'graph ql'],
  ['tensorflow', 'tf'],
  ['pytorch', 'torch'],
  ['scikit-learn', 'sklearn', 'scikit learn'],
  ['pandas', 'pd'],
  ['numpy', 'np'],
  ['dotnet', '.net', 'asp.net'],
  ['csharp', 'c#', 'c sharp'],
  ['cpp', 'c++'],
  ['golang', 'go'],
  ['ruby on rails', 'rails', 'ror'],
  ['spring boot', 'springboot', 'spring'],
  ['tailwind', 'tailwindcss', 'tailwind css'],
  ['sass', 'scss'],
  ['mysql', 'my sql'],
  ['redis', 'redis cache'],
  ['elasticsearch', 'elastic search', 'es'],
  ['rabbitmq', 'rabbit mq'],
  ['apache kafka', 'kafka'],
  ['power bi', 'powerbi'],
  ['user experience', 'ux'],
  ['user interface', 'ui'],
  ['ui/ux', 'ui ux', 'ux/ui'],
  ['microservices', 'micro services'],
  ['serverless', 'lambda', 'cloud functions'],
  ['infrastructure as code', 'iac', 'terraform'],
  ['object oriented', 'oop', 'object-oriented'],
  ['test driven development', 'tdd'],
  ['behavior driven development', 'bdd'],
  ['agile', 'scrum', 'kanban'],
  ['devops', 'dev ops'],
  ['mlops', 'ml ops'],
  ['data warehouse', 'dwh', 'data warehousing'],
  ['etl', 'extract transform load'],
  ['business intelligence', 'bi'],
  ['software development life cycle', 'sdlc'],
  ['version control', 'git', 'github', 'gitlab', 'bitbucket'],
];

// Build a lookup: normalized term → Set of all its synonyms
const _synonymLookup = new Map();
for (const group of SYNONYM_GROUPS) {
  const normalized = group.map((t) => normalizeText(t));
  for (const term of normalized) {
    if (!_synonymLookup.has(term)) _synonymLookup.set(term, new Set());
    for (const syn of normalized) {
      if (syn !== term) _synonymLookup.get(term).add(syn);
    }
  }
}

/**
 * Check if `haystack` contains `term` or any of its synonyms.
 */
const hasSynonymMatch = (haystack, term) => {
  if (haystack.includes(term)) return true;
  const syns = _synonymLookup.get(term);
  if (syns) {
    for (const syn of syns) {
      if (haystack.includes(syn)) return true;
    }
  }
  return false;
};

// ═══════════════════════════════════════════════════════════════════════
// KNOWN MULTI-WORD PHRASES (extract as single units from text)
// ═══════════════════════════════════════════════════════════════════════

export const KNOWN_PHRASES = [
  'machine learning', 'deep learning', 'natural language processing', 'computer vision',
  'full stack', 'data science', 'data engineering', 'data analysis', 'data visualization',
  'business intelligence', 'project management', 'product management', 'software development',
  'cloud computing', 'version control', 'continuous integration', 'continuous deployment',
  'user experience', 'user interface', 'agile methodology', 'rest api', 'web development',
  'power bi', 'google cloud', 'microsoft azure', 'amazon web services',
  'node.js', 'react.js', 'next.js', 'vue.js', 'express.js', 'tailwind css',
  'ci cd', 'ci/cd', 'micro services', 'distributed systems', 'api gateway',
  'ruby on rails', 'spring boot', 'test driven development', 'object oriented',
  'infrastructure as code', 'software development life cycle',
  'apache kafka', 'scikit-learn', 'scikit learn',
];

// ═══════════════════════════════════════════════════════════════════════
// KEYWORD DISPLAY MAP
// ═══════════════════════════════════════════════════════════════════════

export const KEYWORD_DISPLAY_MAP = {
  'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python',
  'java': 'Java', 'golang': 'Go', 'go': 'Go', 'php': 'PHP', 'ruby': 'Ruby',
  'swift': 'Swift', 'kotlin': 'Kotlin', 'scala': 'Scala', 'rust': 'Rust',
  'cpp': 'C++', 'c++': 'C++', 'csharp': 'C#', 'c#': 'C#',
  'node.js': 'Node.js', 'nodejs': 'Node.js', 'node': 'Node.js',
  'react.js': 'React', 'reactjs': 'React', 'react': 'React',
  'next.js': 'Next.js', 'nextjs': 'Next.js',
  'vue.js': 'Vue.js', 'vuejs': 'Vue.js', 'angular': 'Angular',
  'express.js': 'Express.js', 'express': 'Express',
  'tailwind css': 'Tailwind CSS', 'tailwindcss': 'Tailwind CSS',
  'html': 'HTML', 'css': 'CSS', 'sass': 'SASS', 'scss': 'SCSS',
  'sql': 'SQL', 'nosql': 'NoSQL', 'mysql': 'MySQL', 'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL',
  'redis': 'Redis', 'firebase': 'Firebase',
  'aws': 'AWS', 'gcp': 'GCP', 'azure': 'Azure', 'api': 'API',
  'rest': 'REST', 'restful': 'RESTful', 'graphql': 'GraphQL',
  'ci cd': 'CI/CD', 'ci/cd': 'CI/CD', 'cicd': 'CI/CD',
  'git': 'Git', 'github': 'GitHub', 'gitlab': 'GitLab', 'docker': 'Docker',
  'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes',
  'linux': 'Linux', 'nginx': 'NGINX',
  'machine learning': 'Machine Learning', 'deep learning': 'Deep Learning',
  'natural language processing': 'NLP', 'computer vision': 'Computer Vision',
  'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch',
  'power bi': 'Power BI', 'tableau': 'Tableau', 'excel': 'Excel',
  'microsoft azure': 'Microsoft Azure', 'google cloud': 'Google Cloud',
  'amazon web services': 'AWS', 'full stack': 'Full Stack',
  'devops': 'DevOps', 'mlops': 'MLOps', 'agile': 'Agile', 'scrum': 'Scrum',
  'kanban': 'Kanban', 'figma': 'Figma', 'selenium': 'Selenium',
  'data science': 'Data Science', 'data analysis': 'Data Analysis',
  'data engineering': 'Data Engineering', 'data visualization': 'Data Visualization',
  'rest api': 'REST API', 'web development': 'Web Development',
  'cloud computing': 'Cloud Computing', 'project management': 'Project Management',
  'product management': 'Product Management', 'software development': 'Software Development',
  'micro services': 'Microservices', 'microservices': 'Microservices',
};

export const formatKeyword = (kw) => {
  const lower = String(kw || '').toLowerCase().trim();
  if (KEYWORD_DISPLAY_MAP[lower]) return KEYWORD_DISPLAY_MAP[lower];
  return kw.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// ═══════════════════════════════════════════════════════════════════════
// KEYWORD EXTRACTION
// ═══════════════════════════════════════════════════════════════════════

const STOP_WORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'to', 'for', 'of', 'in', 'with', 'on', 'by',
  'from', 'at', 'as', 'is', 'are', 'be', 'this', 'that', 'using', 'use',
  'will', 'have', 'has', 'been', 'able', 'should', 'must', 'can', 'you',
  'your', 'we', 'our', 'their', 'its', 'also', 'not', 'but', 'more', 'than',
  'who', 'which', 'when', 'what', 'how', 'all', 'any', 'some', 'new', 'other',
  'each', 'year', 'work', 'team', 'role', 'like', 'well', 'good', 'best',
  'help', 'make', 'know', 'take', 'need', 'want', 'plus', 'etc', 'experience',
  'strong', 'preferred', 'required', 'minimum', 'ability', 'working', 'including',
  'such', 'related', 'environment', 'responsible', 'knowledge', 'skills',
  'requirements', 'qualifications', 'about', 'join', 'looking', 'ideal',
]);

export const splitKeywords = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const found = new Set();
  // First pass: extract known multi-word phrases as units
  for (const phrase of KNOWN_PHRASES) {
    if (normalized.includes(phrase)) found.add(phrase);
  }
  // Second pass: single meaningful words not already covered by a phrase
  normalized.split(' ').forEach((word) => {
    if (word.length > 2 && !STOP_WORDS.has(word) && !found.has(word)) {
      const isPartOfPhrase = [...found].some((p) => p.includes(word) && p !== word);
      if (!isPartOfPhrase) found.add(word);
    }
  });
  return [...found].slice(0, 50);
};

// ═══════════════════════════════════════════════════════════════════════
// HEURISTIC HELPERS
// ═══════════════════════════════════════════════════════════════════════

// Strong action verbs that recruiters love
const ACTION_VERBS = new Set([
  'achieved', 'accelerated', 'architected', 'automated', 'built', 'collaborated',
  'configured', 'created', 'decreased', 'delivered', 'deployed', 'designed',
  'developed', 'drove', 'eliminated', 'enabled', 'engineered', 'enhanced',
  'established', 'executed', 'expanded', 'generated', 'grew', 'identified',
  'implemented', 'improved', 'increased', 'integrated', 'introduced', 'launched',
  'led', 'managed', 'migrated', 'modernized', 'optimized', 'orchestrated',
  'overhauled', 'pioneered', 'planned', 'produced', 'reduced', 'refactored',
  'redesigned', 'resolved', 'revamped', 'scaled', 'secured', 'simplified',
  'spearheaded', 'streamlined', 'strengthened', 'supervised', 'supported',
  'transformed', 'upgraded', 'utilized', 'wrote', 'analyzed', 'conducted',
  'coordinated', 'mentored', 'monitored', 'negotiated', 'presented',
  'published', 'researched', 'restructured', 'trained', 'translated',
]);

/** Check if a bullet starts with a strong action verb */
export const startsWithActionVerb = (bullet) => {
  const first = normalizeText(bullet).split(' ')[0];
  return ACTION_VERBS.has(first);
};

/** Check if a bullet contains measurable achievements (numbers, %, $, x) */
export const hasMeasurableResult = (bullet) =>
  /\d+%|\$[\d,]+|\d+x|\d+\+?\s*(users|clients|customers|projects|teams|apps|endpoints|requests|transactions|downloads|servers|microservices)/i.test(bullet) ||
  /\b(increased|decreased|reduced|improved|grew|saved|cut)\b.*\b\d/i.test(bullet);

/** Check if bullet mentions technologies */
const mentionsTech = (bullet) => {
  const lower = bullet.toLowerCase();
  return SYNONYM_GROUPS.some((group) => group.some((term) => lower.includes(term)));
};

/**
 * Get feedback for a single bullet point.
 * Only flags structural issues that are actually fixable:
 *   - No action verb at start
 *   - No measurable result (for bullets 8+ words)
 * Returns a string hint if weak, or null if the bullet is fine.
 * Once AI fixes it (adds action verb / metric), this returns null → hint disappears.
 */
export const getBulletFeedback = (bullet) => {
  if (!bullet || !String(bullet).trim()) return null;
  const text = String(bullet).trim();
  if (text.split(/\s+/).length < 5) return null; // Too short to judge
  if (!startsWithActionVerb(text)) return 'Start with an action verb (Built, Developed, Led...)';
  if (!hasMeasurableResult(text) && text.split(/\s+/).length >= 8) return 'Add a number or metric for impact';
  return null;
};

// ═══════════════════════════════════════════════════════════════════════
// SESSION STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════

export const getTargetJobContext = () => {
  if (typeof window === 'undefined') return { title: '', description: '' };
  try {
    const saved = window.sessionStorage.getItem('ResumeLab-target-job');
    if (!saved) return { title: '', description: '' };
    const parsed = JSON.parse(saved);
    const title = String(parsed?.title || parsed?.targetJobTitle || '').trim();
    let description = String(parsed?.description || parsed?.targetJobDescription || '').trim();
    // Fallback: if no job description provided, use role-based ATS keywords
    if (!description && title && typeof window !== 'undefined' && window.__atsKeywordsCache) {
      const keywords = window.__atsKeywordsCache(title);
      if (keywords && keywords.length) {
        description = keywords.join(', ');
      }
    }
    return { title, description };
  } catch {
    return { title: '', description: '' };
  }
};

// ═══════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

/** Resolve field names for templates. Defaults are template 1. */
const resolveFields = (fieldMap = {}) => ({
  personal: { name: 'fullName', title: 'professionalTitle', email: 'emailAddress', phone: 'phoneNumber', linkedin: 'linkedInUrl', github: 'github', ...(fieldMap.personal || {}) },
  experience: { company: 'companyName', role: 'role', toolsUsed: 'toolsUsed', ...(fieldMap.experience || {}) },
  projects: { name: 'projectName', tech: 'technologiesUsed', description: null, ...(fieldMap.projects || {}) },
  certifications: { title: 'certificationName', ...(fieldMap.certifications || {}) },
});

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 1: JOB DESCRIPTION MATCH (40 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreJobDescriptionMatch(data, targetJob, fieldMap = {}) {
  const f = resolveFields(fieldMap);
  const jdText = `${targetJob.title || ''} ${targetJob.description || ''}`;
  const jdTerms = splitKeywords(jdText);
  if (!jdTerms.length) return { score: 0, matched: [], missing: [], total: 0 };

  // Build full resume text
  const resumeParts = [
    data.personal?.[f.personal.title],
    data.summary,
    ...(Array.isArray(data.skills) ? data.skills.flatMap((g) => [g.category, ...(g.items || [])]) : []),
    ...(Array.isArray(data.experience) ? data.experience.flatMap((e) => [e[f.experience.company], e[f.experience.role], e[f.experience.toolsUsed], ...(e.bullets || [])]) : []),
    ...(Array.isArray(data.projects) ? data.projects.flatMap((p) => [p[f.projects.name], p[f.projects.tech], ...(Array.isArray(p.bullets) ? p.bullets : []), f.projects.description ? p[f.projects.description] : '']) : []),
    ...(Array.isArray(data.certifications) ? data.certifications.map((c) => [c[f.certifications.title], c.issuer, c.description].join(' ')) : []),
    ...(Array.isArray(data.education) ? data.education.map((e) => [e.degree, e.institution, e.coursework].join(' ')) : []),
  ];
  const resumeHaystack = normalizeText(resumeParts.join(' '));

  const matched = [];
  const missing = [];
  for (const term of jdTerms) {
    if (hasSynonymMatch(resumeHaystack, term)) matched.push(term);
    else missing.push(term);
  }

  const matchRatio = jdTerms.length > 0 ? matched.length / jdTerms.length : 0;
  // Scale: 0% match = 0pts, 100% match = 40pts (non-linear to reward getting past 50%)
  const score = Math.round(40 * Math.pow(matchRatio, 0.8));
  return { score: clamp(score * 2.5), matched, missing, total: jdTerms.length };
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 2: RESUME COMPLETENESS (15 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreCompleteness(data, fieldMap = {}) {
  const f = resolveFields(fieldMap);
  const noSummary = fieldMap.noSummary || false;
  let score = 0;
  const missing = [];

  // Contact (2pts)
  if (String(data.personal?.[f.personal.email] || '').trim()) score += 1;
  else missing.push('Email address');
  if (String(data.personal?.[f.personal.phone] || '').trim()) score += 1;
  else missing.push('Phone number');

  // Summary (2pts) — skip for template 2. Validate it's actually a summary, not junk.
  if (!noSummary) {
    const summaryText = String(data.summary || '').trim();
    const summaryWords = summaryText.split(/\s+/).length;
    // Detect junk: contains email+degree, or starts with "Email:", or is education data
    const isJunk = summaryText && (
      /^(email|phone|tel|mobile|contact)[:\s]/i.test(summaryText) ||
      (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(summaryText) && /\b(college|university|institute|b\.?tech|bachelor)\b/i.test(summaryText)) ||
      (/\b(bachelor|b\.?tech|b\.?sc|m\.?tech|graduated|graduation|pursuing)\b/i.test(summaryText) && !/\b(experience|developed|built|managed|led|years?)\b/i.test(summaryText))
    );
    if (isJunk) { missing.push('Professional summary (current text appears to be contact/education info)'); }
    else if (summaryWords >= 10) score += 2;
    else if (summaryText) score += 1;
    else missing.push('Professional summary');
  } else {
    score += 2; // auto-award if template doesn't have summary
  }

  // Skills (3pts)
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const filledSkills = skills.filter((g) => g.category?.trim() && g.items?.some((i) => String(i).trim()));
  if (filledSkills.length >= 2) score += 3;
  else if (filledSkills.length === 1) score += 2;
  else missing.push('Skills section');

  // Experience (3pts)
  const exp = Array.isArray(data.experience) ? data.experience : [];
  const filledExp = exp.filter((e) => String(e[f.experience.company] || '').trim() && String(e[f.experience.role] || '').trim());
  if (filledExp.length >= 2) score += 3;
  else if (filledExp.length === 1) score += 2;
  else missing.push('Work experience');

  // Projects (2pts)
  const proj = Array.isArray(data.projects) ? data.projects : [];
  const filledProj = proj.filter((p) => String(p[f.projects.name] || '').trim());
  if (filledProj.length >= 1) score += 2;
  else missing.push('Projects section');

  // Education (2pts)
  const edu = Array.isArray(data.education) ? data.education : [];
  const filledEdu = edu.filter((e) => e.degree?.trim() && e.institution?.trim());
  if (filledEdu.length >= 1) score += 2;
  else missing.push('Education');

  // Certifications (1pt bonus)
  const certs = Array.isArray(data.certifications) ? data.certifications : [];
  if (certs.some((c) => String(c[f.certifications.title] || '').trim())) score += 1;

  return { score: clamp(Math.round((score / 16) * 100)), missing };
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 3: EXPERIENCE QUALITY (10 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreExperienceQuality(data, fieldMap = {}) {
  const f = resolveFields(fieldMap);
  const items = Array.isArray(data.experience) ? data.experience : [];
  const allBullets = items.flatMap((e) => (Array.isArray(e.bullets) ? e.bullets.filter((b) => String(b).trim()) : []));
  if (!allBullets.length) return { score: 0, strengths: [], weaknesses: ['No experience bullets found'] };

  const strengths = [];
  const weaknesses = [];
  let totalPoints = 0;

  // Action verbs (up to 35 pts of 100)
  const actionCount = allBullets.filter(startsWithActionVerb).length;
  const actionRatio = actionCount / allBullets.length;
  totalPoints += Math.round(actionRatio * 35);
  if (actionRatio >= 0.7) strengths.push('Strong action verbs');
  else if (actionRatio < 0.3) weaknesses.push('Start bullets with action verbs (Built, Developed, Led...)');

  // Measurable results (up to 30 pts of 100)
  const measurableCount = allBullets.filter(hasMeasurableResult).length;
  const measurableRatio = allBullets.length > 0 ? measurableCount / allBullets.length : 0;
  totalPoints += Math.round(measurableRatio * 30);
  if (measurableCount >= 2) strengths.push('Includes measurable achievements');
  else weaknesses.push('Add numbers, percentages, or metrics to bullets');

  // Technology mentions (up to 20 pts of 100)
  const techCount = allBullets.filter(mentionsTech).length;
  const techRatio = allBullets.length > 0 ? techCount / allBullets.length : 0;
  totalPoints += Math.round(techRatio * 20);
  if (techRatio >= 0.4) strengths.push('Technologies mentioned in context');

  // Bullet count/depth (up to 15 pts of 100)
  const avgBulletsPerRole = items.length > 0 ? allBullets.length / items.filter((e) => String(e[f.experience.company] || '').trim()).length : 0;
  if (avgBulletsPerRole >= 3) totalPoints += 15;
  else if (avgBulletsPerRole >= 2) totalPoints += 10;
  else { totalPoints += 5; weaknesses.push('Add more detail per role (3+ bullets recommended)'); }

  return { score: clamp(totalPoints), strengths, weaknesses };
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 4: PROJECTS QUALITY (10 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreProjectsQuality(data, targetJob, fieldMap = {}) {
  const f = resolveFields(fieldMap);
  const items = Array.isArray(data.projects) ? data.projects : [];
  const filled = items.filter((p) => String(p[f.projects.name] || '').trim());
  if (!filled.length) return { score: 0, strengths: [], weaknesses: ['No projects added'] };

  const strengths = [];
  const weaknesses = [];
  let totalPoints = 0;

  // Has technologies listed (25 pts of 100)
  const withTech = filled.filter((p) => String(p[f.projects.tech] || '').trim()).length;
  const techRatio = withTech / filled.length;
  totalPoints += Math.round(techRatio * 25);
  if (techRatio >= 0.8) strengths.push('Technologies listed for projects');
  else weaknesses.push('Add technologies used in each project');

  // Description quality — has bullets or description (30 pts of 100)
  const withDesc = filled.filter((p) => {
    if (Array.isArray(p.bullets) && p.bullets.some((b) => String(b).trim())) return true;
    if (f.projects.description && String(p[f.projects.description] || '').trim()) return true;
    return false;
  }).length;
  const descRatio = withDesc / filled.length;
  totalPoints += Math.round(descRatio * 30);
  if (descRatio >= 0.8) strengths.push('Good project descriptions');
  else weaknesses.push('Add detailed descriptions to projects');

  // Relevance to JD (30 pts of 100)
  const jdTerms = splitKeywords(`${targetJob.title || ''} ${targetJob.description || ''}`);
  if (jdTerms.length) {
    const projText = normalizeText(filled.map((p) => [p[f.projects.name], p[f.projects.tech], ...(Array.isArray(p.bullets) ? p.bullets : []), f.projects.description ? p[f.projects.description] : ''].join(' ')).join(' '));
    const matchCount = jdTerms.filter((term) => hasSynonymMatch(projText, term)).length;
    const relevance = matchCount / jdTerms.length;
    totalPoints += Math.round(relevance * 30);
    if (relevance >= 0.3) strengths.push('Projects relevant to target role');
    else weaknesses.push('Add projects related to the target job');
  } else {
    totalPoints += 15; // No JD provided, give partial credit
  }

  // Quantity bonus (15 pts of 100)
  if (filled.length >= 3) totalPoints += 15;
  else if (filled.length >= 2) totalPoints += 10;
  else totalPoints += 5;

  return { score: clamp(totalPoints), strengths, weaknesses };
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 5: SKILLS SECTION QUALITY (10 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreSkillsQuality(data, targetJob, fieldMap = {}) {
  const groups = Array.isArray(data.skills) ? data.skills : [];
  const allItems = groups.flatMap((g) => (Array.isArray(g.items) ? g.items.filter((i) => String(i).trim()) : []));
  if (!allItems.length) return { score: 0, strengths: [], weaknesses: ['No skills listed'], duplicates: [] };

  const strengths = [];
  const weaknesses = [];
  let totalPoints = 0;

  // Skill relevance to JD (40 pts of 100)
  const jdTerms = splitKeywords(`${targetJob.title || ''} ${targetJob.description || ''}`);
  if (jdTerms.length) {
    const skillsText = normalizeText(allItems.join(' '));
    const matchCount = jdTerms.filter((term) => hasSynonymMatch(skillsText, term)).length;
    const relevance = matchCount / Math.min(jdTerms.length, 20);
    totalPoints += Math.round(Math.min(relevance, 1) * 40);
    if (relevance >= 0.4) strengths.push('Skills match job requirements');
    else weaknesses.push('Add more skills from the job description');
  } else {
    totalPoints += 20;
  }

  // Categorization (20 pts of 100)
  const categorized = groups.filter((g) => g.category?.trim() && g.items?.some((i) => String(i).trim())).length;
  if (categorized >= 2) { totalPoints += 20; strengths.push('Skills well-categorized'); }
  else if (categorized === 1) totalPoints += 12;
  else weaknesses.push('Organize skills into categories');

  // Duplicate detection (deduct up to 15 pts)
  const seen = new Map();
  const duplicates = [];
  for (const item of allItems) {
    const key = normalizeText(item);
    if (!key) continue;
    // Also check synonym equivalence
    let foundDup = false;
    for (const [existing] of seen) {
      if (existing === key || hasSynonymMatch(existing, key) || hasSynonymMatch(key, existing)) {
        duplicates.push(item);
        foundDup = true;
        break;
      }
    }
    if (!foundDup) seen.set(key, item);
  }
  if (duplicates.length === 0) totalPoints += 15;
  else if (duplicates.length <= 2) totalPoints += 8;
  else weaknesses.push(`Remove duplicate skills: ${duplicates.slice(0, 3).join(', ')}`);

  // Quantity (25 pts of 100)
  const uniqueCount = seen.size;
  if (uniqueCount >= 10) totalPoints += 25;
  else if (uniqueCount >= 6) totalPoints += 18;
  else if (uniqueCount >= 3) totalPoints += 10;
  else weaknesses.push('Add more relevant skills');

  return { score: clamp(totalPoints), strengths, weaknesses, duplicates };
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 6: CONTACT INFORMATION (5 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreContact(data, fieldMap = {}) {
  const f = resolveFields(fieldMap);
  const p = data.personal || {};
  let totalPoints = 0;
  const strengths = [];
  const weaknesses = [];

  // Email (30 pts of 100) — essential
  if (String(p[f.personal.email] || '').trim()) { totalPoints += 30; }
  else weaknesses.push('Add email address');

  // Phone (25 pts of 100) — essential
  if (String(p[f.personal.phone] || '').trim()) { totalPoints += 25; }
  else weaknesses.push('Add phone number');

  // LinkedIn (25 pts of 100) — recommended
  if (String(p[f.personal.linkedin] || '').trim()) { totalPoints += 25; strengths.push('LinkedIn included'); }
  else weaknesses.push('Add LinkedIn profile (recommended)');

  // Name (20 pts of 100)
  if (String(p[f.personal.name] || '').trim()) totalPoints += 20;
  else weaknesses.push('Add your full name');

  // GitHub (bonus — doesn't penalize if missing, only rewards if present)
  if (String(p[f.personal.github] || '').trim()) { strengths.push('GitHub included'); }

  return { score: clamp(totalPoints), strengths, weaknesses };
}

// ═══════════════════════════════════════════════════════════════════════
// CATEGORY 7: CONTENT STRUCTURE (10 points)
// ═══════════════════════════════════════════════════════════════════════

function scoreContentStructure(data, fieldMap = {}) {
  const f = resolveFields(fieldMap);
  const noSummary = fieldMap.noSummary || false;
  let totalPoints = 0;
  const strengths = [];
  const weaknesses = [];

  // Section presence/order — all major sections filled (30 pts of 100)
  let sectionCount = 0;
  if (Array.isArray(data.skills) && data.skills.some((g) => g.items?.some((i) => String(i).trim()))) sectionCount++;
  if (Array.isArray(data.experience) && data.experience.some((e) => String(e[f.experience.company] || '').trim())) sectionCount++;
  if (Array.isArray(data.projects) && data.projects.some((p) => String(p[f.projects.name] || '').trim())) sectionCount++;
  if (Array.isArray(data.education) && data.education.some((e) => e.degree?.trim())) sectionCount++;
  if (!noSummary && String(data.summary || '').trim()) sectionCount++;
  if (noSummary) sectionCount++; // auto-credit
  const sectionScore = Math.min(sectionCount, 5);
  totalPoints += Math.round((sectionScore / 5) * 30);
  if (sectionCount >= 5) strengths.push('All major sections present');

  // Bullet points used in experience (25 pts of 100)
  const expBullets = (Array.isArray(data.experience) ? data.experience : [])
    .flatMap((e) => (Array.isArray(e.bullets) ? e.bullets.filter((b) => String(b).trim()) : []));
  if (expBullets.length >= 4) { totalPoints += 25; strengths.push('Good use of bullet points'); }
  else if (expBullets.length >= 2) totalPoints += 15;
  else weaknesses.push('Use bullet points to describe experience');

  // Consistent formatting — bullets not too short, not too long (20 pts of 100)
  const bulletLengths = expBullets.map((b) => String(b).trim().split(/\s+/).length);
  const goodLength = bulletLengths.filter((len) => len >= 6 && len <= 30).length;
  const lengthRatio = bulletLengths.length > 0 ? goodLength / bulletLengths.length : 0;
  totalPoints += Math.round(lengthRatio * 20);
  if (lengthRatio < 0.5 && bulletLengths.length > 0) weaknesses.push('Keep bullets between 6-30 words');

  // No empty/duplicate sections (15 pts of 100)
  const expCompanies = (Array.isArray(data.experience) ? data.experience : []).map((e) => normalizeText(e[f.experience.company])).filter(Boolean);
  const hasDupExp = new Set(expCompanies).size < expCompanies.length;
  if (!hasDupExp) totalPoints += 15;
  else weaknesses.push('Remove duplicate experience entries');

  // Summary length (10 pts of 100) — validate it's actually a summary
  if (!noSummary) {
    const summaryText = String(data.summary || '').trim();
    const summaryWords = summaryText.split(/\s+/).filter(Boolean).length;
    const isJunk = summaryText && (
      /^(email|phone|tel|mobile|contact)[:\s]/i.test(summaryText) ||
      (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(summaryText) && /\b(college|university|institute|b\.?tech|bachelor)\b/i.test(summaryText)) ||
      (/\b(bachelor|b\.?tech|b\.?sc|m\.?tech|graduated|graduation|pursuing)\b/i.test(summaryText) && !/\b(experience|developed|built|managed|led|years?)\b/i.test(summaryText))
    );
    if (isJunk) { weaknesses.push('Summary contains contact/education info — rewrite it as a professional summary'); }
    else if (summaryWords >= 20 && summaryWords <= 60) { totalPoints += 10; }
    else if (summaryWords > 0) totalPoints += 5;
    else weaknesses.push('Add a 20-60 word professional summary');
  } else {
    totalPoints += 10;
  }

  return { score: clamp(totalPoints), strengths, weaknesses };
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN SCORING ENGINE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Category weights (must sum to 100):
 *   Job Description Match:  40
 *   Resume Completeness:    15
 *   Experience Quality:     10
 *   Projects Quality:       10
 *   Skills Quality:         10
 *   Contact Information:     5
 *   Content Structure:      10
 */
const CATEGORY_WEIGHTS = {
  jdMatch: 40,
  completeness: 15,
  experienceQuality: 10,
  projectsQuality: 10,
  skillsQuality: 10,
  contact: 5,
  contentStructure: 10,
};

/**
 * Compute the full ATS breakdown.
 * Returns category scores (0-100 each), weighted overall, strengths, weaknesses, etc.
 */
export function computeAtsBreakdown(data, targetJob = { title: '', description: '' }, fieldMap = {}) {
  // Determine if user provided a JD or if we're using keyword fallback
  let userProvidedJd = true;
  try {
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem('ResumeLab-target-job');
      if (saved) {
        const parsed = JSON.parse(saved);
        const originalDesc = String(parsed?.description || parsed?.targetJobDescription || '').trim();
        if (!originalDesc) userProvidedJd = false;
      }
    }
  } catch {}

  const jd = scoreJobDescriptionMatch(data, targetJob, fieldMap);
  const completeness = scoreCompleteness(data, fieldMap);
  const expQuality = scoreExperienceQuality(data, fieldMap);
  const projQuality = scoreProjectsQuality(data, targetJob, fieldMap);
  const skillsQuality = scoreSkillsQuality(data, targetJob, fieldMap);
  const contact = scoreContact(data, fieldMap);
  const structure = scoreContentStructure(data, fieldMap);

  // Weighted overall (each category score is 0-100, weight is max contribution)
  const overall = clamp(
    (jd.score / 100) * CATEGORY_WEIGHTS.jdMatch +
    (completeness.score / 100) * CATEGORY_WEIGHTS.completeness +
    (expQuality.score / 100) * CATEGORY_WEIGHTS.experienceQuality +
    (projQuality.score / 100) * CATEGORY_WEIGHTS.projectsQuality +
    (skillsQuality.score / 100) * CATEGORY_WEIGHTS.skillsQuality +
    (contact.score / 100) * CATEGORY_WEIGHTS.contact +
    (structure.score / 100) * CATEGORY_WEIGHTS.contentStructure
  );

  // Aggregate strengths and weaknesses
  const allStrengths = [
    ...expQuality.strengths,
    ...projQuality.strengths,
    ...skillsQuality.strengths,
    ...contact.strengths,
    ...structure.strengths,
  ];
  if (jd.matched.length > 0 && jd.total > 0 && jd.matched.length / jd.total >= 0.5) {
    allStrengths.unshift('Good keyword match with job description');
  }

  const allWeaknesses = [
    ...expQuality.weaknesses,
    ...projQuality.weaknesses,
    ...skillsQuality.weaknesses,
    ...contact.weaknesses,
    ...structure.weaknesses,
  ];

  // High priority = items from categories with highest weight that score low
  const highPriority = [];
  const lowPriority = [];
  if (jd.score < 50 && jd.total > 0) highPriority.push('Improve keyword match with the job description');
  if (completeness.score < 60) highPriority.push(...completeness.missing.slice(0, 2).map((m) => `Add ${m}`));
  if (expQuality.score < 40) highPriority.push(...expQuality.weaknesses.slice(0, 1));
  if (skillsQuality.score < 40) highPriority.push(...skillsQuality.weaknesses.slice(0, 1));
  // Low priority
  if (contact.score < 80) lowPriority.push(...contact.weaknesses.filter((w) => w.includes('recommended')));
  if (structure.score < 70) lowPriority.push(...structure.weaknesses.slice(0, 1));

  return {
    overall,
    categories: {
      jdMatch: { score: jd.score, maxPoints: CATEGORY_WEIGHTS.jdMatch, label: userProvidedJd ? 'Job Description Match' : 'Keyword Match', matched: jd.matched, missing: jd.missing, total: jd.total },
      completeness: { score: completeness.score, maxPoints: CATEGORY_WEIGHTS.completeness, label: 'Resume Completeness', missing: completeness.missing },
      experienceQuality: { score: expQuality.score, maxPoints: CATEGORY_WEIGHTS.experienceQuality, label: 'Experience Quality', strengths: expQuality.strengths, weaknesses: expQuality.weaknesses },
      projectsQuality: { score: projQuality.score, maxPoints: CATEGORY_WEIGHTS.projectsQuality, label: 'Projects Quality', strengths: projQuality.strengths, weaknesses: projQuality.weaknesses },
      skillsQuality: { score: skillsQuality.score, maxPoints: CATEGORY_WEIGHTS.skillsQuality, label: 'Skills Quality', strengths: skillsQuality.strengths, weaknesses: skillsQuality.weaknesses, duplicates: skillsQuality.duplicates },
      contact: { score: contact.score, maxPoints: CATEGORY_WEIGHTS.contact, label: 'Contact Information', strengths: contact.strengths, weaknesses: contact.weaknesses },
      contentStructure: { score: structure.score, maxPoints: CATEGORY_WEIGHTS.contentStructure, label: 'Content Structure', strengths: structure.strengths, weaknesses: structure.weaknesses },
    },
    strengths: allStrengths.slice(0, 5),
    weaknesses: allWeaknesses.slice(0, 5),
    highPriority: highPriority.slice(0, 3),
    lowPriority: lowPriority.slice(0, 3),
    missingKeywords: jd.missing.slice(0, 10),
    matchedKeywords: jd.matched.slice(0, 10),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// BACKWARD-COMPATIBLE EXPORTS
// These maintain the same interface the editors currently use.
// ═══════════════════════════════════════════════════════════════════════

/**
 * Per-section score for step rail badges.
 * Each section is scored individually: completeness + quality + JD keyword relevance.
 */
export const getAtsSectionScore = (section, data, targetJob = { title: '', description: '' }, fieldMap = {}) => {
  const f = resolveFields(fieldMap);
  const jdTerms = splitKeywords(`${targetJob.title || ''} ${targetJob.description || ''}`);
  const countKeywordMatches = (text) => {
    if (!jdTerms.length) return 0;
    const haystack = normalizeText(text);
    return jdTerms.filter((term) => hasSynonymMatch(haystack, term)).length;
  };
  const kwBonus = (text, max) => jdTerms.length ? Math.min(Math.round((countKeywordMatches(text) / Math.min(jdTerms.length, 10)) * max), max) : 0;

  switch (section) {
    case 'personal': {
      const p = data.personal || {};
      let score = 0;
      if (String(p[f.personal.name] || '').trim()) score += 30;
      if (String(p[f.personal.email] || '').trim()) score += 25;
      if (String(p[f.personal.phone] || '').trim()) score += 25;
      if (String(p[f.personal.linkedin] || '').trim()) score += 20;
      return clamp(score);
    }
    case 'summary': {
      const text = String(data.summary || '').trim();
      if (!text) return 0;
      // Detect junk summary (contact/education info)
      const isJunk = /^(email|phone|tel|mobile)[:\s]/i.test(text) ||
        (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text) && /\b(college|university|b\.?tech|bachelor)\b/i.test(text)) ||
        (/\b(bachelor|b\.?tech|graduated|pursuing)\b/i.test(text) && !/\b(experience|developed|built|managed|led|years?)\b/i.test(text));
      if (isJunk) return 0;
      let score = 0;
      const words = text.split(/\s+/).length;
      if (words >= 20 && words <= 60) score += 50;
      else if (words >= 10) score += 35;
      else score += 15;
      score += kwBonus(text, 30);
      // Quality: does it sound professional?
      if (/\b(experience|skilled|passionate|proficient|expertise|years?)\b/i.test(text)) score += 20;
      return clamp(score);
    }
    case 'skills': {
      const groups = Array.isArray(data.skills) ? data.skills : [];
      const filled = groups.filter((g) => g.category?.trim() && g.items?.some((i) => String(i).trim()));
      if (!filled.length) return 0;
      let score = 0;
      // Categorization
      if (filled.length >= 3) score += 30;
      else if (filled.length >= 2) score += 25;
      else score += 15;
      // Quantity of skills
      const totalSkills = filled.reduce((c, g) => c + g.items.filter(Boolean).length, 0);
      if (totalSkills >= 12) score += 25;
      else if (totalSkills >= 6) score += 15;
      else score += 8;
      // JD keyword match
      const allSkillsText = filled.map((g) => [g.category, ...g.items].join(' ')).join(' ');
      score += kwBonus(allSkillsText, 45);
      return clamp(score);
    }
    case 'experience': {
      const items = Array.isArray(data.experience) ? data.experience : [];
      const filled = items.filter((e) => String(e[f.experience.company] || '').trim() || String(e[f.experience.role] || '').trim());
      if (!filled.length) return 0;
      let score = 0;
      // Completeness: company + role + dates filled
      const complete = filled.filter((e) => String(e[f.experience.company] || '').trim() && String(e[f.experience.role] || '').trim() && (e.startDate || e.endDate));
      score += Math.min(Math.round((complete.length / Math.max(filled.length, 1)) * 30), 30);
      // Bullet quality
      const allBullets = filled.flatMap((e) => (e.bullets || []).filter((b) => String(b).trim()));
      if (allBullets.length >= 3) score += 15;
      else if (allBullets.length >= 1) score += 8;
      const actionCount = allBullets.filter(startsWithActionVerb).length;
      if (allBullets.length > 0 && actionCount / allBullets.length >= 0.6) score += 15;
      else if (actionCount > 0) score += 8;
      const measurable = allBullets.filter(hasMeasurableResult).length;
      if (measurable >= 2) score += 10;
      else if (measurable >= 1) score += 5;
      // JD keywords
      const expText = filled.map((e) => [e[f.experience.company], e[f.experience.role], e[f.experience.toolsUsed], ...(e.bullets || [])].join(' ')).join(' ');
      score += kwBonus(expText, 30);
      return clamp(score);
    }
    case 'projects': {
      const items = Array.isArray(data.projects) ? data.projects : [];
      const filled = items.filter((p) => String(p[f.projects.name] || '').trim());
      if (!filled.length) return 0;
      let score = 0;
      // Has projects
      if (filled.length >= 3) score += 25;
      else if (filled.length >= 2) score += 20;
      else score += 12;
      // Technologies listed
      const withTech = filled.filter((p) => String(p[f.projects.tech] || '').trim()).length;
      score += Math.round((withTech / filled.length) * 25);
      // Description/bullets
      const withDesc = filled.filter((p) => (Array.isArray(p.bullets) && p.bullets.some((b) => String(b).trim())) || (f.projects.description && String(p[f.projects.description] || '').trim())).length;
      score += Math.round((withDesc / filled.length) * 20);
      // JD keywords
      const projText = filled.map((p) => [p[f.projects.name], p[f.projects.tech], ...(Array.isArray(p.bullets) ? p.bullets : []), f.projects.description ? p[f.projects.description] : ''].join(' ')).join(' ');
      score += kwBonus(projText, 30);
      return clamp(score);
    }
    case 'certifications': {
      const items = Array.isArray(data.certifications) ? data.certifications : [];
      const filled = items.filter((c) => String(c[f.certifications.title] || '').trim());
      if (!filled.length) return 0;
      let score = 0;
      const hasJD = jdTerms.length > 0;
      // Quantity — scale by how many the user added (max 40 with JD, else 50)
      if (filled.length >= 3) score += hasJD ? 40 : 50;
      else if (filled.length >= 2) score += hasJD ? 30 : 40;
      else score += hasJD ? 20 : 30;
      // Has issuer (max 30 with JD, else 35)
      const withIssuer = filled.filter((c) => c.issuer?.trim()).length;
      score += Math.round((withIssuer / filled.length) * (hasJD ? 30 : 35));
      // Has description — available in both templates (max 15 when no JD)
      if (!hasJD) {
        const withDesc = filled.filter((c) => c.description?.trim()).length;
        score += Math.round((withDesc / filled.length) * 15);
      }
      // JD keywords
      const certText = filled.map((c) => [c[f.certifications.title], c.issuer, c.description].join(' ')).join(' ');
      score += kwBonus(certText, 30);
      return clamp(score);
    }
    case 'education': {
      const items = Array.isArray(data.education) ? data.education : [];
      const filled = items.filter((e) => e.degree?.trim() || e.institution?.trim());
      if (!filled.length) return 0;
      let score = 0;
      const hasJD = jdTerms.length > 0;
      // Detect which template: template 2 has coursework field available
      const hasCourseworkField = filled.some((e) => 'coursework' in e);
      // Degree + institution (core — always the biggest chunk)
      const complete = filled.filter((e) => e.degree?.trim() && e.institution?.trim());
      if (complete.length >= 1) score += hasJD ? 35 : (hasCourseworkField ? 40 : 50);
      else score += 20;
      // Dates — graduationYear (template 1) or startDate/endDate (template 2)
      const withDates = filled.filter((e) => e.startDate || e.endDate || e.graduationYear || e.graduation_date).length;
      if (withDates >= 1) score += hasJD ? 15 : (hasCourseworkField ? 20 : 30);
      // GPA/Score — gpa (template 1) or score (template 2)
      const withScore = filled.filter((e) => e.gpa?.trim() || e.score?.trim()).length;
      if (withScore >= 1) score += hasJD ? 15 : (hasCourseworkField ? 15 : 20);
      // Coursework — only template 2 has this field
      if (hasCourseworkField) {
        const withCoursework = filled.filter((e) => e.coursework?.trim()).length;
        if (withCoursework >= 1) score += hasJD ? 10 : 25;
      }
      // JD keywords
      const eduText = filled.map((e) => [e.degree, e.institution, e.coursework].join(' ')).join(' ');
      score += kwBonus(eduText, hasCourseworkField ? 15 : 25);
      return clamp(score);
    }
    default:
      return 0;
  }
};

/** Overall weighted score (0-100) */
export const getAtsOverallScore = (data, targetJob, options = {}) => {
  const { fieldMap = {} } = options;
  const breakdown = computeAtsBreakdown(data, targetJob, fieldMap);
  return breakdown.overall;
};

/** Grade label */
export const getAtsGrade = (score) => {
  if (score >= 85) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Needs work';
};

/** Actionable recommendations (legacy interface) */
export const getAtsRecommendations = (data, targetJob = { title: '', description: '' }, fieldMap = {}) => {
  const breakdown = computeAtsBreakdown(data, targetJob, fieldMap);
  return [...breakdown.highPriority, ...breakdown.lowPriority, ...breakdown.weaknesses].slice(0, 4);
};

/** Keyword insights: matched vs missing (legacy interface) */
export const getAtsInsights = (data, targetJob, fieldMap = {}) => {
  const breakdown = computeAtsBreakdown(data, targetJob, fieldMap);
  const jd = breakdown.categories.jdMatch;
  return {
    hasTarget: jd.total > 0,
    matched: jd.matched || [],
    missing: jd.missing || [],
    keywords: [...(jd.matched || []), ...(jd.missing || [])].slice(0, 10),
  };
};


// ═══════════════════════════════════════════════════════════════════════
// SKILL KEYWORD FILTER
// ═══════════════════════════════════════════════════════════════════════

/**
 * Determines if a keyword is a valid technical skill (belongs in Skills section)
 * vs a domain/industry term (belongs in summary/bullets, not skills).
 * Returns true if the keyword is a recognizable skill/tool/technology.
 */
export const isSkillKeyword = (keyword) => {
  const lower = normalizeText(keyword);
  if (!lower || lower.length < 2) return false;
  // Check if it's in our display map (all known tech terms)
  if (KEYWORD_DISPLAY_MAP[lower]) return true;
  // Check if it appears in any synonym group (tools/technologies)
  if (_synonymLookup.has(lower)) return true;
  // Check against a list of known skill patterns
  const skillPatterns = /^(python|java|javascript|typescript|sql|nosql|html|css|react|angular|vue|node|express|django|flask|spring|docker|kubernetes|aws|azure|gcp|git|linux|mongodb|postgresql|mysql|redis|graphql|rest|api|terraform|jenkins|ci\/cd|agile|scrum|figma|tableau|excel|power bi|spark|hadoop|kafka|airflow|tensorflow|pytorch|pandas|numpy|selenium|jira|confluence|sass|tailwind|bootstrap|swift|kotlin|rust|go|php|ruby|rails|laravel|flutter|dart|unity|c\+\+|c#|\.net|matlab|r\b|scala|perl|bash|powershell|nginx|apache|elasticsearch|rabbitmq|celery|firebase|heroku|vercel|netlify|webpack|vite|jest|cypress|mocha|pytest|junit|gradle|maven|npm|yarn|pip|conda)$/i;
  if (skillPatterns.test(lower)) return true;
  // Common multi-word skills
  const multiWordSkills = /^(machine learning|deep learning|data science|data analysis|data engineering|cloud computing|web development|mobile development|full stack|front end|back end|devops|mlops|natural language processing|computer vision|project management|version control|test driven|object oriented|micro services|api gateway|infrastructure as code)$/i;
  if (multiWordSkills.test(lower)) return true;
  // If it's a single short word that's NOT in any known tech list, it's likely a domain term
  // Domain terms: analytics, compliance, stakeholders, optimization, strategy, etc.
  return false;
};
