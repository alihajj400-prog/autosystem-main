import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  usePart,
  useCreatePart,
  useUpdatePart,
  useUploadPartImage,
} from '@/hooks/useParts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { MAZDA_MODELS, PART_CATEGORIES } from '@/lib/constants';

const partSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['part', 'screen']),
  price: z.number().min(0.01, 'Price is required'),
  stock: z.number().min(0),
  condition: z.enum(['new', 'used']),
  short_description: z.string().min(10, 'Short description required'),
  full_description: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['available', 'unavailable']),
});

type PartFormData = z.infer<typeof partSchema>;

export default function PartFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  const { data: existing, isLoading: loadingPart } = usePart(isEditing ? id! : '');
  const createPart = useCreatePart();
  const updatePart = useUpdatePart();
  const uploadImage = useUploadPartImage();

  const [images, setImages] = useState<string[]>([]);
  const [compatibleModels, setCompatibleModels] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: '',
      category: '',
      type: 'part',
      price: 0,
      stock: 1,
      condition: 'new',
      short_description: '',
      full_description: '',
      featured: false,
      status: 'available',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        category: existing.category,
        type: existing.type,
        price: existing.price,
        stock: existing.stock,
        condition: existing.condition,
        short_description: existing.short_description,
        full_description: existing.full_description || '',
        featured: existing.featured,
        status: existing.status,
      });
      setImages(existing.images || []);
      setCompatibleModels(existing.compatible_models || []);
    }
  }, [existing, reset]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      setIsUploading(true);
      try {
        const urls: string[] = [];
        for (const file of Array.from(files)) {
          urls.push(await uploadImage.mutateAsync(file));
        }
        setImages((prev) => [...prev, ...urls]);
        toast.success(`${urls.length} image(s) uploaded`);
      } catch {
        toast.error('Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadImage]
  );

  const toggleModel = (model: string) => {
    setCompatibleModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const onSubmit = async (data: PartFormData) => {
    try {
      const payload = {
        ...data,
        full_description: data.full_description || null,
        images,
        compatible_models: compatibleModels,
      };
      if (isEditing) {
        await updatePart.mutateAsync({ id: id!, ...payload });
        toast.success('Product updated');
      } else {
        await createPart.mutateAsync(payload);
        toast.success('Product added');
      }
      navigate('/admin/parts');
    } catch {
      toast.error('Failed to save product');
    }
  };

  if (isEditing && loadingPart) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link
        to="/admin/parts"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Parts
      </Link>

      <h1 className="font-display text-2xl font-bold">
        {isEditing ? 'Edit product' : 'Add product'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-3xl space-y-8">
        <div>
          <Label className="text-base font-semibold">Images</Label>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                <img src={image} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((_, i) => i !== index))}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed hover:border-primary">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
                onChange={handleImageUpload}
              />
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </label>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" className="mt-1.5" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Type *</Label>
            <Select value={watch('type')} onValueChange={(v: 'part' | 'screen') => setValue('type', v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="part">Part</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category *</Label>
            <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PART_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              className="mt-1.5"
              {...register('price', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              className="mt-1.5"
              {...register('stock', { valueAsNumber: true })}
            />
          </div>

          <div>
            <Label>Condition *</Label>
            <Select
              value={watch('condition')}
              onValueChange={(v: 'new' | 'used') => setValue('condition', v)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status *</Label>
            <Select
              value={watch('status')}
              onValueChange={(v: 'available' | 'unavailable') => setValue('status', v)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Compatible Mazda models</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {MAZDA_MODELS.map((model) => (
              <Badge
                key={model}
                variant={compatibleModels.includes(model) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleModel(model)}
              >
                {model}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="short_description">Short description *</Label>
          <Textarea id="short_description" rows={2} className="mt-1.5" {...register('short_description')} />
          {errors.short_description && (
            <p className="mt-1 text-sm text-destructive">{errors.short_description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="full_description">Full description</Label>
          <Textarea id="full_description" rows={4} className="mt-1.5" {...register('full_description')} />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="featured"
            checked={watch('featured')}
            onCheckedChange={(c) => setValue('featured', c)}
          />
          <Label htmlFor="featured">Feature on homepage</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Add product'}
          </Button>
          <Link to="/admin/parts">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
