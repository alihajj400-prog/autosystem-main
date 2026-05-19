export interface Car {
  id: string;
  make: string;
  model: string;
  trim: string | null;
  year: number;
  price: number;
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  engine: string | null;
  color: string | null;
  condition: 'excellent' | 'good';
  location: string | null;
  short_description: string;
  full_description: string | null;
  specs: Record<string, string>;
  features: string[];
  images: string[];
  featured: boolean;
  status: 'available' | 'sold';
  created_at: string;
  updated_at: string;
}

export interface CarFilters {
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  transmission?: string;
  fuel_type?: string;
  condition?: string;
  search?: string;
  sort?: string;
}

export interface ContactRequest {
  id: string;
  car_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  request_type: 'info' | 'test_drive';
  status: 'pending' | 'contacted' | 'closed';
  created_at: string;
}
