import { useState, useCallback } from 'react';
import { PartFilters as PartFiltersType } from '@/types/part';
import { Link } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react';
import { usePublicParts } from '@/hooks/useParts';
import { PartCard } from '@/components/parts/PartCard';
import { PartFilters } from '@/components/parts/PartFilters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BUSINESS } from '@/lib/constants';

function applyFilterPatch(
  prev: PartFiltersType,
  patch: Partial<PartFiltersType>
): PartFiltersType {
  const next = { ...prev, ...patch };
  (Object.keys(patch) as (keyof PartFiltersType)[]).forEach((key) => {
    if (patch[key] === undefined) delete next[key];
  });
  return next;
}

export default function PartsPage() {
  const [filters, setFilters] = useState<PartFiltersType>({});
  const { data: parts, isLoading, error } = usePublicParts(filters);

  const handleFiltersChange = useCallback((patch: Partial<PartFiltersType>) => {
    setFilters((prev) => applyFilterPatch(prev, patch));
  }, []);

  return (
    <div className="animate-fade-in py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 rounded-2xl border bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                Autosystem · Lebanon
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                Parts & Screens
              </h1>
              <p className="mt-3 text-muted-foreground">
                Genuine and quality aftermarket Mazda parts, infotainment screens, and accessories —
                stocked locally in {BUSINESS.city} with transparent USD pricing.
              </p>
            </div>
            <a href={BUSINESS.social.whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700">WhatsApp for availability</Button>
            </a>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4 text-primary" />
            Mazda specialist · Inspected quality · Parts & screens in stock
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select
              value={filters.sort || 'newest'}
              onValueChange={(value) =>
                setFilters({ ...filters, sort: value === 'newest' ? undefined : value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
                <SelectItem value="name_asc">Name: A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <aside className="mb-6 lg:mb-0">
            <PartFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </aside>

          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
                <p className="text-destructive">Failed to load products. Please try again.</p>
              </div>
            ) : parts && parts.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing {parts.length} product{parts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {parts.map((part) => (
                    <PartCard key={part.id} part={part} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <h3 className="font-display text-lg font-semibold">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or contact us for special orders.
                </p>
                <Link to="/contact" className="mt-4 inline-block">
                  <Button variant="outline">Contact Autosystem</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
