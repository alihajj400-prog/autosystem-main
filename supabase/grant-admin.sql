-- Run AFTER you sign up at /auth on your site.
-- Replace YOUR_USER_UUID with your user id from:
-- Supabase Dashboard → Authentication → Users → copy UUID

INSERT INTO public.user_roles (user_id, role)
VALUES ('237c881f-35e5-43aa-8768-350ca401ba36', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.profiles SET role = 'admin' WHERE id = '237c881f-35e5-43aa-8768-350ca401ba36';
