import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CarFilters as CarFiltersType } from '@/types/car';
import { MAZDA_MODELS, YEARS } from '@/lib/constants';

interface CarFiltersProps {
  filters: CarFiltersType;
  onFiltersChange: (filters: CarFiltersType) => void;
}

export function CarFilters({ filters, onFiltersChange }: CarFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFiltersChange({ ...filters, search: localSearch || undefined });
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [localSearch, filters.search, onFiltersChange]);

  const updateFilter = (key: keyof CarFiltersType, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({});
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, v]) => v !== undefined && key !== 'sort'
  ).length;
  const hasActiveFilters = activeFilterCount > 0;

  const ActiveFilterBadges = () => {
    if (!hasActiveFilters) return null;
    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {filters.model && (
          <Badge variant="secondary" className="gap-1">
            {filters.model}
            <button onClick={() => updateFilter('model', undefined)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {filters.transmission && (
          <Badge variant="secondary" className="gap-1">
            {filters.transmission}
            <button onClick={() => updateFilter('transmission', undefined)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {filters.fuel_type && (
          <Badge variant="secondary" className="gap-1">
            {filters.fuel_type}
            <button onClick={() => updateFilter('fuel_type', undefined)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {filters.condition && (
          <Badge variant="secondary" className="gap-1">
            {filters.condition}
            <button onClick={() => updateFilter('condition', undefined)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {(filters.priceMin || filters.priceMax) && (
          <Badge variant="secondary" className="gap-1">
            ${filters.priceMin || 0} - ${filters.priceMax || '∞'}
            <button onClick={() => { updateFilter('priceMin', undefined); updateFilter('priceMax', undefined); }} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    );
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Model */}
      <div>
        <Label htmlFor="model" className="text-sm font-medium">Model</Label>
        <Select
          value={filters.model || '__all'}
          onValueChange={(value) => updateFilter('model', value === '__all' ? undefined : value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All models" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All models</SelectItem>
            {MAZDA_MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                Mazda {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Year (Min)</Label>
          <Select
            value={filters.yearMin?.toString() || '__all'}
            onValueChange={(value) => updateFilter('yearMin', value === '__all' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">Any</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium">Year (Max)</Label>
          <Select
            value={filters.yearMax?.toString() || '__all'}
            onValueChange={(value) => updateFilter('yearMax', value === '__all' ? undefined : parseInt(value))}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">Any</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Price (Min)</Label>
          <Input
            type="number"
            placeholder="$0"
            className="mt-2"
            value={filters.priceMin || ''}
            onChange={(e) =>
              updateFilter('priceMin', e.target.value ? parseInt(e.target.value) : undefined)
            }
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Price (Max)</Label>
          <Input
            type="number"
            placeholder="No max"
            className="mt-2"
            value={filters.priceMax || ''}
            onChange={(e) =>
              updateFilter('priceMax', e.target.value ? parseInt(e.target.value) : undefined)
            }
          />
        </div>
      </div>

      {/* Mileage */}
      <div>
        <Label className="text-sm font-medium">Max Mileage (miles)</Label>
        <Input
          type="number"
          placeholder="No limit"
          className="mt-2"
          value={filters.mileageMax || ''}
          onChange={(e) =>
            updateFilter('mileageMax', e.target.value ? parseInt(e.target.value) : undefined)
          }
        />
      </div>

      {/* Transmission */}
      <div>
        <Label className="text-sm font-medium">Transmission</Label>
        <Select
          value={filters.transmission || '__all'}
          onValueChange={(value) => updateFilter('transmission', value === '__all' ? undefined : value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Any</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <Label className="text-sm font-medium">Fuel Type</Label>
        <Select
          value={filters.fuel_type || '__all'}
          onValueChange={(value) => updateFilter('fuel_type', value === '__all' ? undefined : value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Any</SelectItem>
            <SelectItem value="petrol">Petrol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div>
        <Label className="text-sm font-medium">Condition</Label>
        <Select
          value={filters.condition || '__all'}
          onValueChange={(value) => updateFilter('condition', value === '__all' ? undefined : value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Any</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Mazda vehicles..."
            className="pl-10"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        
        {/* Mobile Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Vehicles</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ActiveFilterBadges />

      {/* Desktop Filters */}
      <div className="hidden rounded-lg border bg-card p-6 lg:block">
        <h3 className="mb-4 font-display text-lg font-semibold">Filters</h3>
        <FiltersContent />
      </div>
    </div>
  );
}
