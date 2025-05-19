
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    // Here we would normally make a Supabase auth request
    setTimeout(() => {
      setLoading(false);
      // Display success notification
      toast('Login Successful', {
        description: 'Welcome back to MarketMaster!',
      });
      
      // For demo, we'll just show a notification explaining about Supabase
      toast('Supabase Integration Required', {
        description: 'To implement full authentication, please connect to Supabase.',
      });
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    // Here we would normally make a Supabase auth request
    setTimeout(() => {
      setLoading(false);
      // Display success notification
      toast('Registration Successful', {
        description: 'Your account has been created successfully!',
      });
      
      // For demo, we'll just show a notification explaining about Supabase
      toast('Supabase Integration Required', {
        description: 'To implement full authentication, please connect to Supabase.',
      });
    }, 1000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-muted/30">
        <div className="max-w-md w-full p-6 bg-card shadow-lg rounded-lg m-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome to MarketMaster</h1>
            <p className="text-muted-foreground">
              Sign in to your account or create a new one
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Sign In'}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      className="text-primary hover:underline" 
                      onClick={() => setActiveTab('register')}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="John Doe" 
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  
                  <Alert>
                    <AlertDescription>
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      className="text-primary hover:underline" 
                      onClick={() => setActiveTab('login')}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <p className="text-center text-muted-foreground text-xs">
              This is a demo application. For full functionality including authentication, please connect to Supabase.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
