import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface HomeViewProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export default function HomeView({ onSignUp, onLogin }: HomeViewProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex flex-col items-center text-center space-y-12">
        <div className="space-y-6">
          <img 
            src="/assets/generated/app-mark.dim_512x512.png" 
            alt="Legendary Lovers Library" 
            className="w-32 h-32 mx-auto object-contain"
          />
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Heart className="w-8 h-8 text-primary fill-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Legendary Lovers Library</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Your creative companion for crafting compelling characters, rich worlds, and captivating stories inspired by your favorite book boyfriends.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Button 
            size="lg" 
            className="w-full text-lg h-14"
            onClick={onSignUp}
          >
            Sign up
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full text-lg h-14"
            onClick={onLogin}
          >
            Log in
          </Button>
        </div>

        <div className="pt-8 space-y-4 text-muted-foreground">
          <p className="text-sm max-w-2xl">
            Build detailed character profiles, develop your story's world, and craft the perfect opening. 
            All your creative work is securely stored and accessible from any device.
          </p>
        </div>
      </div>
    </div>
  );
}
