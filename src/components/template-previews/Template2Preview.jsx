'use client';

import { useEffect, useRef, useState } from 'react';

const TEMPLATE = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:#000;font-family:Georgia,'Lora','Times New Roman',serif;font-size:10pt;line-height:1.4}
@page{size:A4;margin:0}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.resume-wrapper{max-width:760px;margin:0 auto;padding:22px 28px;overflow:hidden}
.resume-header{text-align:center;margin-bottom:10px}
.resume-header h1{font-size:20pt;font-weight:700;letter-spacing:.01em;line-height:1.2;margin-bottom:5px}
.contact-line{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:9pt}
.c-item{display:inline-flex;align-items:center;gap:3px}
.c-sep{margin:0 7px;color:#555}
.section-title{font-size:10.5pt;font-weight:700;border-bottom:0.8px solid #000;padding-bottom:2px;margin-top:10px;margin-bottom:6px}
.skills-block{margin-bottom:3px}
.skills-block p{font-size:10pt;line-height:1.5}
.skills-label{font-weight:700}
.entry{margin-bottom:9px}
.entry:last-child{margin-bottom:0}
.entry-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:2px}
.entry-org{font-weight:700;font-size:10pt}
.entry-dates{font-size:9.5pt;font-style:italic;white-space:nowrap}
.entry-role{font-size:10pt;font-style:italic;margin-bottom:3px}
.entry-tech{font-size:9pt;font-style:italic;color:#222;margin-top:2px}
.entry-bullets{list-style:disc;padding-left:16px;margin:3px 0 2px}
.entry-bullets li{font-size:10pt;line-height:1.45;margin-bottom:2px}
.edu-entry{margin-bottom:7px}
.edu-entry:last-child{margin-bottom:0}
.edu-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:2px}
.edu-institution{font-weight:700;font-size:10pt}
.edu-dates{font-size:9.5pt;white-space:nowrap}
.edu-degree-row{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:2px;margin-top:1px}
.edu-degree{font-size:10pt;font-style:italic}
.edu-score{font-size:10pt;font-weight:700;white-space:nowrap}
.edu-coursework{font-size:9.5pt;line-height:1.45;margin-top:2px}
.project-list{list-style:disc;padding-left:16px;margin:0}
.project-list li{font-size:10pt;line-height:1.5;margin-bottom:5px}
.project-list li:last-child{margin-bottom:0}
.project-title{font-weight:700}
.cert-list{list-style:disc;padding-left:16px;margin:0}
.cert-list li{font-size:10pt;line-height:1.5;margin-bottom:2px}
</style>
</head>
<body>
<div class="resume-wrapper">
<header class="resume-header">
<h1>{{name}}</h1>
<div class="contact-line">{{contact_html}}</div>
</header>
<section><h2 class="section-title">Skills</h2>{{skills_html}}</section>
<section><h2 class="section-title">Work Experience</h2>{{experience_html}}</section>
<section><h2 class="section-title">Education</h2>{{education_html}}</section>
<section><h2 class="section-title">Project Work</h2><ul class="project-list">{{projects_html}}</ul></section>
<section><h2 class="section-title">Awards and Certificates</h2><ul class="cert-list">{{certifications_html}}</ul></section>
</div>
<script>
(function(){
var PAGE_H=1122;var w=document.querySelector('.resume-wrapper');
var presets=[
{sm:12,em:9,lh:1.5,pad:'24px 30px'},
{sm:10,em:8,lh:1.45,pad:'22px 28px'},
{sm:9,em:7,lh:1.4,pad:'20px 26px'},
{sm:8,em:6,lh:1.35,pad:'18px 24px'},
{sm:7,em:5,lh:1.3,pad:'16px 22px'},
{sm:6,em:4,lh:1.25,pad:'14px 20px'},
{sm:5,em:3,lh:1.22,pad:'12px 18px'}
];
function apply(p){
w.style.padding=p.pad;w.style.lineHeight=String(p.lh);
w.querySelectorAll('section').forEach(function(s){s.style.marginTop=p.sm+'px';});
w.querySelectorAll('.entry,.edu-entry').forEach(function(e){e.style.marginBottom=p.em+'px';});
w.querySelectorAll('.entry-bullets li,.project-list li,.cert-list li,.skills-block p').forEach(function(e){e.style.lineHeight=String(p.lh);});
}
function fit(){for(var i=0;i<presets.length;i++){apply(presets[i]);if(w.scrollHeight<=PAGE_H)break;}}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fit);}else{window.addEventListener('load',fit);}
})();
</script>
</body>
</html>`;

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTemplate(data) {
  const d = data || {};

  const contactParts = [];
  if (d.email) contactParts.push(`<span class="c-item">${esc(d.email)}</span>`);
  if (d.phone) contactParts.push(`<span class="c-item">${esc(d.phone)}</span>`);
  if (d.github) contactParts.push(`<span class="c-item">${esc(d.github)}</span>`);
  if (d.linkedin) contactParts.push(`<span class="c-item">${esc(d.linkedin)}</span>`);
  const contactHtml = contactParts.join('<span class="c-sep">|</span>');

  const skillsHtml = (d.skills_categories || []).map((s) => `<div class="skills-block"><p><span class="skills-label">${esc(s.category_label)}:</span> ${esc(s.skills_list)}</p></div>`).join('');

  const experienceHtml = (d.experience || []).map((e) => {
    const bullets = (e.bullets || []).map((b) => `<li>${esc(b)}</li>`).join('');
    const loc = e.location ? `, ${esc(e.location)}` : '';
    const tech = e.tools_used ? `<li>${esc(e.tools_used)}</li>` : '';
    return `<div class="entry"><div class="entry-header"><span class="entry-org">${esc(e.company)}${loc}</span><span class="entry-dates">${esc(e.start_date)} - ${esc(e.end_date)}</span></div><p class="entry-role">${esc(e.role)}</p><ul class="entry-bullets">${bullets}${tech}</ul></div>`;
  }).join('');

  const educationHtml = (d.education || []).map((e) => {
    const score = e.score ? `<span class="edu-score">${esc(e.score_label || 'CGPA')}: ${esc(e.score)}</span>` : '';
    const coursework = e.coursework ? `<p class="edu-coursework"><strong>Relevant Coursework:</strong> ${esc(e.coursework)}</p>` : '';
    return `<div class="edu-entry"><div class="edu-header"><span class="edu-institution">${esc(e.institution)}</span><span class="edu-dates">${esc(e.start_date || '')} - ${esc(e.end_date || e.graduation_date || '')}</span></div><div class="edu-degree-row"><span class="edu-degree">${esc(e.degree)}</span>${score}</div>${coursework}</div>`;
  }).join('');

  const projectsHtml = (d.projects || []).map((p) => {
    const name = p.project_name || p.name || '';
    const year = p.year ? ` (${esc(p.year)})` : '';
    const tech = p.technologies ? ` <em>${esc(p.technologies)}</em>` : '';
    const desc = p.description || '';
    return `<li><span class="project-title">${esc(name)}${year}:</span> ${esc(desc)}${tech}</li>`;
  }).join('');

  const certificationsHtml = (d.certifications || []).map((c) => {
    const title = c.cert_title || c.title || '';
    const issuer = c.issuer ? `: ${esc(c.issuer)}` : '';
    const desc = c.cert_description || c.description || '';
    const descHtml = desc ? ` – ${esc(desc)}` : '';
    return `<li><strong>${esc(title)}</strong>${issuer}${descHtml}</li>`;
  }).join('');

  return TEMPLATE
    .replace('{{name}}', esc(d.name || 'Your Name'))
    .replace('{{contact_html}}', contactHtml)
    .replace('{{skills_html}}', skillsHtml)
    .replace('{{experience_html}}', experienceHtml)
    .replace('{{education_html}}', educationHtml)
    .replace('{{projects_html}}', projectsHtml)
    .replace('{{certifications_html}}', certificationsHtml);
}

export default function Template2Preview({ data = {}, previewMode = false }) {
  const html = renderTemplate(data);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(0.45);
  const prevHtmlRef = useRef('');

  // Write to iframe via contentDocument to avoid full reload flicker
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (prevHtmlRef.current === html) return;
    prevHtmlRef.current = html;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  useEffect(() => {
    if (!previewMode) return;
    const container = containerRef.current;
    if (!container) return;
    const updateScale = () => {
      const w = container.offsetWidth;
      if (w > 0) setScale(w / 794);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => { window.removeEventListener('resize', updateScale); observer.disconnect(); };
  }, [previewMode]);

  if (previewMode) {
    return (
      <div ref={containerRef} style={{ width: '100%', overflow: 'hidden', position: 'relative', height: `${1122 * scale}px` }}>
        <iframe ref={iframeRef} style={{ position: 'absolute', top: 0, left: 0, width: '794px', height: '1122px', border: 'none', background: '#fff', transform: `scale(${scale})`, transformOrigin: 'top left' }} title="Resume Preview" />
      </div>
    );
  }

  return <iframe ref={iframeRef} style={{ width: '100%', height: '842px', border: 'none', display: 'block', background: '#fff' }} title="Resume Preview" />;
}
