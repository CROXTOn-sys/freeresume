import TemplateCard from './TemplateCard';

const templates = [
  {
    badge: 'Popular',
    title: 'Shakra',
    users: '5.8K users',
    variant: 'Shakra',
    templateId: 1,
    thumbClass: 'bg-[linear-gradient(135deg,#f0eeff_0%,#e8e0ff_100%)]',
    isPreview: true,
    href: '/template-details?template=1',
  },
  {
    badge: 'ATS friendly',
    title: 'Ashish',
    users: '2.3K users',
    variant: 'Ashish',
    templateId: 2,
    thumbClass: 'bg-[linear-gradient(135deg,#e8e0ff_0%,#d4ccff_100%)]',
    isPreview: true,
    href: '/template-details?template=2',
  },
  {
    badge: 'New',
    title: 'Henna',
    users: '1.9K users',
    variant: 'henna',
    templateId: 3,
    thumbClass: 'bg-[linear-gradient(135deg,#fff0f0_0%,#ffe0e0_100%)]',
  },
  {
    badge: 'Modern',
    title: 'Nova',
    users: '1.1K users',
    variant: 'nova',
    templateId: 4,
    thumbClass: 'bg-[linear-gradient(135deg,#f0fff4_0%,#d4f5e2_100%)]',
  },
];

export default function TemplatesSection({ highlight = false }) {
  return (
    <section
      id="templates-section"
      className={`mt-[12px] border-y border-[color:var(--border-soft)] bg-[var(--section-bg-soft)] px-[18px] pb-[22px] pt-[28px] shadow-[var(--shadow-sm)] transition-all duration-300 ${
        highlight ? 'ring-4 ring-[rgba(95,84,240,0.22)] ring-offset-2 ring-offset-transparent' : ''
      }`}
    >
      <div className="mb-[16px] flex items-center justify-between">
        <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--text-dark)]">
          Get started with a template
        </h2>
        <a href="#" className="flex items-center gap-[2px] py-[6px] text-[13px] font-semibold text-[var(--purple)] no-underline">
          See All <span aria-hidden="true">&gt;</span>
        </a>
      </div>

      <div className="flex gap-[12px] overflow-x-auto pb-[8px] [scrollbar-width:none] [-ms-overflow-style:none]">
        {templates.map((template) => (
          <TemplateCard key={template.title} {...template} />
        ))}
      </div>
    </section>
  );
}
