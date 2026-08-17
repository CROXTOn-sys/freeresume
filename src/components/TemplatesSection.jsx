import TemplateCard from './TemplateCard';

const templates = [
  {
    badge: 'Popular',
    title: 'Shakra',
    users: '1.3K users',
    variant: 'Shakra',
    templateId: 1,
    thumbClass: 'bg-[linear-gradient(135deg,#f0eeff_0%,#e8e0ff_100%)]',
    isPreview: true,
    href: '/template-details?template=1',
  },
  {
    badge: 'ATS Friendly',
    title: 'Ashish',
    users: '1.1K users',
    variant: 'Ashish',
    templateId: 2,
    thumbClass: 'bg-[linear-gradient(135deg,#e8e0ff_0%,#d4ccff_100%)]',
    isPreview: true,
    href: '/template-details?template=2',
  },
  {
    badge: 'Coming Soon',
    title: 'Henna',
    users: '—',
    variant: 'henna',
    templateId: 3,
    thumbClass: 'bg-[linear-gradient(135deg,#f9fafb_0%,#f3f4f6_100%)]',
    isPreview: false,
  },
  {
    badge: 'Coming Soon',
    title: 'Nova',
    users: '—',
    variant: 'nova',
    templateId: 4,
    thumbClass: 'bg-[linear-gradient(135deg,#f9fafb_0%,#f0fdf4_100%)]',
    isPreview: false,
  },
];

export default function TemplatesSection({ highlight = false }) {
  return (
    <section
      id="templates-section"
      className={`mt-[6px] border-y border-[color:var(--border-soft)] bg-[var(--section-bg-soft)] px-[18px] pb-[32px] pt-[28px] shadow-[var(--shadow-sm)] transition-all duration-300 lg:mt-[0px] lg:px-[64px] lg:pb-[56px] lg:pt-[48px] lg:rounded-none lg:border-x-0 lg:mx-0 ${
        highlight ? 'ring-4 ring-[rgba(95,84,240,0.22)] ring-offset-2 ring-offset-transparent' : ''
      }`}
    >
      <div className="lg:max-w-[1120px] xl:max-w-[1280px] 2xl:max-w-[1400px] lg:mx-auto">
        <div className="mb-[24px] text-center lg:mb-[36px]">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[var(--text-dark)] lg:text-[28px] xl:text-[32px]">
            Get started with a template
          </h2>
          <p className="mt-[8px] text-[13px] text-[var(--text-light)] lg:text-[15px]">
            Choose a professionally designed template and customize it in minutes
          </p>
        </div>

        {/* Mobile: horizontal scroll showing all templates */}
        <div className="flex gap-[14px] overflow-x-auto pb-[8px] [scrollbar-width:none] [-ms-overflow-style:none] lg:hidden">
          {templates.map((template) => (
            <div key={template.title} className="w-[44vw] min-w-[160px] max-w-[200px] flex-shrink-0">
              <TemplateCard {...template} />
            </div>
          ))}
        </div>

        {/* Desktop: 4 columns showing all templates */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-[24px] xl:gap-[32px]">
          {templates.map((template) => (
            <TemplateCard key={template.title} {...template} />
          ))}
        </div>
      </div>
    </section>
  );
}
