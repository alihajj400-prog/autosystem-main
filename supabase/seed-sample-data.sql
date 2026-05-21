-- Optional demo inventory for Autosystem (run once in SQL Editor after setup-all.sql)
-- Safe to re-run: uses fixed UUIDs and ON CONFLICT

INSERT INTO public.cars (
  id, make, model, trim, year, price, mileage, transmission, fuel_type,
  engine, color, condition, location, short_description, full_description,
  featured, status, images, features, specs
) VALUES
(
  'a0000001-0000-4000-8000-000000000001',
  'Mazda', 'CX-5', 'Grand Touring', 2021, 28500, 42000, 'automatic', 'petrol',
  '2.5L SKYACTIV-G', 'Soul Red Crystal', 'excellent', 'Dbayeh',
  'Well-maintained CX-5 with full service history. Inspected and ready.',
  'Premium used Mazda CX-5 in excellent condition. Lebanese-spec, carefully maintained.',
  true, 'available', ARRAY['/images/mazda-cx5.jpg']::text[],
  ARRAY['Leather seats', 'BOSE audio', 'Sunroof', 'Apple CarPlay'],
  '{"Horsepower":"187 hp","Drivetrain":"AWD"}'::jsonb
),
(
  'a0000001-0000-4000-8000-000000000002',
  'Mazda', 'Mazda3', 'GT', 2020, 19500, 55000, 'automatic', 'petrol',
  '2.5L SKYACTIV-G', 'Machine Grey', 'excellent', 'Beirut',
  'Sporty Mazda3 sedan, low mileage for year, transparent pricing.',
  'Ideal city car with Mazda safety features and sharp handling.',
  true, 'available', ARRAY['/images/mazda3.jpg']::text[],
  ARRAY['Head-up display', 'Adaptive cruise', 'LED headlights'],
  '{"Horsepower":"186 hp","Drivetrain":"FWD"}'::jsonb
),
(
  'a0000001-0000-4000-8000-000000000003',
  'Mazda', 'CX-30', NULL, 2022, 24500, 28000, 'automatic', 'petrol',
  '2.5L SKYACTIV-G', 'Polymetal Grey', 'good', 'Jounieh',
  'Compact SUV perfect for Beirut traffic. One owner.',
  NULL, false, 'available', ARRAY['/images/mazda-cx30.jpg']::text[],
  ARRAY['Rear camera', 'Blind spot monitor'],
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.parts (
  id, name, category, type, compatible_models, price, stock, condition,
  short_description, full_description, featured, status, images
) VALUES
(
  'b0000001-0000-4000-8000-000000000001',
  'Mazda Connect 10.25" Display', 'Infotainment Screens', 'screen',
  ARRAY['CX-5', 'Mazda3', 'CX-30'], 450, 3, 'new',
  'OEM-style Mazda infotainment screen, plug-and-play compatible.',
  'High-resolution touchscreen for supported Mazda models. Includes wiring harness.',
  true, 'available', ARRAY['/images/mazda-cx5.jpg']::text[]
),
(
  'b0000001-0000-4000-8000-000000000002',
  'Front Brake Pad Set (CX-5)', 'Brakes & Suspension', 'part',
  ARRAY['CX-5'], 85, 12, 'new',
  'Quality brake pads for Mazda CX-5 — front axle.',
  NULL, false, 'available', ARRAY['/images/mazda-cx30.jpg']::text[]
)
ON CONFLICT (id) DO NOTHING;
