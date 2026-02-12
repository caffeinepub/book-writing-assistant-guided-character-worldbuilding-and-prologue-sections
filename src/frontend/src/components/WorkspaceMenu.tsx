import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Menu, Users, Globe, FileText, LogOut, Heart, Moon, Sparkles, Laugh, Zap, Brain, BookHeart, Music, Plus, X } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { workspaceMenuItems } from '../config/workspaceMenuItems';
import { useWorkspaceCategories } from '../state/useWorkspaceCategories';
import { toast } from 'sonner';

interface WorkspaceMenuProps {
  activeSection: string;
  onNavigate: (section: 'characters' | 'worldbuilding' | 'prologue') => void;
  selectedGenre?: string;
  onGenreSelect?: (genre: string) => void;
}

export default function WorkspaceMenu({ activeSection, onNavigate, selectedGenre, onGenreSelect }: WorkspaceMenuProps) {
  const { clear } = useInternetIdentity();
  const { customCategories, removeCustomCategory, addCustomCategory } = useWorkspaceCategories();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleLogout = () => {
    clear();
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      addCustomCategory(trimmedName);
      toast.success(`Category "${trimmedName}" added`);
      setNewCategoryName('');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleRemoveCategory = (id: string, label: string) => {
    removeCustomCategory(id);
    toast.success(`Category "${label}" removed`);
    
    // Clear selection if the removed category was selected
    if (selectedGenre === id) {
      onGenreSelect?.('');
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-4 h-4 mr-2" />;
      case 'Globe':
        return <Globe className="w-4 h-4 mr-2" />;
      case 'FileText':
        return <FileText className="w-4 h-4 mr-2" />;
      case 'Heart':
        return <Heart className="w-4 h-4 mr-2" />;
      case 'Moon':
        return <Moon className="w-4 h-4 mr-2" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 mr-2" />;
      case 'Laugh':
        return <Laugh className="w-4 h-4 mr-2" />;
      case 'Zap':
        return <Zap className="w-4 h-4 mr-2" />;
      case 'Brain':
        return <Brain className="w-4 h-4 mr-2" />;
      case 'BookHeart':
        return <BookHeart className="w-4 h-4 mr-2" />;
      case 'Music':
        return <Music className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const genreItems = workspaceMenuItems.filter(item => item.group === 'genres');
  const toolItems = workspaceMenuItems.filter(item => item.group === 'tools');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Book Boyfriend Genres
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {genreItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => onGenreSelect?.(item.id)}
                className={selectedGenre === item.id ? 'bg-accent' : ''}
              >
                {getIcon(item.icon)}
                {item.label}
              </DropdownMenuItem>
            ))}
            
            {customCategories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => onGenreSelect?.(category.id)}
                className={`${selectedGenre === category.id ? 'bg-accent' : ''} group`}
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className="flex-1">{category.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCategory(category.id, category.label);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Category
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Writing Tools
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {toolItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => onNavigate(item.id as 'characters' | 'worldbuilding' | 'prologue')}
                className={activeSection === item.id ? 'bg-accent' : ''}
              >
                {getIcon(item.icon)}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
            <DialogDescription>
              Create a new category for your book boyfriend projects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Fantasy, Mystery, Sci-Fi"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCategory();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
