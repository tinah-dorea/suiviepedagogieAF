-- Add id_session column to horaire_cours table
-- This is needed for the consultation API to work properly

ALTER TABLE public.horaire_cours 
ADD COLUMN id_session integer;

-- Add foreign key constraint
ALTER TABLE public.horaire_cours
ADD CONSTRAINT horaire_cours_id_session_fkey 
FOREIGN KEY (id_session) REFERENCES public.session(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_horaire_cours_session ON public.horaire_cours USING btree (id_session);

-- Comment
COMMENT ON COLUMN public.horaire_cours.id_session IS 'Reference to the session this horaire belongs to';
