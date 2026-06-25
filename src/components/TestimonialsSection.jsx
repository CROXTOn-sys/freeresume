import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    text: 'The resume builder made it easy to create a clean profile that stands out to recruiters.',
    name: 'Anand Sharma',
    role: 'Software Engineer, TCS',
    avatar: 'A',
  },
  {
    text: 'I landed 3 interviews within a week of updating my resume on ResumeLab.',
    name: 'Jitin',
    role: 'Senior Principal Engineer, Zoop',
    avatar: 'J',
    avatarClass: 'bg-[#fff3e0] text-[#f59e0b]',
  },
  {
    text: 'This tool made my resume look instantly more professional in just a few minutes. Highly recommend.',
    name: 'Priya Menon',
    role: 'Product Manager, Swiggy',
    avatar: 'P',
    avatarClass: 'bg-[#f0fdf4] text-[#22c55e]',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="reviews-section" className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[24px] pt-[28px] shadow-[var(--shadow-sm)]">
      <h2 className="mb-[8px] text-[21px] font-extrabold leading-[1.25] tracking-[-0.03em] text-[var(--text-dark)]">
        Hear From Job Seekers Who Got Results
      </h2>
      <p className="mb-[20px] text-[13px] leading-[1.5] text-[var(--text-light)]">
        Trusted by students and professionals to build the best resume.
      </p>

      <div className="flex gap-[12px] overflow-x-auto pb-[8px] [scrollbar-width:none] [-ms-overflow-style:none]">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
