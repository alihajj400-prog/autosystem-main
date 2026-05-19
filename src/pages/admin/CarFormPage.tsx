import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCar, useCreateCar, useUpdateCar, useUploadCarImage } from '@/hooks/useCars';
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
import { ArrowLeft, Loader2, Upload, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MAZDA_MODELS, LEBANESE_CITIES } from '@/lib/constants';

const carSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  trim: z.string().optional(),
  year: z.number().min(1990).max(2030),
  price: z.number().min(1, 'Price is required'),
  mileage: z.number().min(0),
  transmission: z.enum(['automatic', 'manual']),
  fuel_type: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
  engine: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(['excellent', 'good']),
  location: z.string().optional(),
  short_description: z.string().min(10, 'Description must be at least 10 characters'),
  full_description: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(['available', 'sold']),
});

type CarFormData = z.infer<typeof carSchema>;

export default function CarFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();

  const { data: existingCar, isLoading: isLoadingCar } = useCar(isEditing ? id : '');
  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const uploadImage = useUploadCarImage();

  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      model: '',
      trim: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      transmission: 'automatic',
      fuel_type: 'petrol',
      engine: '',
      color: '',
      condition: 'excellent',
      location: 'Dbayeh',
      short_description: '',
      full_description: '',
      featured: false,
      status: 'available',
    },
  });

  // Update form when existing car loads
  useEffect(() => {
    if (existingCar) {
      reset({
        model: existingCar.model,
        trim: existingCar.trim || '',
        year: existingCar.year,
        price: existingCar.price,
        mileage: existingCar.mileage,
        transmission: existingCar.transmission,
        fuel_type: existingCar.fuel_type,
        engine: existingCar.engine || '',
        color: existingCar.color || '',
        condition: existingCar.condition as 'excellent' | 'good',
        location: existingCar.location || '',
        short_description: existingCar.short_description,
        full_description: existingCar.full_description || '',
        featured: existingCar.featured,
        status: (existingCar.status as 'available' | 'sold') || 'available',
      });
      setImages(existingCar.images || []);
      setSpecs(existingCar.specs || {});
      setFeatures(existingCar.features || []);
    }
  }, [existingCar, reset]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage.mutateAsync(file);
        newImages.push(url);
      }
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload image(s)');
    } finally {
      setIsUploading(false);
    }
  }, [uploadImage]);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    if (newSpecKey && newSpecValue) {
      setSpecs((prev) => ({ ...prev, [newSpecKey]: newSpecValue }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpec = (key: string) => {
    setSpecs((prev) => {
      const newSpecs = { ...prev };
      delete newSpecs[key];
      return newSpecs;
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CarFormData) => {
    try {
      const carData = {
        make: 'Mazda' as string,
        model: data.model,
        trim: data.trim || null,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        transmission: data.transmission,
        fuel_type: data.fuel_type,
        engine: data.engine || null,
        color: data.color || null,
        condition: data.condition,
        location: data.location || null,
        short_description: data.short_description,
        full_description: data.full_description || null,
        featured: data.featured,
        status: data.status,
        images,
        specs,
        features,
      };

      if (isEditing) {
        await updateCar.mutateAsync({ id, ...carData });
        toast.success('Car updated successfully');
      } else {
        await createCar.mutateAsync(carData);
        toast.success('Car added successfully');
      }
      navigate('/admin/cars');
    } catch (error) {
      toast.error('Failed to save car. Please try again.');
    }
  };

  if (isEditing && isLoadingCar) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link
        to="/admin/cars"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cars
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">
          {isEditing ? 'Edit Car' : 'Add New Car'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isEditing
            ? 'Update the details for this vehicle'
            : 'Fill in the details for the new vehicle'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
        {/* Images */}
        <div>
          <Label className="text-base font-semibold">Images</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Upload photos of the vehicle. First image will be the main photo.
          </p>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg border">
                <img src={image} alt={`Car ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    Main
                  </span>
                )}
              </div>
            ))}
            
            <label className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <span className="mt-1 block text-xs text-muted-foreground">Upload</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="model">Model *</Label>
            <Select
              value={watch('model')}
              onValueChange={(value) => setValue('model', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MAZDA_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    Mazda {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.model && (
              <p className="mt-1 text-sm text-destructive">{errors.model.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="trim">Trim (optional)</Label>
            <Input
              id="trim"
              {...register('trim')}
              placeholder="e.g., Grand Touring"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              {...register('year', { valueAsNumber: true })}
              className="mt-1.5"
            />
            {errors.year && (
              <p className="mt-1 text-sm text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="mt-1.5"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mileage">Mileage (km) *</Label>
            <Input
              id="mileage"
              type="number"
              {...register('mileage', { valueAsNumber: true })}
              className="mt-1.5"
            />
            {errors.mileage && (
              <p className="mt-1 text-sm text-destructive">{errors.mileage.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="engine">Engine (optional)</Label>
            <Input
              id="engine"
              {...register('engine')}
              placeholder="e.g., 2.5L Turbo SKYACTIV-G"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="transmission">Transmission *</Label>
            <Select
              value={watch('transmission')}
              onValueChange={(value: 'automatic' | 'manual') => setValue('transmission', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fuel_type">Fuel Type *</Label>
            <Select
              value={watch('fuel_type')}
              onValueChange={(value: 'petrol' | 'diesel' | 'hybrid' | 'electric') =>
                setValue('fuel_type', value)
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Color (optional)</Label>
            <Input
              id="color"
              {...register('color')}
              placeholder="e.g., Soul Red Crystal"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="condition">Condition *</Label>
            <Select
              value={watch('condition')}
              onValueChange={(value: 'excellent' | 'good') => setValue('condition', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={watch('location') || ''}
              onValueChange={(value) => setValue('location', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {LEBANESE_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={watch('status')}
              onValueChange={(value: 'available' | 'sold') => setValue('status', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="short_description">Short Description *</Label>
            <Textarea
              id="short_description"
              {...register('short_description')}
              placeholder="Brief description shown on listing cards..."
              rows={2}
              className="mt-1.5"
            />
            {errors.short_description && (
              <p className="mt-1 text-sm text-destructive">{errors.short_description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="full_description">Full Description</Label>
            <Textarea
              id="full_description"
              {...register('full_description')}
              placeholder="Detailed description for the car detail page..."
              rows={4}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <Label className="text-base font-semibold">Features</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Add vehicle features like sunroof, leather seats, navigation, etc.
          </p>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="e.g., Sunroof, Leather Seats..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div>
          <Label className="text-base font-semibold">Additional Specifications</Label>
          <p className="mb-4 text-sm text-muted-foreground">
            Add custom specifications like horsepower, torque, etc.
          </p>

          <div className="space-y-3">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                <span className="flex-1 font-medium">{key}</span>
                <span className="flex-1 text-muted-foreground">{value}</span>
                <button
                  type="button"
                  onClick={() => removeSpec(key)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-3">
              <Input
                placeholder="Spec name (e.g., Horsepower)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g., 250 hp)"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addSpec}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <Switch
            id="featured"
            checked={watch('featured')}
            onCheckedChange={(checked) => setValue('featured', checked)}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Feature this vehicle on the homepage
          </Label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Car' : 'Add Car'}
          </Button>
          <Link to="/admin/cars">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
