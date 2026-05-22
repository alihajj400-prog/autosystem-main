import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { PartFilters as PartFiltersType } from '@/types/part';
import { MAZDA_MODELS, PART_CATEGORIES } from '@/lib/constants';

interface PartFiltersProps {
  filters: PartFiltersType;
  onFiltersChange: (patch: Partial<PartFiltersType>) => void;
}

interface PartFiltersPanelProps {
  filters: PartFiltersType;
  onFilterChange: (key: keyof PartFiltersType, value: string | undefined) => void;
  onClear: () => void;
  activeFilterCount: number;
}

function PartFiltersPanel({
  filters,
  onFilterChange,
  onClear,
  activeFilterCount,
}: PartFiltersPanelProps) {
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium">Type</Label>
        <Select
          value={filters.type || '__all'}
          onValueChange={(value) =>
            onFilterChange('type', value === '__all' ? undefined : value)
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            <SelectItem value="__all">All types</SelectItem>
            <SelectItem value="part">Parts</SelectItem>
            <SelectItem value="screen">Screens</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Category</Label>
        <Select
          value={filters.category || '__all'}
          onValueChange={(value) =>
            onFilterChange('category', value === '__all' ? undefined : value)
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            <SelectItem value="__all">All categories</SelectItem>
            {PART_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Compatible model</Label>
        <Select
          value={filters.model || '__all'}
          onValueChange={(value) =>
            onFilterChange('model', value === '__all' ? undefined : value)
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any model" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            <SelectItem value="__all">Any model</SelectItem>
            {MAZDA_MODELS.map((model) => (
              <SelectItem key={model} value={model}>
                Mazda {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Condition</Label>
        <Select
          value={filters.condition || '__all'}
          onValueChange={(value) =>
            onFilterChange('condition', value === '__all' ? undefined : value)
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            <SelectItem value="__all">Any</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onClear} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}

export function PartFilters({ filters, onFiltersChange }: PartFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (localSearch !== (filters.search || '')) {
        onFiltersChange({ search: localSearch || undefined });
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [localSearch, filters.search, onFiltersChange]);

  const handleFilterChange = useCallback(
    (key: keyof PartFiltersType, value: string | undefined) => {
      onFiltersChange({ [key]: value });
    },
    [onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    setLocalSearch('');
    onFiltersChange({
      search: undefined,
      type: undefined,
      category: undefined,
      model: undefined,
      condition: undefined,
    });
  }, [onFiltersChange]);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, v]) => v !== undefined && key !== 'sort'
  ).length;
  const hasActiveFilters = activeFilterCount > 0;

  const panelProps = {
    filters,
    onFilterChange: handleFilterChange,
    onClear: clearFilters,
    activeFilterCount,
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search parts & screens..."
            className="pl-10"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

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
              <SheetTitle>Filter products</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <PartFiltersPanel {...panelProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden rounded-lg border bg-card p-6 lg:block">
        <h3 className="mb-4 font-display text-lg font-semibold">Filters</h3>
        <PartFiltersPanel {...panelProps} />
      </div>
    </div>
  );
}
