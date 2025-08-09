-- Add sequential_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN sequential_id SERIAL UNIQUE;

-- Create a function to assign sequential IDs to existing users
CREATE OR REPLACE FUNCTION assign_sequential_ids()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
  counter INTEGER := 1;
BEGIN
  -- Update existing profiles with sequential IDs based on creation order
  FOR profile_record IN 
    SELECT id FROM public.profiles 
    WHERE sequential_id IS NULL 
    ORDER BY created_at ASC
  LOOP
    UPDATE public.profiles 
    SET sequential_id = counter 
    WHERE id = profile_record.id;
    counter := counter + 1;
  END LOOP;
END;
$$;

-- Execute the function to assign IDs to existing users
SELECT assign_sequential_ids();

-- Update the handle_new_user function to assign sequential ID automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Create profile with sequential ID (SERIAL will auto-increment)
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user'));
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;