-- Create comparison_sets table for storing property comparisons
CREATE TABLE IF NOT EXISTS comparison_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_ids TEXT[] NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_comparison_sets_user_id ON comparison_sets(user_id);

-- Create index on created_at for sorting
CREATE INDEX idx_comparison_sets_created_at ON comparison_sets(created_at DESC);

-- Enable RLS
ALTER TABLE comparison_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only read their own comparison sets
CREATE POLICY "Users can view their own comparison sets"
  ON comparison_sets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own comparison sets
CREATE POLICY "Users can create their own comparison sets"
  ON comparison_sets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own comparison sets
CREATE POLICY "Users can update their own comparison sets"
  ON comparison_sets
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own comparison sets
CREATE POLICY "Users can delete their own comparison sets"
  ON comparison_sets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_comparison_sets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_comparison_sets_updated_at_trigger
  BEFORE UPDATE ON comparison_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_comparison_sets_updated_at();
