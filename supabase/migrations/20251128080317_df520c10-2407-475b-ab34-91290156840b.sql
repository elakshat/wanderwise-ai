-- Create saved_trips table
CREATE TABLE public.saved_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  itinerary_data JSONB,
  notes TEXT,
  travel_dates DATERANGE,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own saved trips" ON public.saved_trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own saved trips" ON public.saved_trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved trips" ON public.saved_trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved trips" ON public.saved_trips FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_saved_trips_updated_at 
BEFORE UPDATE ON public.saved_trips 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();