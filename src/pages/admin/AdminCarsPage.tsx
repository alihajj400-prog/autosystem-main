import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCars, useDeleteCar, useUpdateCar } from '@/hooks/useCars';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Search, Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';
import { formatMileage } from '@/lib/format';

export default function AdminCarsPage() {
  const { data: cars, isLoading } = useCars();
  const deleteCar = useDeleteCar();
  const updateCar = useUpdateCar();
  const [search, setSearch] = useState('');

  const handleDelete = async (id: string, model: string) => {
    try {
      await deleteCar.mutateAsync(id);
      toast.success(`${model} has been deleted.`);
    } catch (error) {
      toast.error('Failed to delete car. Please try again.');
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await updateCar.mutateAsync({ id, featured: !featured });
      toast.success(featured ? 'Removed from featured' : 'Added to featured');
    } catch (error) {
      toast.error('Failed to update.');
    }
  };

  const toggleStatus = async (id: string, status: string) => {
    const newStatus = status === 'available' ? 'sold' : 'available';
    try {
      await updateCar.mutateAsync({ id, status: newStatus as 'available' | 'sold' });
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredCars = cars?.filter((car) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      car.model.toLowerCase().includes(q) ||
      car.short_description.toLowerCase().includes(q) ||
      car.year.toString().includes(q)
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Manage Cars</h1>
          <p className="mt-1 text-muted-foreground">
            {cars?.length || 0} vehicles in inventory
          </p>
        </div>
        <Link to="/admin/cars/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Car
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCars && filteredCars.length > 0 ? (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={car.images[0]}
                          alt={car.model}
                          className="h-12 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Mazda {car.model}</span>
                        {car.location && (
                          <p className="text-xs text-muted-foreground">{car.location}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{formatPrice(car.price)}</TableCell>
                  <TableCell>{formatMileage(car.mileage)}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(car.id, car.status || 'available')}>
                      <Badge variant={car.status === 'sold' ? 'secondary' : 'default'}>
                        {car.status || 'available'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleFeatured(car.id, car.featured)}>
                      {car.featured ? (
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/cars/${car.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {car.year} Mazda {car.model}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the car from your inventory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(car.id, `${car.year} Mazda ${car.model}`)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h3 className="font-display text-lg font-semibold">No cars in inventory</h3>
          <p className="mt-2 text-muted-foreground">
            Get started by adding your first car.
          </p>
          <Link to="/admin/cars/new" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Car
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
