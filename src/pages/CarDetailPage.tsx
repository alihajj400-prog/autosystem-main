import { useParams, Link } from 'react-router-dom';
import { useCar, useSimilarCars } from '@/hooks/useCars';
import { ImageGallery } from '@/components/cars/ImageGallery';
import { ContactForm } from '@/components/cars/ContactForm';
import { CarCard } from '@/components/cars/CarCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Fuel, Gauge, Settings, Calendar, Loader2, Phone, MessageCircle, MapPin } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { formatMileage, formatPrice } from '@/lib/format';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: car, isLoading, error } = useCar(id || '');
  const { data: similarCars } = useSimilarCars(id || '', car?.model || '');

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Vehicle Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/inventory"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>
    );
  }

  const carName = `${car.year} Mazda ${car.model}${car.trim ? ' ' + car.trim : ''}`;
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${carName} listed on your website.`);

  return (
    <div className="animate-fade-in py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/inventory"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <div className="min-w-0">
            {/* Gallery */}
            <ImageGallery images={car.images || []} alt={carName} />

            {/* Title & Price (Mobile) */}
            <div className="mt-6 lg:hidden">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {car.featured && <Badge>Featured</Badge>}
                    {car.status === 'sold' && <Badge variant="secondary">Sold</Badge>}
                  </div>
                  <h1 className="font-display text-2xl font-bold">{carName}</h1>
                </div>
                <p className="font-display text-2xl font-bold text-primary">
                  {formatPrice(car.price)}
                </p>
              </div>
              {/* Mobile CTAs */}
              <div className="mt-4 flex gap-2">
                <a href={`tel:${BUSINESS.phone}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                </a>
                <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="mt-6 flex flex-wrap gap-3 rounded-lg border bg-card p-3 sm:gap-4 sm:p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{car.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatMileage(car.mileage)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{car.fuel_type}</span>
              </div>
              {car.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{car.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold">Description</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground whitespace-pre-line">
                {car.full_description || car.short_description}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold">Specifications</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Make</span>
                  <span className="text-sm font-medium">{car.make || 'Mazda'}</span>
                </div>
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Model</span>
                  <span className="text-sm font-medium">{car.model}</span>
                </div>
                {car.trim && (
                  <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">Trim</span>
                    <span className="text-sm font-medium">{car.trim}</span>
                  </div>
                )}
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Year</span>
                  <span className="text-sm font-medium">{car.year}</span>
                </div>
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Mileage</span>
                  <span className="text-sm font-medium">{formatMileage(car.mileage)}</span>
                </div>
                {car.engine && (
                  <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">Engine</span>
                    <span className="text-sm font-medium">{car.engine}</span>
                  </div>
                )}
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Transmission</span>
                  <span className="text-sm font-medium capitalize">{car.transmission}</span>
                </div>
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Fuel Type</span>
                  <span className="text-sm font-medium capitalize">{car.fuel_type}</span>
                </div>
                {car.color && (
                  <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">Color</span>
                    <span className="text-sm font-medium">{car.color}</span>
                  </div>
                )}
                <div className="flex justify-between rounded-lg border bg-card px-4 py-3">
                  <span className="text-sm text-muted-foreground">Condition</span>
                  <span className="text-sm font-medium capitalize">{car.condition}</span>
                </div>
                {/* Custom specs */}
                {car.specs && Object.entries(car.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between rounded-lg border bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold">Features</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {car.features.map((feature, i) => (
                    <Badge key={i} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6 min-w-0">
            {/* Title & Price (Desktop) */}
            <div className="hidden lg:block">
              <div className="flex flex-wrap gap-2 mb-2">
                {car.featured && <Badge>Featured</Badge>}
                {car.status === 'sold' && <Badge variant="secondary">Sold</Badge>}
              </div>
              <h1 className="font-display text-2xl font-bold">{carName}</h1>
              <p className="mt-2 font-display text-3xl font-bold text-primary">
                {formatPrice(car.price)}
              </p>

              {/* CTA Buttons */}
              <div className="mt-4 flex gap-2">
                <a href={`tel:${BUSINESS.phone}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                </a>
                <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <Separator className="hidden lg:block" />

            {/* Contact Form */}
            <div className="rounded-lg border bg-card p-4 sm:p-6">
              <h3 className="mb-4 font-display text-base font-semibold sm:text-lg">Interested in this vehicle?</h3>
              <ContactForm carId={car.id} carName={carName} />
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars && similarCars.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 font-display text-2xl font-bold">Similar Vehicles</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {similarCars.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
