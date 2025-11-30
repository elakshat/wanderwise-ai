import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChatSidebar } from "@/components/ChatSidebar";
import { BackToTop } from "@/components/BackToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Booking Updates</Label>
                      <p className="text-sm text-muted-foreground">Get updates about your bookings</p>
                    </div>
                    <Switch checked={bookingUpdates} onCheckedChange={setBookingUpdates} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Promotions & Offers</Label>
                      <p className="text-sm text-muted-foreground">Receive special offers and deals</p>
                    </div>
                    <Switch checked={promotions} onCheckedChange={setPromotions} />
                  </div>
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>Customize how TravelMate looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Danger Zone</h3>
                    <Button onClick={handleLogout} variant="destructive">
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
      <ChatSidebar />
      <BackToTop />
    </div>
  );
};

export default Settings;
