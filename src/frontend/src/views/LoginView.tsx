import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface LoginViewProps {
  onBack: () => void;
}

export default function LoginView({ onBack }: LoginViewProps) {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      toast.error('Failed to log in. Please try again.');
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Log in to continue working on your stories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoginError && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              Login failed. Please try again.
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Log in with Internet Identity'
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Use your existing Internet Identity to securely access your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
