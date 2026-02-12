import { useState } from 'react';
import { Plus, FolderOpen, Pencil, Trash2, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjects } from '../state/useProjects';
import { useCreateProject, useRenameProject, useDeleteProject } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ProjectSwitcherProps {
  onOpenQuestionnaire?: (projectId: string) => void;
}

export default function ProjectSwitcher({ onOpenQuestionnaire }: ProjectSwitcherProps) {
  const { projects, selectedProjectId, selectedProject, setSelectedProjectId } = useProjects();
  const createProject = useCreateProject();
  const renameProject = useRenameProject();
  const deleteProject = useDeleteProject();

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const handleCreateNewProject = async () => {
    const id = `project_${Date.now()}`;
    const defaultName = `New Project ${projects.length + 1}`;
    
    try {
      await createProject.mutateAsync({ id, name: defaultName });
      setSelectedProjectId(id);
      toast.success('Project created successfully');
      
      // Open questionnaire immediately after creating project
      if (onOpenQuestionnaire) {
        onOpenQuestionnaire(id);
      }
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    }
  };

  const handleRename = async () => {
    if (!renameProjectId || !projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      await renameProject.mutateAsync({ id: renameProjectId, newName: projectName.trim() });
      setShowRenameDialog(false);
      setProjectName('');
      setRenameProjectId(null);
      toast.success('Project renamed successfully');
    } catch (error) {
      toast.error('Failed to rename project');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteProjectId) return;

    try {
      await deleteProject.mutateAsync(deleteProjectId);
      if (selectedProjectId === deleteProjectId) {
        setSelectedProjectId(null);
      }
      setShowDeleteDialog(false);
      setDeleteProjectId(null);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const openRenameDialog = (id: string, currentName: string) => {
    setRenameProjectId(id);
    setProjectName(currentName);
    setShowRenameDialog(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteProjectId(id);
    setShowDeleteDialog(true);
  };

  const handleOpenQuestionnaireForSelected = () => {
    if (selectedProjectId && onOpenQuestionnaire) {
      onOpenQuestionnaire(selectedProjectId);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              {selectedProject ? selectedProject.name : 'Select Project'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <div key={project.id} className="flex items-center">
                <DropdownMenuItem
                  className="flex-1 cursor-pointer"
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <span className="flex-1">{project.name}</span>
                  {selectedProjectId === project.id && <Check className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    openRenameDialog(project.id, project.name);
                  }}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(project.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                No projects yet
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateNewProject} className="cursor-pointer" disabled={createProject.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              {createProject.isPending ? 'Creating...' : 'New Project'}
            </DropdownMenuItem>
            {selectedProjectId && onOpenQuestionnaire && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenQuestionnaireForSelected} className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Book Setup Questionnaire
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Enter a new name for your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-project">Project Name</Label>
              <Input
                id="rename-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={renameProject.isPending}>
              {renameProject.isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This will permanently remove all characters,
              worldbuilding notes, and prologue content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProject.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
