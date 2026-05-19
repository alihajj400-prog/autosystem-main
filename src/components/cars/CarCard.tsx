import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Fuel, Gauge, Settings, MapPin, CheckCircle2 } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/format';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link
      to={`/inventory/${car.id}`}
      className="group block overflow-hidden rounded-xl border bg-card card-shadow transition-all duration-300 hover:card-shadow-hover hover-lift"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0]}
            alt={`${car.year} Mazda ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {car.featured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
          {car.status === 'sold' && (
            <Badge variant="secondary">Sold</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {car.year} Mazda {car.model}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {car.short_description}
          </p>
        </div>

        {/* Specs */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            <span>{formatNumber(car.mileage)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-3.5 w-3.5" />
            <span className="capitalize">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            <span className="capitalize">{car.fuel_type}</span>
          </div>
          {car.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{car.location}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="font-display text-xl font-bold text-primary">{formatPrice(car.price)}</span>
          {car.condition === 'excellent' && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Inspected
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
