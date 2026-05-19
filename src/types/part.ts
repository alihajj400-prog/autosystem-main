export interface Part {
  id: string;
  name: string;
  category: string;
  type: 'part' | 'screen';
  compatible_models: string[];
  price: number;
  stock: number;
  condition: 'new' | 'used';
  short_description: string;
  full_description: string | null;
  images: string[];
  status: 'available' | 'unavailable';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartFilters {
  type?: 'part' | 'screen';
  category?: string;
  model?: string;
  condition?: string;
  search?: string;
  sort?: string;
}
