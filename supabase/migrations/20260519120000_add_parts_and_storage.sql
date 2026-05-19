-- Parts & screens inventory
CREATE TABLE public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('part', 'screen')),
  compatible_models TEXT[] DEFAULT '{}',
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used')),
  short_description TEXT NOT NULL,
  full_description TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available parts"
ON public.parts FOR SELECT
USING (status = 'available');

CREATE POLICY "Admins can view all parts"
ON public.parts FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert parts"
ON public.parts FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update parts"
ON public.parts FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete parts"
ON public.parts FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_parts_updated_at
  BEFORE UPDATE ON public.parts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix car-images storage policies to use has_role (user_roles)
DROP POLICY IF EXISTS "Admins can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete car images" ON storage.objects;

CREATE POLICY "Admins can upload car images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'car-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update car images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'car-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete car images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'car-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Part images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('part-images', 'part-images', true, 10485760)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Part images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'part-images');

CREATE POLICY "Admins can upload part images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'part-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update part images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'part-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete part images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'part-images' AND
    public.has_role(auth.uid(), 'admin')
  );
