import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Part, PartFilters } from '@/types/part';

function normalizePart(row: Record<string, unknown>): Part {
  return {
    ...(row as Part),
    compatible_models: (row.compatible_models as string[]) ?? [],
    images: (row.images as string[]) ?? [],
    featured: Boolean(row.featured),
    price: Number(row.price),
    stock: Number(row.stock),
  };
}

function applyFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters?: PartFilters
) {
  let q = query;

  if (filters?.type) q = q.eq('type', filters.type);
  if (filters?.category) q = q.eq('category', filters.category);
  if (filters?.model) q = q.contains('compatible_models', [filters.model]);
  if (filters?.condition) q = q.eq('condition', filters.condition);
  if (filters?.search) {
    q = q.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`
    );
  }

  switch (filters?.sort) {
    case 'price_asc':
      q = q.order('price', { ascending: true });
      break;
    case 'price_desc':
      q = q.order('price', { ascending: false });
      break;
    case 'name_asc':
      q = q.order('name', { ascending: true });
      break;
    default:
      q = q.order('created_at', { ascending: false });
  }

  return q;
}

export function useParts(filters?: PartFilters) {
  return useQuery({
    queryKey: ['parts', filters],
    queryFn: async () => {
      const query = applyFilters(supabase.from('parts').select('*'), filters);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(normalizePart);
    },
  });
}

export function usePublicParts(filters?: PartFilters) {
  return useQuery({
    queryKey: ['public-parts', filters],
    queryFn: async () => {
      const query = applyFilters(
        supabase.from('parts').select('*').eq('status', 'available'),
        filters
      );
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(normalizePart);
    },
  });
}

export function usePart(id: string) {
  return useQuery({
    queryKey: ['part', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('parts').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data ? normalizePart(data) : null;
    },
    enabled: !!id,
  });
}

export function useFeaturedParts() {
  return useQuery({
    queryKey: ['parts', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .eq('featured', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return (data ?? []).map(normalizePart);
    },
  });
}

export function useCreatePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (part: Omit<Part, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('parts').insert(part).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['public-parts'] });
    },
  });
}

export function useUpdatePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...part }: Partial<Part> & { id: string }) => {
      const { data, error } = await supabase.from('parts').update(part).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['public-parts'] });
      queryClient.invalidateQueries({ queryKey: ['part', variables.id] });
    },
  });
}

export function useDeletePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('parts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['public-parts'] });
    },
  });
}

export function useUploadPartImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `parts/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('part-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('part-images').getPublicUrl(filePath);

      return publicUrl;
    },
  });
}
