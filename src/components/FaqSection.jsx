import FaqItem from './FaqItem';

const faqs = [
  {
    question: 'Is ResumeLab free to use?',
    answer:
      'Yes, ResumeLab is completely free to use. You can create, edit, and download your resume without any charges or sign-up required.',
  },
  {
    question: 'Do you offer professional resume writing services?',
    answer:
      'Yes, we offer professional resume writing services by expert HR consultants. You can reach out via our Talk to Us option for more details.',
  },
  {
    question: 'Can I create a resume online without experience?',
    answer:
      'Absolutely. ResumeLab is designed for freshers and experienced professionals alike. Our templates and tips guide you through building a strong resume even with no work experience.',
  },
  {
    question: 'Are ResumeLab resumes ATS-friendly?',
    answer:
      'Yes, all our templates are designed to pass ATS (Applicant Tracking System) scans. The text is fully selectable and parseable by recruitment software.',
  },
  {
    question: 'What does ResumeLab help you do?',
    answer:
      'ResumeLab helps you build a professional, ATS-friendly resume in minutes. Choose a template, fill in your details, and download a polished PDF - completely free.',
  },
];

export default function FaqSection({ openIndex, onToggle, reviewSlot }) {
  return (
    <section id="talk-to-us-section" className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[24px] pt-[32px] shadow-[var(--shadow-sm)] lg:mt-[0px] lg:px-[64px] lg:pt-[48px] lg:pb-[48px] lg:rounded-none lg:border-y lg:border-[color:var(--border-soft)] lg:mx-0">
      <div className="lg:max-w-[1120px] xl:max-w-[1280px] 2xl:max-w-[1400px] lg:mx-auto">
        <h2 className="mb-[22px] text-center text-[23px] font-extrabold tracking-[-0.03em] text-[var(--text-dark)] lg:text-[28px] xl:text-[32px] lg:mb-[32px] lg:text-left">
          Still in Doubt?
        </h2>

        {/* Desktop: FAQ left + Review right side by side */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-[40px] xl:gap-[56px]">
          {/* Left: FAQ items */}
          <div className="flex flex-col flex-1">
            {faqs.map((item, index) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => onToggle(index)}
              />
            ))}
          </div>

          {/* Right: Review Us (desktop only — rendered via slot) */}
          {reviewSlot && (
            <div className="hidden lg:block lg:w-[360px] xl:w-[400px] lg:flex-shrink-0 lg:sticky lg:top-[100px]">
              {reviewSlot}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
