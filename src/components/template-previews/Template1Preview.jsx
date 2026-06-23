'use client';

import { useMemo } from 'react';

const TEMPLATE = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff;color:#000;font-family:'Times New Roman',Times,serif}
@page{size:A4;margin:0}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.resume-wrapper{width:100%;max-width:794px;margin:0 auto;overflow:hidden}
.resume-header{text-align:center}
.resume-header h1{font-weight:400;letter-spacing:.05em;text-transform:uppercase;line-height:1.1}
.resume-header .job-title{font-weight:700}
.contact-line{line-height:1.3}
.section-title{font-weight:700;border-bottom:1.4px solid #000}
.summary-text{text-align:justify}
.skills-table{width:100%;border-collapse:collapse}
.skills-table td{vertical-align:top}
.skills-category-label{font-weight:700;white-space:nowrap}
.entry{break-inside:avoid;page-break-inside:avoid}
.entry-header,.project-header{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.entry-org,.project-name{font-weight:700}
.entry-dates,.project-tech{font-style:italic;white-space:nowrap;text-align:right}
.entry-role{font-style:italic}
.entry-bullets,.cert-list{list-style:none;padding:0}
.entry-bullets li,.cert-list li{position:relative;padding-left:11px}
.entry-bullets li::before{content:'\\2013';position:absolute;left:0}
.cert-list li::before{content:'\\2022';position:absolute;left:0}
.edu-entry{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.edu-degree{font-weight:700}
.edu-institution{font-style:italic}
.edu-dates,.edu-score{text-align:right;white-space:nowrap}
</style>
</head>
<body>
<div class="resume-wrapper">
<header class="resume-header">
<h1>{{name}}</h1>
<div class="job-title">{{job_title}}</div>
<div class="contact-line">{{phone}} | {{email}} | {{linkedin}}</div>
</header>
<section class="resume-section"><div class="section-title">Summary</div><div class="summary-text">{{summary}}</div></section>
<section class="resume-section"><div class="section-title">Skills</div><table class="skills-table"><tbody>{{skills_html}}</tbody></table></section>
<section class="resume-section"><div class="section-title">Experience</div>{{experience_html}}</section>
<section class="resume-section"><div class="section-title">Projects</div>{{projects_html}}</section>
<section class="resume-section"><div class="section-title">Certifications</div><ul class="cert-list">{{certifications_html}}</ul></section>
<section class="resume-section"><div class="section-title">Education</div>{{education_html}}</section>
</div>
<script>
(function(){
var PAGE_H=1122;
var w=document.querySelector('.resume-wrapper');
var BF=10.5,HF=11.5,NF=20,RF=10,SF=9.5;
var presets=[
{sm:18,em:12,lh:1.55,pad:'30px 36px 24px',blh:1.5,cmb:5,sp:'2px 0'},
{sm:16,em:11,lh:1.5,pad:'28px 35px 22px',blh:1.48,cmb:4.5,sp:'1.5px 0'},
{sm:14,em:10,lh:1.45,pad:'26px 34px 20px',blh:1.44,cmb:4,sp:'1.5px 0'},
{sm:12,em:9,lh:1.42,pad:'24px 33px 18px',blh:1.4,cmb:3.5,sp:'1px 0'},
{sm:11,em:8,lh:1.38,pad:'22px 32px 16px',blh:1.36,cmb:3,sp:'1px 0'},
{sm:10,em:7,lh:1.35,pad:'20px 32px 14px',blh:1.34,cmb:2.5,sp:'0.5px 0'},
{sm:9,em:6,lh:1.32,pad:'18px 30px 12px',blh:1.3,cmb:2,sp:'0.5px 0'},
{sm:8,em:5,lh:1.28,pad:'16px 28px 10px',blh:1.26,cmb:1.5,sp:'0'},
{sm:7,em:4,lh:1.25,pad:'14px 26px 8px',blh:1.24,cmb:1,sp:'0'},
{sm:6,em:3,lh:1.22,pad:'12px 24px 6px',blh:1.2,cmb:0.5,sp:'0'}
];
function apply(p){
w.style.padding=p.pad;w.style.fontSize=BF+'pt';w.style.lineHeight=String(p.lh);
var h1=w.querySelector('h1');if(h1)h1.style.fontSize=NF+'pt';
var jt=w.querySelector('.job-title');if(jt)jt.style.fontSize=BF+'pt';
var cl=w.querySelector('.contact-line');if(cl)cl.style.fontSize=(BF-1.5)+'pt';
w.querySelectorAll('.resume-section').forEach(function(s){s.style.marginTop=p.sm+'px';});
w.querySelectorAll('.section-title').forEach(function(t){t.style.fontSize=HF+'pt';t.style.paddingBottom='1px';t.style.marginBottom=Math.max(2,Math.round(p.sm*0.4))+'px';});
w.querySelectorAll('.entry').forEach(function(e){e.style.marginBottom=p.em+'px';});
w.querySelectorAll('.entry-bullets li,.cert-list li').forEach(function(b){b.style.fontSize=BF+'pt';b.style.lineHeight=String(p.blh);b.style.marginBottom='0';});
w.querySelectorAll('.cert-list li').forEach(function(c){c.style.marginBottom=p.cmb+'px';});
w.querySelectorAll('.entry-org,.project-name,.edu-degree').forEach(function(e){e.style.fontSize=RF+'pt';});
w.querySelectorAll('.entry-dates,.project-tech,.entry-role,.edu-institution,.edu-dates,.edu-score').forEach(function(e){e.style.fontSize=SF+'pt';});
var sm=w.querySelector('.summary-text');if(sm){sm.style.fontSize=BF+'pt';sm.style.lineHeight=String(p.lh);}
w.querySelectorAll('.skills-table td').forEach(function(td){td.style.fontSize=BF+'pt';td.style.lineHeight=String(p.lh);td.style.padding=p.sp;});
w.querySelectorAll('.skills-category-label').forEach(function(l){l.style.paddingRight='8px';});
w.querySelectorAll('.edu-entry').forEach(function(e){e.style.marginBottom=Math.max(1,Math.round(p.em*0.3))+'px';});
}
function fit(){for(var i=0;i<presets.length;i++){apply(presets[i]);if(w.scrollHeight<=PAGE_H)break;}}
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fit);}
else{window.addEventListener('load',fit);}
})();
</script>
</body>
</html>`;

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTemplate(data) {
  const d = data || {};
  const skillsHtml = (d.skills_categories || []).map((s) => `<tr><td class="skills-category-label">${esc(s.category_label)}:</td><td>${esc(s.skills_list)}</td></tr>`).join('');
  const experienceHtml = (d.experience || []).map((e) => { const b = (e.bullets || []).map((x) => `<li>${esc(x)}</li>`).join(''); return `<div class="entry"><div class="entry-header"><div class="entry-org">${esc(e.company)}</div><div class="entry-dates">${esc(e.start_date)} - ${esc(e.end_date)}</div></div><div class="entry-role">${esc(e.role)}</div><ul class="entry-bullets">${b}</ul></div>`; }).join('');
  const projectsHtml = (d.projects || []).map((p) => { const b = (p.bullets || []).map((x) => `<li>${esc(x)}</li>`).join(''); return `<div class="entry"><div class="project-header"><div class="project-name">${esc(p.project_name)}</div><div class="project-tech">${esc(p.technologies)}</div></div><ul class="entry-bullets">${b}</ul></div>`; }).join('');
  const certificationsHtml = (d.certifications || []).map((c) => `<li><strong>${esc(c.cert_title)}</strong> - ${esc(c.issuer)}</li>`).join('');
  const educationHtml = (d.education || []).map((e) => `<div class="edu-entry"><div><div class="edu-degree">${esc(e.degree)}</div><div class="edu-institution">${esc(e.institution)}</div></div><div style="text-align:right"><div class="edu-dates">${esc(e.graduation_date)}</div><div class="edu-score">${esc(e.score)}</div></div></div>`).join('');

  return TEMPLATE
    .replace('{{name}}', esc(d.name || 'Your Name'))
    .replace('{{job_title}}', esc(d.job_title || 'Professional Title'))
    .replace('{{phone}}', esc(d.phone || 'Phone Number'))
    .replace('{{email}}', esc(d.email || 'Email Address'))
    .replace('{{linkedin}}', esc(d.linkedin || 'LinkedIn'))
    .replace('{{summary}}', esc(d.summary || ''))
    .replace('{{skills_html}}', skillsHtml)
    .replace('{{experience_html}}', experienceHtml)
    .replace('{{projects_html}}', projectsHtml)
    .replace('{{certifications_html}}', certificationsHtml)
    .replace('{{education_html}}', educationHtml);
}

export default function Template1Preview({ data = {}, previewMode = false }) {
  const html = useMemo(() => renderTemplate(data), [data]);
  return (
    <iframe
      srcDoc={html}
      style={{ width: '100%', height: previewMode ? '100%' : '842px', border: 'none', display: 'block', background: '#fff' }}
      title="Resume Preview"
    />
  );
}
