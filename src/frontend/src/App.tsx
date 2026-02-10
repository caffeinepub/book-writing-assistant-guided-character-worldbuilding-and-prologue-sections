import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/AppHeader';
import CharactersPage from './sections/CharactersPage';
import WorldbuildingPage from './sections/WorldbuildingPage';
import ProloguePage from './sections/ProloguePage';
import ProjectSwitcher from './components/ProjectSwitcher';
import ExportProjectButton from './components/ExportProjectButton';
import { useProjects } from './state/useProjects';

export default function App() {
  const [activeTab, setActiveTab] = useState('characters');
  const { selectedProject } = useProjects();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <AppHeader />
        
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <ProjectSwitcher />
            </div>
            {selectedProject && (
              <ExportProjectButton />
            )}
          </div>

          {!selectedProject ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4 max-w-md">
                <h2 className="text-2xl font-semibold text-foreground">Welcome to Your Writing Studio</h2>
                <p className="text-muted-foreground">
                  Create or select a project to begin crafting your story's characters, world, and opening.
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="worldbuilding">Worldbuilding</TabsTrigger>
                <TabsTrigger value="prologue">Prologue</TabsTrigger>
              </TabsList>

              <TabsContent value="characters" className="space-y-6">
                <CharactersPage />
              </TabsContent>

              <TabsContent value="worldbuilding" className="space-y-6">
                <WorldbuildingPage />
              </TabsContent>

              <TabsContent value="prologue" className="space-y-6">
                <ProloguePage />
              </TabsContent>
            </Tabs>
          )}
        </div>

        <footer className="border-t mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} · Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'book-writing-assistant'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
