import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BUSINESS } from '@/lib/constants';
import { isNavActive } from '@/lib/format';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/parts', label: 'Parts & Screens' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-[4.5rem] items-center justify-between">
          <BrandLogo />

          <nav className="hidden items-center gap-1 md:flex lg:gap-2">
            {navLinks.map((link) => {
              const active = isNavActive(location.pathname, link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary lg:flex"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS.phone}
            </a>
            <a href={BUSINESS.social.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-green-600 shadow-sm hover:bg-green-700">
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                WhatsApp
              </Button>
            </a>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            )}
          </div>

          <button
            className="rounded-md p-2 text-foreground transition-colors hover:bg-muted md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                    isNavActive(location.pathname, link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex gap-2 border-t pt-4">
                <a href={`tel:${BUSINESS.phone}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
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
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
