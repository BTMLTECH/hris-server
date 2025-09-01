
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { useReduxAuth } from '@/hooks/auth/useReduxAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setError } from '@/store/slices/auth/authSlice';
import { Loader2, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  email: string;
}


const testEmails = [
  'hrtest@gmail.com',
  'managertest@gmail.com',
  'teamleadtest@gmail.com',
  'admintest@gmail.com',
  'employeetest1@gmail.com',
  'employeetest2@gmail.com',
  'employeetest3@gmail.com'
];

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpen, onClose, onVerify, email }) => {
  const [code, setCode] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
 const { isLoading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();  
  // const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const {resend2fa} =  useReduxAuth()
    const isTestEmail =
    process.env.NODE_ENV !== 'production' && testEmails.includes(email);

  // Start countdown when modal opens
  useEffect(() => {
    if (isOpen && countdown === 0) {
      setCountdown(10);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCode('');
      dispatch(setError(''));
      setCountdown(0);
    }
  }, [isOpen]);


    // Prefill code for test accounts
  useEffect(() => {
    if (isOpen && isTestEmail) {
      setCode('123456');
    }
  }, [isOpen, isTestEmail]);

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      dispatch(setError('Please enter a complete 6-digit code'));
      return;
    }
    await onVerify(code); 
  };

 const handleResendCode = async () => {
  if (countdown > 0) return;

  const success = await resend2fa(email);
  if (success) {
    setCountdown(10);
    toast({
      title: 'Code Resent',
      description: 'A new verification code has been sent to your email',
    });
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Two-Factor Authentication</DialogTitle>
          <DialogDescription className="text-gray-600">
            We've sent a 6-digit verification code to<br />
            <span className="font-medium">{maskEmail(email)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setCode(value);
                dispatch(setError(''));
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={handleVerify}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="text-center">
              <Button 
                variant="link" 
                className={`text-sm ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={handleResendCode}
                disabled={countdown > 0}
              >
                {countdown > 0 
                  ? `Resend code in ${countdown}s`
                  : "Didn't receive the code? Resend"
                }
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorModal;





