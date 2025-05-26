/*
  # Initial database schema for TaskFlow AI
  
  1. New Tables
     - `meeting_notes`
       - `id` (uuid, primary key)
       - `user_id` (uuid, references auth.users)
       - `original_text` (text)
       - `summary` (text)
       - `created_at` (timestamptz)
     
     - `tasks`
       - `id` (uuid, primary key)
       - `user_id` (uuid, references auth.users)
       - `note_id` (uuid, references meeting_notes.id)
       - `description` (text)
       - `due_date` (date, nullable)
       - `status` (text, default 'open')
       - `created_at` (timestamptz)
  
  2. Security
     - Enable RLS on all tables
     - Add policies for users to only access their own data
*/

-- Meeting Notes Table
CREATE TABLE IF NOT EXISTS meeting_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_text text NOT NULL,
  summary text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id uuid REFERENCES meeting_notes(id) ON DELETE CASCADE,
  description text NOT NULL,
  due_date date,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meeting_notes
CREATE POLICY "Users can create their own meeting notes"
  ON meeting_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own meeting notes"
  ON meeting_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for tasks
CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);