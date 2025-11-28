import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Calendar, Plane, DollarSign, Heart, Settings } from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bookingsCount, setBookingsCount] = useState(0);
  const [savedTripsCount, setSavedTripsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);
      setFullName(profileData.full_name || "");
      setUsername(profileData.username || "");
    }

    // Load stats
    const { count: bookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: savedTrips } = await supabase
      .from("saved_trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setBookingsCount(bookings || 0);
    setSavedTripsCount(savedTrips || 0);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      loadProfile();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and travel preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-medium sticky top-24">
              <CardContent className="pt-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-bold mb-1">{fullName || "Traveler"}</h2>
                <p className="text-muted-foreground mb-4">@{username || "username"}</p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <Plane className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{bookingsCount}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <Heart className="h-5 w-5 mx-auto mb-1 text-secondary" />
                    <p className="text-2xl font-bold">{savedTripsCount}</p>
                    <p className="text-xs text-muted-foreground">Saved</p>
                  </div>
                </div>

                <Badge variant="secondary" className="mb-2">
                  Member since {new Date(user?.created_at).getFullYear()}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="johndoe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email} disabled />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Travel Preferences</CardTitle>
                    <CardDescription>Customize your travel experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Budget Preference</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Budget", "Moderate", "Luxury", "Premium"].map((budget) => (
                          <Button key={budget} variant="outline" className="justify-start">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {budget}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Travel Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Adventure", "Relaxation", "Cultural", "Romantic"].map((style) => (
                          <Button key={style} variant="outline" className="justify-start">
                            <Plane className="h-4 w-4 mr-2" />
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">About Me</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your travel interests..."
                        rows={4}
                      />
                    </div>

                    <Button className="w-full">Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <ChatSidebar />
    </div>
  );
};

export default Profile;
