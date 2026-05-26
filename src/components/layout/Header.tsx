import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BUSINESS } from '@/lib/constants';
import { isNavActive } from '@/lib/format';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isHome = location.pathname === '/';
  const overlay = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/parts', label: 'Parts & Screens' },
    { href: '/contact', label: 'Contact' },
  ];

  const linkClass = (href: string) => {
    const active = isNavActive(location.pathname, href);
    if (overlay) {
      return cn(
        'text-sm font-medium transition-colors',
        active ? 'text-primary' : 'text-white/85 hover:text-white'
      );
    }
    return cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
    );
  };

  return (
    <header
      className={cn(
        'z-50 w-full transition-all duration-300',
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0',
        overlay
          ? 'border-transparent bg-transparent'
          : 'glass-header border-b shadow-sm',
        isHome && scrolled && 'bg-black/75 backdrop-blur-xl border-white/10'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-[4.75rem] sm:gap-4">
          <BrandLogo variant={overlay ? 'light' : 'dark'} />

          <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={BUSINESS.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'rounded-full p-2 transition-colors',
                overlay
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={BUSINESS.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'rounded-full p-2 transition-colors',
                overlay
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={BUSINESS.social.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'rounded-full p-2 transition-colors',
                overlay
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={`tel:${BUSINESS.phone}`}
              className={cn(
                'rounded-full p-2 transition-colors',
                overlay
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link to="/contact">
              <Button
                size="sm"
                className={cn(
                  'ml-1 rounded-full px-5 font-semibold',
                  overlay
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                Book a Visit
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'rounded-full',
                    overlay && 'border-white/30 bg-transparent text-white hover:bg-white/10'
                  )}
                >
                  Admin
                </Button>
              </Link>
            )}
          </div>

          <button
            className={cn(
              'rounded-md p-2 md:hidden',
              overlay ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav
            className={cn(
              'border-t py-4 md:hidden',
              overlay ? 'border-white/15' : 'border-border'
            )}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-2.5 text-sm font-medium',
                    overlay
                      ? isNavActive(location.pathname, link.href)
                        ? 'text-primary'
                        : 'text-white hover:bg-white/10'
                      : isNavActive(location.pathname, link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex justify-center gap-3 border-t border-inherit pt-4">
                <a
                  href={BUSINESS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'rounded-full p-2',
                    overlay ? 'text-white hover:bg-white/10' : 'text-muted-foreground hover:bg-muted'
                  )}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href={BUSINESS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'rounded-full p-2',
                    overlay ? 'text-white hover:bg-white/10' : 'text-muted-foreground hover:bg-muted'
                  )}
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={`tel:${BUSINESS.phone}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn('w-full', overlay && 'border-white/30 text-white')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                </a>
                <a
                  href={BUSINESS.social.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
