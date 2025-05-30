-- Add is_important column to tasks table
ALTER TABLE public.tasks
ADD COLUMN is_important BOOLEAN DEFAULT FALSE NOT NULL;

COMMENT ON COLUMN public.tasks.is_important IS 'User-defined flag to mark a task as important for prioritization.'; 