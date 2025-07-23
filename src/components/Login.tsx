
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useReduxAuth } from '@/hooks/auth/useReduxAuth';
import { LoginResponse } from '@/types/auth';
import { BarChart, Clock, Eye, EyeOff, Loader2, Shield, Users } from 'lucide-react';
import React, { useState } from 'react';
import RequestPassword from './Auth/RequestPassword';
import TwoFactorModal from './Auth/TwoFactorModal';
import { useAppSelector } from '@/store/hooks';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRequestPassword, setShowRequestPassword] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{email: string, password: string} | null>(null);
   const { isLoading, error } = useAppSelector((state) => state.auth);
  
  // const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, verify2fa } = useReduxAuth();



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();  
    const result = await login(email, password) as unknown as LoginResponse;
    if (result) {    
      setShow2FA(true);
    }
 
};

  const handle2FAVerification = async (code: string) => {
  try {
    const success = await verify2fa(email, code);
    if (success) {
      setShow2FA(false);
    } else {
      toast({
        title: 'Invalid verification code',
      });
         }
  } catch (error) {

          toast({
        title: 'Verification failed. Please try again.',
      });
  }
};

  const handleClose2FA = () => {
    setShow2FA(false);
    setPendingLogin(null);
  };


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                  <Shield className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600 text-lg">Sign in to your HRIS Dashboard</p>
              </div>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access the dashboard
                </CardDescription>
              </CardHeader>
    <CardContent className="space-y-4">
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="h-12"
        autoComplete="email"
        required
      />
    </div>

    <div className="space-y-2 relative">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="h-12 pr-10"
        autoComplete="current-password"
        required
      />
      <div
        className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-black"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </div>
    </div>

    {/* Forgot Password Link */}
    <div className="text-right">
      <Button
        type="button"
        variant="link"
        className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
        onClick={() => setShowRequestPassword(true)}
      >
        Forgot password?
      </Button>
    </div>

    <Button
      type="submit"
      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          Sign In
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
        </>
      ) : (
        'Sign In'
      )}
    </Button>
  </form>
</CardContent>

            </Card>

            {/* <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">Demo Accounts</CardTitle>
                <CardDescription className="text-center">Click to use demo credentials (2FA code: 123456)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.role}
                      variant="outline"
                      onClick={() => fillDemoCredentials(account.email, account.password)}
                      className="h-12 justify-start font-medium hover:bg-gray-50"
                    >
                      <div className={`w-3 h-3 rounded-full ${account.color} mr-3`} />
                      {account.role}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Right Side - Company Branding with BTM Text and Background Image */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23667eea"/><stop offset="100%" style="stop-color:%23764ba2"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23bg)"/><g opacity="0.1"><circle cx="200" cy="150" r="80" fill="white"/><circle cx="800" cy="200" r="120" fill="white"/><circle cx="1000" cy="600" r="100" fill="white"/><circle cx="300" cy="650" r="60" fill="white"/></g></svg>')`
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-800/80"></div>
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full p-8">
            <div className="text-center text-white space-y-8 max-w-lg">
              <div className="space-y-4">
                <h2 className="text-8xl font-bold tracking-wider">BTM</h2>
                <p className="text-xl opacity-90">Business Travel Management</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Users className="h-8 w-8" />
                    <div className="text-left">
                      <h3 className="font-semibold">Employee Management</h3>
                      <p className="text-sm opacity-80">Comprehensive workforce management</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <BarChart className="h-8 w-8" />
                    <div className="text-left">
                      <h3 className="font-semibold">Analytics & Reports</h3>
                      <p className="text-sm opacity-80">Data-driven insights and reporting</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Clock className="h-8 w-8" />
                    <div className="text-left">
                      <h3 className="font-semibold">Time Tracking</h3>
                      <p className="text-sm opacity-80">Efficient attendance management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </div>

      <TwoFactorModal
        isOpen={show2FA}
        onClose={handleClose2FA}
        onVerify={handle2FAVerification}
        email={pendingLogin?.email || email}
      />

      {/* Request Password Modal */}
      {showRequestPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <RequestPassword onBack={() => setShowRequestPassword(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
