import { Shield, Award, Users, Sparkles, CheckCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-secondary py-20 text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            About Autosystem
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary-foreground/80">
            Lebanon's trusted Mazda specialist since 2005. We're passionate about connecting you with the perfect pre-owned Mazda.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Our Story</h2>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Autosystem was founded in {BUSINESS.city}, Lebanon with a clear mission: to become the most trusted name in used Mazda sales. We believe that a quality pre-owned Mazda delivers exceptional value — combining Japanese engineering, stunning design, and driving joy at a price that makes sense.
              </p>
              <p>
                Over the years, we've built our reputation on transparency, thorough inspections, and genuine care for our customers. Every car that enters our showroom undergoes a comprehensive 150+ point inspection by our Mazda-trained technicians before it's offered for sale.
              </p>
              <p>
                We specialize exclusively in Mazda because we know the brand inside and out. This focus allows us to offer expert advice, ensure quality, and provide a buying experience that generic dealerships simply can't match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy Used From Us */}
      <section className="border-y bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
            Why Buy Used From Autosystem
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Inspected & Certified</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                150+ point inspection on every vehicle by Mazda-trained technicians
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Fair & Transparent</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No hidden fees, no pressure. Honest pricing based on market value
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Mazda Specialists</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We only sell Mazda — our expertise is your advantage
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">Financing Options</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Flexible payment plans available to fit your budget
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Promise */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Our Inspection Promise</h2>
            <p className="mt-4 text-muted-foreground">
              Before any Mazda makes it to our showroom floor, it passes through our rigorous multi-point inspection:
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Engine & drivetrain diagnostics',
                'Brake system inspection',
                'Suspension & steering check',
                'Electrical systems test',
                'Interior & exterior condition',
                'Tire condition & alignment',
                'Fluid levels & quality',
                'Full road test evaluation',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="font-display text-4xl font-bold text-primary">20+</p>
              <p className="mt-2 text-muted-foreground">Years in Lebanon</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-primary">2,000+</p>
              <p className="mt-2 text-muted-foreground">Mazda Cars Sold</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-primary">100%</p>
              <p className="mt-2 text-muted-foreground">Inspected Before Sale</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
