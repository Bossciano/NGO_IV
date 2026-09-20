import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Palette,
  Sparkles,
  UsersRound,
  Wheat,
  Wrench,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const navItems = [
  { label: 'Why we exist', href: '#story' },
  { label: 'Our programmes', href: '#programmes' },
  { label: 'Our people', href: '#founder' },
  { label: 'Get involved', href: '#contact' },
];

const programmes = [
  {
    title: 'Vocational & technical training',
    text: 'Practical pathways into work: from trades and making to the confidence to charge fairly for a skill.',
    icon: Wrench,
    accent: 'ochre',
  },
  {
    title: 'Digital literacy',
    text: 'Everyday digital fluency, online safety and tools that make school, work and business more possible.',
    icon: Laptop,
    accent: 'blue',
  },
  {
    title: 'Entrepreneurship',
    text: 'Turn a good idea into a useful business with guidance on planning, money and finding your first customer.',
    icon: BriefcaseBusiness,
    accent: 'coral',
  },
  {
    title: 'Life skills & leadership',
    text: 'The human skills behind lasting opportunity: communication, resilience, teamwork and self-belief.',
    icon: UsersRound,
    accent: 'leaf',
  },
  {
    title: 'Disability-inclusive programmes',
    text: 'Training designed with access in mind, so disability does not decide who gets to build a future.',
    icon: HeartHandshake,
    accent: 'violet',
  },
  {
    title: 'Agriculture & food systems',
    text: 'Modern agricultural skills for young people shaping healthier livelihoods and stronger local food systems.',
    icon: Wheat,
    accent: 'green',
  },
  {
    title: 'Internships & startup links',
    text: 'Bridges to employers, mentors and early-stage teams where learning can become meaningful experience.',
    icon: ArrowUpRight,
    accent: 'navy',
  },
  {
    title: 'Creative arts',
    text: 'Space and support for young creatives to make, collaborate and see their voice as an asset.',
    icon: Palette,
    accent: 'pink',
  },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function scrollToSection(href: string, closeMenu?: () => void) {
  closeMenu?.();
  const element = document.querySelector(href);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function BrandMark() {
  return (
    <a href="#top" className="flex items-center gap-3" data-testid="link-brand">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f4a340]/60 text-[#f4a340]">
        <Sparkles size={17} strokeWidth={1.8} />
      </span>
      <span className="leading-none">
        <span className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#f5f0e7]">Community Youth</span>
        <span className="mt-1 block font-serif text-[0.72rem] text-[#f4a340]">& Skills Development Society</span>
      </span>
    </a>
  );
}

function Header({ onDonate }: { onDonate: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <BrandMark />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              data-testid={`link-nav-${item.href.slice(1)}`}
            >
              {item.label}
            </a>
          ))}
          <button className="button-primary min-h-10 px-5 text-[0.68rem]" onClick={onDonate} data-testid="button-nav-donate">
            Donate <ArrowUpRight size={14} />
          </button>
        </nav>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5f0e7]/25 text-[#f5f0e7] lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="mx-4 rounded-2xl border border-[#f5f0e7]/15 bg-[#183329] p-5 shadow-2xl lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-[#f5f0e7]/10 px-2 py-4 text-sm font-semibold text-[#f5f0e7]"
                data-testid={`link-mobile-${item.href.slice(1)}`}
              >
                {item.label}
              </a>
            ))}
            <button className="button-primary mt-4" onClick={() => { setMenuOpen(false); onDonate(); }} data-testid="button-mobile-donate">
              Donate to the work <ArrowUpRight size={15} />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Modal({
  type,
  onClose,
}: {
  type: 'donate' | 'contact' | 'program';
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const isDonation = type === 'donate';
  const isProgram = type === 'program';
  const title = isDonation ? 'Stand with young Nigerians' : isProgram ? 'Find your pathway' : 'Start a conversation';
  const description = isDonation
    ? 'Your support helps us put practical tools, patient teaching and real connections within reach.'
    : isProgram
      ? 'Tell us what you are looking for. We will help you find the right programme or next step.'
      : 'Whether you want to partner, volunteer, refer a young person or learn more, our door is open.';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-[60] flex items-end justify-center bg-[#10251d]/75 p-3 sm:items-center sm:p-6" role="presentation" onMouseDown={onClose}>
      <div className="modal-card max-h-[92vh] w-full max-w-[560px] overflow-auto rounded-[28px] bg-[#f5f0e7] p-6 text-[#183329] shadow-2xl sm:p-9" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <span className="mono text-[0.62rem] text-[#d36b4e]">Community Youth & Skills Development</span>
            <h2 id="modal-title" className="display mt-3 text-4xl leading-none sm:text-5xl">{title}</h2>
            <p className="mt-4 max-w-[420px] text-sm leading-6 text-[#52665d]">{description}</p>
          </div>
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#183329]/15" onClick={onClose} aria-label="Close dialog" data-testid="button-close-modal">
            <X size={18} />
          </button>
        </div>
        {sent ? (
          <div className="rounded-2xl bg-[#dce8d2] p-6" role="status" data-testid="status-form-success">
            <CheckCircle2 className="text-[#39704d]" size={28} />
            <h3 className="mt-4 text-lg font-bold">Thank you for reaching out.</h3>
            <p className="mt-2 text-sm leading-6 text-[#52665d]">We have your note. Our team will be in touch at {email || 'your email address'} soon.</p>
            <button className="button-dark mt-6 min-h-11" onClick={onClose} data-testid="button-finish-modal">Close</button>
          </div>
        ) : isDonation ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#183329]/15 bg-[#f4a340]/5 p-5">
              <p className="mb-4 text-sm font-bold text-[#183329]">Bank Transfer Details</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#52665d]">Account Name</p>
                  <p className="mt-1 text-sm text-[#183329]">AC Empowerment Initiatives</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#52665d]">Account Number</p>
                  <p className="mt-1 text-sm font-mono text-[#183329]">3005008601</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#52665d]">Bank Name</p>
                  <p className="mt-1 text-sm text-[#183329]">GTB Bank</p>
                </div>
              </div>
            </div>
            <p className="text-xs leading-5 text-[#52665d]">For partnership support or other payment methods, email communityyouthdevelopmentsocie@gmail.com.</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em]">Your name</span>
              <input required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-[#183329]/15 bg-[#fffaf1] px-4 py-3 outline-none focus:border-[#d36b4e]" placeholder="How should we call you?" data-testid="input-contact-name" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em]">Email address</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[#183329]/15 bg-[#fffaf1] px-4 py-3 outline-none focus:border-[#d36b4e]" placeholder="you@example.com" data-testid="input-contact-email" />
            </label>
            {isProgram && (
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em]">What are you interested in?</span>
                <select className="w-full rounded-xl border border-[#183329]/15 bg-[#fffaf1] px-4 py-3 outline-none focus:border-[#d36b4e]" data-testid="select-program-interest">
                  <option>Vocational and technical training</option>
                  <option>Digital literacy</option>
                  <option>Entrepreneurship</option>
                  <option>Creative arts</option>
                  <option>Not sure yet</option>
                </select>
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.1em]">Your note</span>
              <textarea required value={message} onChange={(event) => setMessage(event.target.value)} rows={4} className="w-full resize-none rounded-xl border border-[#183329]/15 bg-[#fffaf1] px-4 py-3 outline-none focus:border-[#d36b4e]" placeholder="Tell us a little about what you need..." data-testid="textarea-contact-message" />
            </label>
            <button type="submit" className="button-dark w-full" data-testid="button-submit-contact">Send message <ArrowRight size={16} /></button>
          </form>
        )}
      </div>
    </div>
  );
}

