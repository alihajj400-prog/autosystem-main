import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParts, useDeletePart, useUpdatePart } from '@/hooks/useParts';
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
import { formatPrice } from '@/lib/format';

export default function AdminPartsPage() {
  const { data: parts, isLoading } = useParts();
  const deletePart = useDeletePart();
  const updatePart = useUpdatePart();
  const [search, setSearch] = useState('');

  const filtered = parts?.filter((part) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      part.name.toLowerCase().includes(q) ||
      part.category.toLowerCase().includes(q) ||
      part.short_description.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string, name: string) => {
    try {
      await deletePart.mutateAsync(id);
      toast.success(`${name} deleted.`);
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await updatePart.mutateAsync({ id, featured: !featured });
      toast.success(featured ? 'Removed from featured' : 'Added to featured');
    } catch {
      toast.error('Failed to update.');
    }
  };

  const toggleStatus = async (id: string, status: 'available' | 'unavailable') => {
    const newStatus = status === 'available' ? 'unavailable' : 'available';
    try {
      await updatePart.mutateAsync({ id, status: newStatus });
      toast.success(`Marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Manage Parts & Screens</h1>
          <p className="mt-1 text-muted-foreground">{parts?.length || 0} products</p>
        </div>
        <Link to="/admin/parts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add product
          </Button>
        </Link>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {part.images[0] ? (
                        <img src={part.images[0]} alt="" className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded bg-muted text-xs">
                          —
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{part.name}</span>
                        <p className="text-xs text-muted-foreground">{part.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{part.type}</TableCell>
                  <TableCell>{formatPrice(part.price)}</TableCell>
                  <TableCell>{part.stock}</TableCell>
                  <TableCell>
                    <button type="button" onClick={() => toggleStatus(part.id, part.status)}>
                      <Badge variant={part.status === 'unavailable' ? 'secondary' : 'default'}>
                        {part.status}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button type="button" onClick={() => toggleFeatured(part.id, part.featured)}>
                      {part.featured ? (
                        <Star className="h-5 w-5 fill-primary text-primary" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/parts/${part.id}`}>
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
                            <AlertDialogTitle>Delete {part.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove the product from your catalog.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(part.id, part.name)}
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
          <h3 className="font-display text-lg font-semibold">No products yet</h3>
          <Link to="/admin/parts/new" className="mt-4 inline-block">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
