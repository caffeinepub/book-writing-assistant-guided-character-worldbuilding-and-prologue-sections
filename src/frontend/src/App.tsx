import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppHeader from './components/AppHeader';
import HomeView from './views/HomeView';
import SignUpView from './views/SignUpView';
import LoginView from './views/LoginView';
import CharactersPage from './sections/CharactersPage';
import WorldbuildingPage from './sections/WorldbuildingPage';
import ProloguePage from './sections/ProloguePage';
import ProjectSwitcher from './components/ProjectSwitcher';
import ExportProjectButton from './components/ExportProjectButton';
import WorkspaceMenu from './components/WorkspaceMenu';
import BookSetupQuestionnaireDialog from './components/bookSetup/BookSetupQuestionnaireDialog';
import { useProjects } from './state/useProjects';
import { useWorkspaceCategories } from './state/useWorkspaceCategories';

type AuthView = 'home' | 'signup' | 'login';
type WorkspaceSection = 'characters' | 'worldbuilding' | 'prologue';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [authView, setAuthView] = useState<AuthView>('home');
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('characters');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [questionnaireProjectId, setQuestionnaireProjectId] = useState<string | null>(null);
  const { selectedProject } = useProjects();
  const { getCategoryLabel, categoryExists } = useWorkspaceCategories();

  const isAuthenticated = !!identity;

  // Clear selection if the selected category no longer exists
  useEffect(() => {
    if (selectedGenre && !categoryExists(selectedGenre)) {
      setSelectedGenre('');
    }
  }, [selectedGenre, categoryExists]);

  const handleOpenQuestionnaire = (projectId: string) => {
    setQuestionnaireProjectId(projectId);
    setQuestionnaireOpen(true);
  };

  // Show loading state while checking authentication
  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Render auth views when not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background">
          <AppHeader showWorkspaceControls={false} />
          
          {authView === 'home' && (
            <HomeView 
              onSignUp={() => setAuthView('signup')}
              onLogin={() => setAuthView('login')}
            />
          )}
          
          {authView === 'signup' && (
            <SignUpView onBack={() => setAuthView('home')} />
          )}
          
          {authView === 'login' && (
            <LoginView onBack={() => setAuthView('home')} />
          )}

          <footer className="border-t mt-16 py-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} · Built with ❤️ using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.hostname : 'legendary-lovers-library'
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

  // Render authenticated workspace
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <AppHeader 
          showWorkspaceControls={true}
          menuButton={
            <WorkspaceMenu 
              activeSection={activeSection}
              onNavigate={setActiveSection}
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
            />
          }
        />
        
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <ProjectSwitcher onOpenQuestionnaire={handleOpenQuestionnaire} />
              {selectedGenre && (
                <div className="text-sm text-muted-foreground">
                  Genre: <span className="font-medium text-foreground">{getCategoryLabel(selectedGenre) || selectedGenre}</span>
                </div>
              )}
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
            <div className="space-y-6">
              {activeSection === 'characters' && <CharactersPage />}
              {activeSection === 'worldbuilding' && <WorldbuildingPage />}
              {activeSection === 'prologue' && <ProloguePage />}
            </div>
          )}
        </div>

        <footer className="border-t mt-16 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} · Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'legendary-lovers-library'
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

        {questionnaireProjectId && selectedProject && (
          <BookSetupQuestionnaireDialog
            open={questionnaireOpen}
            onOpenChange={setQuestionnaireOpen}
            projectId={questionnaireProjectId}
            projectName={selectedProject.name}
          />
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
