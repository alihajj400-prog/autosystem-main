import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Shield, Wrench } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { BrandLogo } from '@/components/layout/BrandLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo variant="light" showTagline={false} imageClassName="h-14 w-14" />
            <p className="mt-4 font-display text-lg font-semibold">Auto System S.A.L.</p>
            <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/70">
              Lebanon&apos;s trusted Mazda specialist — inspected used vehicles, transparent USD
              pricing, and genuine parts & screens in stock.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-secondary-foreground/60">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Inspected
              </span>
              <span className="inline-flex items-center gap-1.5 text-secondary-foreground/60">
                <Wrench className="h-3.5 w-3.5 text-primary" />
                Parts available
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li>
                <Link to="/inventory" className="transition-colors hover:text-primary">
                  View Inventory
                </Link>
              </li>
              <li>
                <Link to="/parts" className="transition-colors hover:text-primary">
                  Parts & Screens
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/auth" className="transition-colors hover:text-primary">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{BUSINESS.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href={`tel:${BUSINESS.phone}`} className="hover:text-primary">
                  {BUSINESS.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={BUSINESS.social.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg font-semibold">Hours</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <div>
                  <p>{BUSINESS.hours.weekday}</p>
                  <p>{BUSINESS.hours.saturday}</p>
                  <p>{BUSINESS.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-secondary-foreground/10 pt-8 text-center text-sm text-secondary-foreground/50">
          <p>
            &copy; {currentYear} Auto System S.A.L. — {BUSINESS.city}, {BUSINESS.country}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
