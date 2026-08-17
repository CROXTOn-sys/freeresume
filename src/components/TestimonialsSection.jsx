import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    title: 'Unlike other websites',
    text: 'Unlike other websites This website allows for downloading all the hard work you did to lift yourself up and make a great resume.',
    name: 'Rama Rao A',
    timeAgo: '2 days ago',
  },
  {
    title: 'Super easy to use with ...',
    text: 'Super easy to use with the integrated AI tools and seamless transition between different designs and styles.',
    name: 'Pragathi K',
    timeAgo: '5 days ago',
  },
  {
    title: 'Easy to understand',
    text: 'Easy to understand, navigate, and create suitable documentation to apply for new jobs. Ultimate outcome of a professional resume.',
    name: 'Yashwanth P',
    timeAgo: '7 days ago',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="reviews-section" className="mt-[12px] bg-[var(--section-bg)] px-[18px] pb-[28px] pt-[28px] shadow-[var(--shadow-sm)] lg:mt-[0px] lg:px-[64px] lg:pb-[56px] lg:pt-[48px] lg:rounded-none lg:border-y lg:border-[color:var(--border-soft)] lg:mx-0">
      <div className="lg:max-w-[1120px] xl:max-w-[1280px] 2xl:max-w-[1400px] lg:mx-auto">
        <div className="mb-[20px] lg:mb-[32px] lg:text-center">
          <h2 className="text-[21px] font-extrabold leading-[1.25] tracking-[-0.03em] text-[var(--text-dark)] lg:text-[28px] xl:text-[32px]">
            Trusted by Job Seekers
          </h2>
          <p className="mt-[6px] text-[13px] leading-[1.5] text-[var(--text-light)] lg:text-[15px]">
            See what people are saying about their experience
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex gap-[14px] overflow-x-auto pb-[8px] [scrollbar-width:none] [-ms-overflow-style:none] lg:hidden">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>

        {/* Desktop: 3 column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-[24px] xl:gap-[32px]">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
