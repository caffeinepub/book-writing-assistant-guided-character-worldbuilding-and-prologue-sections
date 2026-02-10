import { BookOpen } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <img 
            src="/assets/generated/app-mark.dim_512x512.png" 
            alt="Book Writing Assistant" 
            className="w-10 h-10 object-contain"
          />
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Book Writing Assistant</h1>
          </div>
        </div>
      </div>
      <div className="w-full h-32 overflow-hidden opacity-20">
        <img 
          src="/assets/generated/hero-illustration.dim_1600x600.png" 
          alt="" 
          className="w-full h-full object-cover object-center"
        />
      </div>
    </header>
  );
}
