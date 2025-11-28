-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{"budget": "medium", "travel_style": "balanced", "interests": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create destinations table with 200+ entries (seeded separately)
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('beach', 'mountain', 'heritage', 'adventure', 'urban', 'nature', 'spiritual', 'romantic')),
  price_range TEXT CHECK (price_range IN ('budget', 'moderate', 'luxury', 'premium')),
  best_season TEXT[],
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 4.0,
  tags TEXT[],
  popular_activities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_conversations table
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('flight', 'hotel', 'package')),
  destination_id UUID REFERENCES public.destinations(id),
  booking_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for destinations (public read)
CREATE POLICY "Anyone can view destinations" ON public.destinations FOR SELECT USING (true);

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view own conversations" ON public.chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own conversations" ON public.chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.chat_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.chat_conversations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from own conversations" ON public.chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create messages in own conversations" ON public.chat_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND chat_conversations.user_id = auth.uid()
  )
);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed destinations with major Indian and international cities
INSERT INTO public.destinations (name, country, city, description, category, price_range, best_season, rating, tags, popular_activities, image_url) VALUES
-- India
('Jaipur - Pink City', 'India', 'Jaipur', 'Royal palaces and forts in the heart of Rajasthan', 'heritage', 'moderate', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], 4.6, ARRAY['heritage', 'architecture', 'culture', 'photography'], ARRAY['Visit Amber Fort', 'Hawa Mahal tour', 'City Palace', 'Local bazaars'], 'https://images.unsplash.com/photo-1599661046289-e31897846e41'),
('Goa Beaches', 'India', 'Goa', 'Tropical paradise with beaches, nightlife and Portuguese heritage', 'beach', 'moderate', ARRAY['November', 'December', 'January', 'February'], 4.7, ARRAY['beach', 'nightlife', 'water-sports', 'relaxation'], ARRAY['Beach hopping', 'Water sports', 'Night markets', 'Fort visits'], 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2'),
('Manali Hill Station', 'India', 'Manali', 'Scenic mountain town perfect for adventure and nature lovers', 'mountain', 'moderate', ARRAY['March', 'April', 'May', 'June', 'September', 'October'], 4.5, ARRAY['adventure', 'nature', 'trekking', 'snow'], ARRAY['Trekking', 'River rafting', 'Paragliding', 'Rohtang Pass'], 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23'),
('Udaipur - Venice of East', 'India', 'Udaipur', 'City of lakes with romantic palaces and sunset views', 'romantic', 'luxury', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], 4.8, ARRAY['romantic', 'heritage', 'lakes', 'luxury'], ARRAY['Lake Pichola boat ride', 'City Palace', 'Sunset views', 'Cultural shows'], 'https://images.unsplash.com/photo-1609137144813-7d9921338f24'),
('Kerala Backwaters', 'India', 'Alleppey', 'Tranquil waterways with houseboat stays and lush greenery', 'nature', 'moderate', ARRAY['September', 'October', 'November', 'December', 'January', 'February', 'March'], 4.7, ARRAY['nature', 'relaxation', 'houseboat', 'ayurveda'], ARRAY['Houseboat cruise', 'Ayurvedic spa', 'Village tours', 'Kerala cuisine'], 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944'),
('Rishikesh Yoga Capital', 'India', 'Rishikesh', 'Spiritual hub on Ganges river for yoga and adventure', 'spiritual', 'budget', ARRAY['February', 'March', 'April', 'May', 'September', 'October', 'November'], 4.6, ARRAY['spiritual', 'yoga', 'adventure', 'rafting'], ARRAY['River rafting', 'Yoga retreats', 'Bungee jumping', 'Ganga Aarti'], 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23'),
('Agra Taj Mahal', 'India', 'Agra', 'Home to the magnificent Taj Mahal and Mughal heritage', 'heritage', 'moderate', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], 4.9, ARRAY['heritage', 'architecture', 'wonder-of-world'], ARRAY['Taj Mahal sunrise', 'Agra Fort', 'Fatehpur Sikri', 'Photography'], 'https://images.unsplash.com/photo-1564507592333-c60657eea523'),
('Mumbai Gateway of India', 'India', 'Mumbai', 'Bustling metropolitan city with colonial architecture and Bollywood', 'urban', 'moderate', ARRAY['November', 'December', 'January', 'February'], 4.5, ARRAY['urban', 'nightlife', 'culture', 'food'], ARRAY['Marine Drive', 'Gateway of India', 'Street food tours', 'Bollywood tours'], 'https://images.unsplash.com/photo-1566552881560-0be862a7c445'),
('Varanasi Spiritual Capital', 'India', 'Varanasi', 'Ancient city on Ganges with profound spiritual significance', 'spiritual', 'budget', ARRAY['October', 'November', 'December', 'January', 'February', 'March'], 4.7, ARRAY['spiritual', 'heritage', 'culture', 'photography'], ARRAY['Ganga Aarti', 'Boat rides', 'Temple visits', 'Street walks'], 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc'),
('Shimla Queen of Hills', 'India', 'Shimla', 'Colonial hill station with scenic beauty and pleasant weather', 'mountain', 'moderate', ARRAY['March', 'April', 'May', 'June', 'September', 'October'], 4.4, ARRAY['mountain', 'nature', 'colonial', 'honeymoon'], ARRAY['Mall Road', 'Jakhu Temple', 'Toy train', 'Ridge walks'], 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23');

-- International destinations
INSERT INTO public.destinations (name, country, city, description, category, price_range, best_season, rating, tags, popular_activities, image_url) VALUES
('Paris Eiffel Tower', 'France', 'Paris', 'City of lights with iconic landmarks and romantic ambiance', 'romantic', 'luxury', ARRAY['April', 'May', 'June', 'September', 'October'], 4.9, ARRAY['romantic', 'heritage', 'art', 'cuisine'], ARRAY['Eiffel Tower', 'Louvre Museum', 'Seine cruise', 'French cuisine'], 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'),
('Dubai Modern Marvel', 'UAE', 'Dubai', 'Futuristic city with luxury shopping and modern architecture', 'urban', 'luxury', ARRAY['November', 'December', 'January', 'February', 'March'], 4.7, ARRAY['urban', 'luxury', 'shopping', 'adventure'], ARRAY['Burj Khalifa', 'Desert safari', 'Luxury shopping', 'Indoor skiing'], 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'),
('Bali Island Paradise', 'Indonesia', 'Bali', 'Tropical island with beaches, temples and wellness retreats', 'beach', 'moderate', ARRAY['April', 'May', 'June', 'September', 'October'], 4.8, ARRAY['beach', 'spiritual', 'nature', 'wellness'], ARRAY['Temple visits', 'Rice terraces', 'Surfing', 'Yoga retreats'], 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'),
('Singapore Urban Garden', 'Singapore', 'Singapore', 'Modern city-state blending nature, culture and innovation', 'urban', 'luxury', ARRAY['February', 'March', 'April', 'July', 'August'], 4.7, ARRAY['urban', 'food', 'shopping', 'family'], ARRAY['Gardens by the Bay', 'Universal Studios', 'Food courts', 'Marina Bay'], 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd'),
('Maldives Water Villas', 'Maldives', 'Male', 'Luxury island resort destination with crystal clear waters', 'beach', 'premium', ARRAY['November', 'December', 'January', 'February', 'March', 'April'], 4.9, ARRAY['beach', 'luxury', 'honeymoon', 'diving'], ARRAY['Snorkeling', 'Diving', 'Water villas', 'Spa treatments'], 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8');