import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { ContactForm } from '@/components/cars/ContactForm';
import { Button } from '@/components/ui/button';
import { BUSINESS } from '@/lib/constants';

export default function ContactPage() {
  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="font-display text-2xl font-bold sm:text-3xl md:text-4xl">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Visit our showroom in {BUSINESS.city}, call us, or send a message via WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`tel:${BUSINESS.phone}`}>
              <Button variant="outline" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                {BUSINESS.phone}
              </Button>
            </a>
            <a href={BUSINESS.social.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
            <a href={BUSINESS.social.instagram} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Button>
            </a>
            <a href={BUSINESS.social.facebook} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </a>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-lg border bg-card p-5 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-semibold">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 font-display text-xl font-semibold">Visit Our Showroom</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="mt-1 text-muted-foreground">
                      {BUSINESS.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="mt-1 block text-muted-foreground hover:text-primary"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <a
                      href={BUSINESS.social.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-muted-foreground hover:text-primary"
                    >
                      Click to chat
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Instagram</h3>
                    <a
                      href={BUSINESS.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-muted-foreground hover:text-primary"
                    >
                      @autosystem.s.a.l
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Facebook className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Facebook</h3>
                    <a
                      href={BUSINESS.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-muted-foreground hover:text-primary"
                    >
                      autosystemsal
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="mt-1 block text-muted-foreground hover:text-primary"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <div className="mt-1 text-muted-foreground">
                      <p>{BUSINESS.hours.weekday}</p>
                      <p>{BUSINESS.hours.saturday}</p>
                      <p>{BUSINESS.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <iframe
                src={BUSINESS.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Autosystem Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
