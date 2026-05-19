import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BUSINESS } from '@/lib/constants';
import { isNavActive } from '@/lib/format';

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
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <span className="font-display text-lg font-bold text-primary-foreground">A</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-semibold text-foreground">Autosystem</span>
              <span className="ml-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Mazda · Lebanon
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isNavActive(location.pathname, link.href)
                    ? 'text-primary'
                    : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
            >
              <Phone className="h-4 w-4" />
              {BUSINESS.phone}
            </a>
            <a href={BUSINESS.social.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isNavActive(location.pathname, link.href)
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
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
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
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
