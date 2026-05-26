import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Shield, MessageCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { HeroVideoBackground } from './HeroVideoBackground';

export function HomeHero() {
  const scrollToContent = () => {
    document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen flex-col">
      <HeroVideoBackground />

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col justify-center px-4 pb-24 pt-24 sm:pb-28 sm:pt-28 md:px-6">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white/90 backdrop-blur-md sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Trusted Mazda specialist in {BUSINESS.country}</span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-[1.08] text-white sm:text-4xl md:text-5xl lg:text-7xl">
            Premium Car Showroom
            <span className="mt-2 block text-primary">in {BUSINESS.country}</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg md:text-xl">
            Own your next Mazda with inspected quality, transparent USD pricing, and genuine parts
            & screens — {BUSINESS.city}&apos;s dedicated Mazda partner.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
            <Link
              to="/inventory"
              className="btn-hero-primary group inline-flex items-center gap-2"
            >
              Choose Your Car
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/contact" className="btn-hero-outline">
              Contact Us
            </Link>
            <a
              href={BUSINESS.social.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-outline hidden sm:inline-flex"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.35em] text-white/60 transition-colors hover:text-white"
        aria-label="Scroll to content"
      >
        <span>Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
