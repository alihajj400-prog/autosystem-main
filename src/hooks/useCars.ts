import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, CarFilters } from '@/types/car';

export function useCars(filters?: CarFilters) {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      let query = supabase
        .from('cars')
        .select('*');

      if (filters?.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters?.yearMin) {
        query = query.gte('year', filters.yearMin);
      }
      if (filters?.yearMax) {
        query = query.lte('year', filters.yearMax);
      }
      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters?.mileageMax) {
        query = query.lte('mileage', filters.mileageMax);
      }
      if (filters?.transmission) {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters?.fuel_type) {
        query = query.eq('fuel_type', filters.fuel_type);
      }
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.search) {
        query = query.or(`model.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
      }

      // Sorting
      switch (filters?.sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'mileage_asc':
          query = query.order('mileage', { ascending: true });
          break;
        case 'mileage_desc':
          query = query.order('mileage', { ascending: false });
          break;
        case 'year_desc':
          query = query.order('year', { ascending: false });
          break;
        case 'year_asc':
          query = query.order('year', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Car[];
    },
  });
}

export function usePublicCars(filters?: CarFilters) {
  return useQuery({
    queryKey: ['public-cars', filters],
    queryFn: async () => {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'available');

      if (filters?.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters?.yearMin) {
        query = query.gte('year', filters.yearMin);
      }
      if (filters?.yearMax) {
        query = query.lte('year', filters.yearMax);
      }
      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
      }
      if (filters?.mileageMax) {
        query = query.lte('mileage', filters.mileageMax);
      }
      if (filters?.transmission) {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters?.fuel_type) {
        query = query.eq('fuel_type', filters.fuel_type);
      }
      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters?.search) {
        query = query.or(`model.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
      }

      switch (filters?.sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'mileage_asc':
          query = query.order('mileage', { ascending: true });
          break;
        case 'mileage_desc':
          query = query.order('mileage', { ascending: false });
          break;
        case 'year_desc':
          query = query.order('year', { ascending: false });
          break;
        case 'year_asc':
          query = query.order('year', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Car[];
    },
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Car | null;
    },
    enabled: !!id,
  });
}

export function useFeaturedCars() {
  return useQuery({
    queryKey: ['cars', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('featured', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Car[];
    },
  });
}

export function useSimilarCars(carId: string, model: string) {
  return useQuery({
    queryKey: ['cars', 'similar', carId, model],
    queryFn: async () => {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .neq('id', carId)
        .ilike('model', `%${model}%`)
        .limit(3);

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        return data as Car[];
      }

      const { data: fallback, error: fallbackError } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .neq('id', carId)
        .limit(3);

      if (fallbackError) throw fallbackError;
      return fallback as Car[];
    },
    enabled: !!carId && !!model,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (car: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cars')
        .insert(car)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['public-cars'] });
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...car }: Partial<Car> & { id: string }) => {
      const { data, error } = await supabase
        .from('cars')
        .update(car)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['public-cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', variables.id] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['public-cars'] });
    },
  });
}

export function useUploadCarImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      return publicUrl;
    },
  });
}
