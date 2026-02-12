import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface SignUpViewProps {
  onBack: () => void;
}

export default function SignUpView({ onBack }: SignUpViewProps) {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();

  const handleSignUp = async () => {
    try {
      await login();
    } catch (error) {
      toast.error('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Sign up to start building your stories. Your account is secured with Internet Identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoginError && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              Sign up failed. Please try again.
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleSignUp}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Sign up with Internet Identity'
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Internet Identity is a secure, privacy-preserving authentication system. 
              No passwords, no tracking, just secure access to your creative work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
