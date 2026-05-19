import { useState } from 'react';
import { usePublicCars } from '@/hooks/useCars';
import { CarCard } from '@/components/cars/CarCard';
import { CarFilters } from '@/components/cars/CarFilters';
import { CarFilters as CarFiltersType } from '@/types/car';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function InventoryPage() {
  const [filters, setFilters] = useState<CarFiltersType>({});
  const { data: cars, isLoading, error } = usePublicCars(filters);

  return (
    <div className="animate-fade-in py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 rounded-2xl border bg-gradient-to-br from-card via-card to-primary/5 p-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Our Mazda Inventory</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Inspected used Mazdas with transparent USD pricing — your Mazda specialist in Lebanon.
          </p>
        </div>
        <div className="mb-8 flex justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select
              value={filters.sort || 'newest'}
              onValueChange={(value) => setFilters({ ...filters, sort: value === 'newest' ? undefined : value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="mileage_asc">Mileage: Low → High</SelectItem>
                <SelectItem value="mileage_desc">Mileage: High → Low</SelectItem>
                <SelectItem value="year_desc">Year: Newest</SelectItem>
                <SelectItem value="year_asc">Year: Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="mb-6 lg:mb-0">
            <CarFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Results */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
                <p className="text-destructive">Failed to load vehicles. Please try again.</p>
              </div>
            ) : cars && cars.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing {cars.length} vehicle{cars.length !== 1 ? 's' : ''}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <h3 className="font-display text-lg font-semibold">No vehicles found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
