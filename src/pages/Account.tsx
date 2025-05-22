
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileForm } from '@/components/account/ProfileForm';
import { PasswordForm } from '@/components/account/PasswordForm';
import { SettingsForm } from '@/components/account/SettingsForm';
import { ProfileData } from '@/types/profile';

export default function Account() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    avatar_url: null,
    phone: null,
  });

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, phone')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Use type assertion to handle potentially null values
        const profileData: ProfileData = data || { 
          first_name: '', 
          last_name: '', 
          avatar_url: null,
          phone: null 
        };
        
        setProfile(profileData);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfile();
  }, [user]);
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium mb-4">Please sign in to view your account</h1>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2 py-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile Information</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2 py-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Password Management</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Information Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ProfileForm 
                    userId={user.id} 
                    profile={profile}
                    setProfile={setProfile}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Password Management Tab */}
          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Password Management</h2>
                <PasswordForm userEmail={user.email!} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
