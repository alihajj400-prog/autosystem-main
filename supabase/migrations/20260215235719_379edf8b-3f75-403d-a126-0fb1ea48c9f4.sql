
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Create security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Migrate existing admin roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM public.profiles WHERE role = 'admin'
ON CONFLICT DO NOTHING;

-- 5. Auto-assign user role on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Add new columns to cars table
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS make text NOT NULL DEFAULT 'Mazda',
  ADD COLUMN IF NOT EXISTS trim text,
  ADD COLUMN IF NOT EXISTS engine text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS condition text NOT NULL DEFAULT 'excellent',
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'available';

-- 7. Update RLS policies on cars to use has_role
DROP POLICY IF EXISTS "Admins can delete cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Admins can update cars" ON public.cars;
DROP POLICY IF EXISTS "Cars are publicly viewable" ON public.cars;

CREATE POLICY "Cars are publicly viewable"
ON public.cars FOR SELECT
USING (true);

CREATE POLICY "Admins can insert cars"
ON public.cars FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cars"
ON public.cars FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cars"
ON public.cars FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Update RLS policies on contact_requests to use has_role
DROP POLICY IF EXISTS "Admins can update contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can view contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can submit contact request" ON public.contact_requests;

CREATE POLICY "Anyone can submit contact request"
ON public.contact_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view contact requests"
ON public.contact_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact requests"
ON public.contact_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 9. Update profiles RLS to also use has_role for admin access
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
