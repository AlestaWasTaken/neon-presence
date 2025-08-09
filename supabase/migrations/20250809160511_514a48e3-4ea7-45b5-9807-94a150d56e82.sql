-- Add admin role to the admin user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('9312ca78-8214-4a9c-a7e9-df7d25c7e724', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;