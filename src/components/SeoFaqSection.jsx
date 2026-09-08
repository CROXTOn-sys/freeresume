'use client';

import { useState } from 'react';
import FaqItem from './FaqItem';

const seoFaqs = [
  {
    question: 'Is resume builder free?',
    answer:
      'Yes, ResumeLab is a completely free resume builder. You can create, edit, and download your first resume without any charges. Our free AI resume builder gives you professional, ATS-friendly templates and AI-powered content suggestions at no cost.',
  },
  {
    question: 'Is there a free resume builder?',
    answer:
      'Absolutely. ResumeLab is a genuinely free resume builder with no forced sign-up to get started. You get access to professional resume builder templates, an online resume builder editor, AI enhancement tools, and a built-in ATS score checker — all free to use.',
  },
  {
    question: 'What is the best resume builder?',
    answer:
      'The best resume builder is one that is free, ATS-friendly, and easy to use. ResumeLab combines a free AI resume builder, recruiter-approved templates, an ATS score checker, and support for 70+ job roles, making it one of the best free resume builder options available online.',
  },
  {
    question: 'Which CV builder is free?',
    answer:
      'ResumeLab is a free CV builder that lets you create a professional, ATS-friendly CV in minutes. Unlike many tools that lock downloads behind a paywall, ResumeLab offers a free resume builder with your first download completely free.',
  },
  {
    question: 'Is resume builder AI available?',
    answer:
      'Yes. ResumeLab includes a powerful resume builder AI that helps you write stronger bullet points, add measurable achievements, and tailor your resume to your target role. This AI resume builder free feature turns plain descriptions into polished, professional statements.',
  },
  {
    question: 'How to get a 90+ ATS score?',
    answer:
      'To get a 90+ ATS score, match your resume keywords to the job description, use a clean ATS-friendly template, start bullet points with action verbs, include measurable results, and fill every key section. ResumeLab\'s built-in ATS checker shows exactly which keywords to add so you can push your score higher.',
  },
  {
    question: 'Is 70 a good ATS score?',
    answer:
      'A 70 ATS score is decent and shows your resume is reasonably aligned with the role, but there is room to improve. Adding a few more relevant keywords, quantifiable achievements, and role-specific skills can push your score into the strong (80+) range using ResumeLab\'s ATS optimization tools.',
  },
  {
    question: 'How much ATS score is good for a CV?',
    answer:
      'An ATS score of 80 or above is generally considered good for a CV, and 90+ is excellent. A score in this range means your CV is well-optimized with relevant keywords, proper structure, and quantifiable results. ResumeLab helps you reach these scores with real-time suggestions.',
  },
  {
    question: 'Is ResumeLab a good resume builder for students?',
    answer:
      'Yes, ResumeLab is an excellent resume builder for students. It is free, easy to use, and designed to help students showcase projects, internships, coursework, and skills even with limited work experience. The AI resume builder guides you through building a strong first resume.',
  },
  {
    question: 'Is ResumeLab a good resume builder for freshers?',
    answer:
      'ResumeLab is a great resume builder for freshers. Our templates and AI suggestions help freshers highlight academic achievements, internships, and technical skills in an ATS-friendly format, giving them a strong start in their job search — completely free.',
  },
  {
    question: 'How does ResumeLab compare to resume builders like Enhancv?',
    answer:
      'Like premium tools such as Enhancv, ResumeLab offers professional templates, AI content enhancement, and ATS optimization. The key difference is that ResumeLab is a free AI resume builder — you get recruiter-approved, ATS-friendly resumes and an ATS score checker without paying for the core features.',
  },
];

export default function SeoFaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seoFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `<p>${f.answer}</p>`,
      },
    })),
  };

  return (
    <section
      id="faq-seo-section"
      className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[32px] pt-[32px] shadow-[var(--shadow-sm)] lg:mt-[0px] lg:px-[64px] lg:pb-[56px] lg:pt-[48px] lg:rounded-none lg:border-t lg:border-[color:var(--border-soft)] lg:mx-0"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="lg:max-w-[900px] xl:max-w-[1000px] lg:mx-auto">
        <div className="mb-[22px] text-center lg:mb-[32px]">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[var(--text-dark)] lg:text-[28px] xl:text-[32px]">
            Frequently Asked Questions
          </h2>
          <p className="mt-[8px] text-[13px] text-[var(--text-light)] lg:text-[15px]">
            Everything you need to know about our free AI resume builder
          </p>
        </div>

        <div className="flex flex-col">
          {seoFaqs.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
