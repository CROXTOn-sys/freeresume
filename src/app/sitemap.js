const SITE_URL = 'https://resumebuilderlab.com';

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/resume-builder', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/ats-checker', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/interview-prep', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/template-details?template=1', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/template-details?template=2', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/refund', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
