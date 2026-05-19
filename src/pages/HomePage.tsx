import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Wrench, Star, Phone, MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarCard } from '@/components/cars/CarCard';
import { PartCard } from '@/components/parts/PartCard';
import { useFeaturedCars } from '@/hooks/useCars';
import { useFeaturedParts } from '@/hooks/useParts';
import { BUSINESS } from '@/lib/constants';

const heroImage = '/hero-mazda.svg';

const TESTIMONIALS = [
  {
    name: 'Rami K.',
    location: 'Beirut',
    text: 'Bought my CX-5 from Autosystem and couldn\'t be happier. The inspection was thorough and the price was fair. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Nadia H.',
    location: 'Jounieh',
    text: 'Professional service from start to finish. They helped me find the perfect Mazda3 within my budget. Great experience!',
    rating: 5,
  },
  {
    name: 'Georges M.',
    location: 'Dbayeh',
    text: 'Best used car dealership in Lebanon for Mazda. Transparent pricing, no hidden fees. My CX-30 runs like new.',
    rating: 5,
  },
  {
    name: 'Lina S.',
    location: 'Byblos',
    text: 'They went above and beyond to find the exact Mazda6 I wanted. The whole team is knowledgeable and trustworthy.',
    rating: 5,
  },
];

export default function HomePage() {
  const { data: featuredCars, isLoading } = useFeaturedCars();
  const { data: featuredParts, isLoading: partsLoading } = useFeaturedParts();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Premium Mazda vehicle in showroom"
            className="h-full w-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        
        <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
              Premium Mazda Dealership — {BUSINESS.city}, {BUSINESS.country}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Premium Used Mazda
              <span className="block text-primary">Vehicles in Lebanon</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/80">
              Inspected used Mazdas, transparent USD pricing, and genuine parts & screens — your
              Mazda specialist in {BUSINESS.city}, {BUSINESS.country}.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/inventory">
                <Button size="lg" className="group">
                  View Inventory
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/parts">
                <Button size="lg" variant="secondary" className="bg-white/15 text-white hover:bg-white/25">
                  <Package className="mr-2 h-4 w-4" />
                  Parts & Screens
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                  Contact Us
                </Button>
              </Link>
              <a href={BUSINESS.social.whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Multi-Point Inspection</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every vehicle undergoes a rigorous 150+ point inspection before sale
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Trusted Since 2005</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lebanon's trusted Mazda specialist with hundreds of happy customers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">Parts & Screens</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mazda parts, infotainment screens, and accessories in stock locally
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Featured Vehicles</h2>
            <p className="mt-4 text-muted-foreground">
              Handpicked premium Mazda vehicles ready for the road
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : featuredCars && featuredCars.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No featured vehicles at the moment.</p>
              <Link to="/inventory" className="mt-4 inline-block">
                <Button variant="outline">Browse All Vehicles</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/inventory">
              <Button variant="outline" size="lg" className="group">
                View All Inventory
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Parts & Screens</h2>
              <p className="mt-4 text-muted-foreground">
                Quality Mazda parts and infotainment screens — priced in USD, available in Lebanon
              </p>
            </div>
            <Link to="/parts">
              <Button variant="outline" className="group">
                View all products
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          {partsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : featuredParts && featuredParts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredParts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">Browse our parts catalog or contact us for availability.</p>
              <Link to="/parts" className="mt-4 inline-block">
                <Button variant="outline">Shop Parts & Screens</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-4 text-muted-foreground">
              Join hundreds of satisfied Mazda owners across Lebanon
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-lg border bg-background p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-secondary py-20 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Why Autosystem?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-secondary-foreground/80">
              For nearly two decades, Autosystem has been Lebanon's premier destination for used Mazda vehicles. 
              We specialize exclusively in Mazda, which means we know every model inside and out. 
              Every car we sell passes a comprehensive inspection, comes with transparent history, and is priced fairly.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-secondary-foreground/80">
              Whether you're looking for a sporty Mazda3, a family-friendly CX-5, or a luxurious CX-9, we'll help you find the perfect match.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/about">
                <Button size="lg" variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Learn More About Us
                </Button>
              </Link>
              <a href={`tel:${BUSINESS.phone}`}>
                <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