function Home() {
  useReveal();
  const [modal, setModal] = useState<'donate' | 'contact' | 'program' | null>(null);
  return (
    <main id="top" className="site-shell grain min-h-[100dvh]">
      <section className="relative min-h-[720px] overflow-hidden bg-[#183329] text-[#f5f0e7] sm:min-h-[790px]">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <img src="https://communityyouthservices.site/images/team-workspace.jpg" alt="Young Nigerians learning together in a bright workspace" className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#10251d_4%,rgba(16,37,29,.94)_29%,rgba(16,37,29,.42)_67%,rgba(16,37,29,.62))]" />
        <Header onDonate={() => setModal('donate')} />
        <div className="relative mx-auto flex min-h-[720px] max-w-[1240px] items-end px-5 pb-16 pt-32 sm:min-h-[790px] sm:px-8 sm:pb-20 lg:px-10">
          <div className="max-w-[780px]">
            <div className="reveal flex items-center gap-3">
              <span className="mono rounded-full border border-[#f4a340]/60 px-3 py-2 text-[0.58rem] text-[#f4a340]">Nigeria · Est. 2026</span>
              <span className="hidden h-px w-14 bg-[#f4a340]/55 sm:block" />
              <span className="hidden text-xs text-[#c6d1c8] sm:block">A society for practical possibility</span>
            </div>
            <h1 className="reveal delay-1 display mt-7 max-w-[720px] text-[clamp(3.8rem,9vw,8.2rem)] leading-[0.84]">
              Rooted in <span className="text-[#f4a340]">Nigeria.</span><br />
              Rising through <em className="font-normal text-[#f5f0e7]">skills.</em>
            </h1>
            <div className="reveal delay-2 mt-8 grid max-w-[690px] gap-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-[510px] text-base leading-7 text-[#d5ddd4] sm:text-lg">
                We equip young Nigerians with practical skills, brave support and real connections—so they can shape a life of dignity, right here at home.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="button-primary" onClick={() => scrollToSection('#programmes')} data-testid="button-hero-programs">Explore programmes <ArrowRight size={16} /></button>
                <button className="button-outline" onClick={() => setModal('contact')} data-testid="button-hero-contact">Talk with us</button>
              </div>
            </div>
            <div className="reveal delay-3 mt-16 flex items-center gap-5 text-[#a9b8ae]">
              <span className="mono text-[0.58rem]">Scroll to see the work</span>
              <span className="h-px w-20 bg-[#a9b8ae]/40" />
              <ChevronRight size={16} className="rotate-90 text-[#f4a340]" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f4a340] py-4 text-[#183329]" aria-label="Our focus">
        <div className="flex min-w-max animate-[marquee_24s_linear_infinite] items-center gap-10 whitespace-nowrap">
          {['Skills that travel', 'Dignity that stays', 'Opportunity that grows', 'Communities that rise', 'Skills that travel', 'Dignity that stays'].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-10 text-sm font-bold uppercase tracking-[0.12em]">
              {item}<span className="text-xl font-normal">·</span>
            </span>
          ))}
        </div>
      </section>

      <section id="story" className="bg-[#f5f0e7] px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="reveal">
            <span className="mono text-[0.64rem] text-[#d36b4e]">01 / Why we exist</span>
            <h2 className="display mt-6 max-w-[470px] text-5xl leading-[0.95] sm:text-6xl">A skill is more than a skill.</h2>
            <div className="mt-10 overflow-hidden rounded-[22px]">
              <img src="https://communityyouthservices.site/images/woman-learning.jpg" alt="A young woman learning a practical skill" className="h-[310px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[390px]" />
            </div>
          </div>
          <div className="reveal delay-2 flex flex-col justify-end">
            <p className="max-w-[600px] text-2xl leading-[1.25] text-[#183329] sm:text-4xl">
              It is the sound of a young person saying, <span className="text-[#d36b4e]">“I can do this.”</span>
            </p>
            <div className="mt-9 grid gap-8 border-t border-[#183329]/15 pt-8 sm:grid-cols-2">
              <p className="text-sm leading-7 text-[#52665d]">Community Youth & Skills Development Society Inc. was created for the space between potential and opportunity. We meet young people with practical learning, patient mentorship and pathways that make sense in their lives.</p>
              <p className="text-sm leading-7 text-[#52665d]">Because when a young person is supported to earn, create and lead, the impact does not stop with them. It reaches a household. Then a street. Then a community.</p>
            </div>
            <button className="mt-9 flex w-fit items-center gap-3 text-sm font-bold text-[#183329] underline decoration-[#f4a340] decoration-2 underline-offset-8" onClick={() => setModal('contact')} data-testid="button-story-contact">Share the work with us <ArrowUpRight size={16} /></button>
          </div>
        </div>
      </section>

      <section id="programmes" className="bg-[#e8e0d3] px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="reveal flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <span className="mono text-[0.64rem] text-[#d36b4e]">02 / What we do</span>
              <h2 className="display mt-5 max-w-[660px] text-5xl leading-[0.92] sm:text-7xl">Make room for<br /><span className="text-[#d36b4e]">what is possible.</span></h2>
            </div>
            <p className="max-w-[270px] text-sm leading-6 text-[#52665d]">Different starting points. One shared direction: useful skills, stronger choices and a future that feels within reach.</p>
          </div>
          <div className="mt-16 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((programme, index) => {
              const Icon = programme.icon;
              return (
                <button
                  key={programme.title}
                  className={`program-card reveal delay-${(index % 4) + 1} group min-h-[260px] py-7 text-left`}
                  onClick={() => setModal('program')}
                  data-testid={`card-program-${index}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="program-number display text-4xl">0{index + 1}</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4a340]/15 text-[#183329]">
                      <Icon size={20} strokeWidth={1.7} />
                    </span>
                  </div>
                  <h3 className="mt-8 max-w-[230px] text-lg font-bold leading-tight">{programme.title}</h3>
                  <p className="mt-3 max-w-[250px] text-sm leading-6 text-[#52665d]">{programme.text}</p>
                  <span className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#d36b4e] opacity-0 transition-opacity group-hover:opacity-100">Find out more <ArrowRight size={14} /></span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#183329] px-5 py-24 text-[#f5f0e7] sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="reveal">
            <span className="mono text-[0.64rem] text-[#f4a340]">03 / The ripple</span>
            <h2 className="display mt-6 max-w-[600px] text-5xl leading-[0.94] sm:text-7xl">When one person rises, a family feels it.</h2>
            <p className="mt-8 max-w-[500px] text-base leading-7 text-[#cbd7ce]">Our work is local by design. We listen first, learn alongside people and build programmes around the realities young Nigerians are already navigating.</p>
            <div className="mt-10 grid max-w-[520px] grid-cols-2 gap-6 border-t border-[#f5f0e7]/20 pt-6">
              <div><span className="display text-4xl text-[#f4a340]">01</span><p className="mt-2 text-sm leading-5 text-[#cbd7ce]">Learn something useful</p></div>
              <div><span className="display text-4xl text-[#f4a340]">02</span><p className="mt-2 text-sm leading-5 text-[#cbd7ce]">Pass it forward</p></div>
            </div>
          </div>
          <div className="reveal delay-2 relative">
            <div className="image-wash overflow-hidden rounded-[24px]">
              <img src="https://communityyouthservices.site/images/community-outdoor.jpg" alt="Young people gathering outdoors in their community" className="h-[450px] w-full object-cover sm:h-[570px]" />
            </div>
            <div className="absolute -bottom-5 -left-2 max-w-[255px] rounded-2xl bg-[#f4a340] p-5 text-[#183329] shadow-xl sm:-left-8">
              <p className="text-sm font-bold leading-5">“We are not waiting for someone else to build the future.”</p>
              <span className="mono mt-3 block text-[0.56rem]">A belief we share</span>
            </div>
          </div>
        </div>
      </section>

      <section id="founder" className="bg-[#f5f0e7] px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="reveal order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[22px] bg-[#d4c5af]">
              <img src="https://communityyouthservices.site/images/founder-placeholder.jpg" alt="C.O Alfred, Founder and Executive Director" className="h-[440px] w-full object-cover grayscale-[20%] sm:h-[520px]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#183329]/80 to-transparent p-6 pt-24 text-[#f5f0e7]">
                <p className="text-lg font-bold">C.O Alfred</p>
                <p className="mt-1 text-sm text-[#dce6dc]">Founder & Executive Director</p>
              </div>
            </div>
          </div>
          <div className="reveal delay-2 order-1 flex flex-col justify-center lg:order-2">
            <span className="mono text-[0.64rem] text-[#d36b4e]">04 / A note from our founder</span>
            <blockquote className="display mt-7 max-w-[720px] text-4xl leading-[1.05] sm:text-6xl">“The future of Nigeria is already here—in the hands, minds and ideas of our young people.”</blockquote>
            <p className="mt-8 max-w-[560px] text-base leading-7 text-[#52665d]">C.O Alfred founded the Society with a clear conviction: development has to feel close enough to touch. That means opening doors, sharing knowledge and making sure young people are not asked to imagine opportunity alone.</p>
            <button className="mt-9 flex w-fit items-center gap-3 text-sm font-bold text-[#183329] underline decoration-[#f4a340] decoration-2 underline-offset-8" onClick={() => setModal('contact')} data-testid="button-founder-message">Connect with the Society <ArrowUpRight size={16} /></button>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#d36b4e] px-5 py-24 text-[#f5f0e7] sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="reveal">
            <span className="mono text-[0.64rem] text-[#183329]">05 / Join the movement</span>
            <h2 className="display mt-6 max-w-[720px] text-6xl leading-[0.88] sm:text-8xl">There is room for you in this story.</h2>
          </div>
          <div className="reveal delay-2">
            <p className="max-w-[400px] text-lg leading-7 text-[#ffe5d8]">Support a programme. Offer a connection. Bring your expertise. Tell someone about us. Progress is a collective practice.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="button-dark" onClick={() => setModal('donate')} data-testid="button-contact-donate">Support our work <HeartHandshake size={16} /></button>
              <button className="button-outline border-[#f5f0e7]/60" onClick={() => setModal('contact')} data-testid="button-contact-message">Send a message <Mail size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#10251d] px-5 py-12 text-[#f5f0e7] sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-12 border-b border-[#f5f0e7]/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1fr_0.8fr_0.8fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-6 max-w-[230px] text-sm leading-6 text-[#a9b8ae]">Rooted in Nigeria. Rising through skills.</p>
          </div>
          <div>
            <span className="mono text-[0.58rem] text-[#f4a340]">Explore</span>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#d5ddd4]">
              <a href="#story" data-testid="link-footer-story">Why we exist</a>
              <a href="#programmes" data-testid="link-footer-programmes">Programmes</a>
              <a href="#founder" data-testid="link-footer-founder">Our people</a>
            </div>
          </div>
          <div>
            <span className="mono text-[0.58rem] text-[#f4a340]">Contact</span>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#d5ddd4]">
              <a href="mailto:communityyouthdevelopmentsocie@gmail.com" className="flex items-start gap-2 break-all" data-testid="link-footer-email"><Mail size={15} className="mt-0.5 shrink-0 text-[#f4a340]" /> communityyouthdevelopmentsocie@gmail.com</a>
              <span className="flex items-center gap-2"><MapPin size={15} className="shrink-0 text-[#f4a340]" /> Nigeria</span>
            </div>
          </div>
          <div className="rounded-2xl border border-[#f5f0e7]/15 p-5">
            <span className="mono text-[0.58rem] text-[#f4a340]">A small next step</span>
            <p className="mt-4 text-sm leading-6 text-[#d5ddd4]">Know a young person who could use a pathway? Start here.</p>
            <button className="mt-5 flex items-center gap-2 text-sm font-bold text-[#f4a340]" onClick={() => setModal('program')} data-testid="button-footer-program">Explore programmes <ArrowRight size={15} /></button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-3 pt-7 text-xs text-[#83968a] sm:flex-row">
          <span>© 2026 Community Youth & Skills Development Society Inc.</span>
          <span>Built with proximity, patience and purpose.</span>
        </div>
      </footer>

      {modal && <Modal type={modal} onClose={() => setModal(null)} />}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
