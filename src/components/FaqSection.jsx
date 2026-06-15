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

export default function FaqSection({ openIndex, onToggle }) {
  return (
    <section className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[28px] pt-[32px] shadow-[var(--shadow-sm)]">
      <h2 className="mb-[22px] text-center text-[23px] font-extrabold tracking-[-0.03em] text-[var(--text-dark)]">
        Still in Doubt?
      </h2>

      <div className="flex flex-col">
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

      <a
        href="#"
        className="mt-[24px] block w-full rounded-[50px] bg-[linear-gradient(135deg,var(--purple),var(--purple-light))] px-[24px] py-[15px] text-center text-[15px] font-bold text-white no-underline shadow-[0_14px_28px_rgba(95,84,240,0.2)]"
      >
        Talk to Us
      </a>
    </section>
  );
}
