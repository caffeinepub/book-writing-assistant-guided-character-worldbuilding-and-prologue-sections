import { useState } from 'react';
import { Plus, FolderOpen, Pencil, Trash2, Check } from 'lucide-react';
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

export default function ProjectSwitcher() {
  const { projects, selectedProjectId, selectedProject, setSelectedProjectId } = useProjects();
  const createProject = useCreateProject();
  const renameProject = useRenameProject();
  const deleteProject = useDeleteProject();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const id = `project_${Date.now()}`;
    try {
      await createProject.mutateAsync({ id, name: projectName.trim() });
      setSelectedProjectId(id);
      setShowCreateDialog(false);
      setProjectName('');
      toast.success('Project created successfully');
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
            <DropdownMenuItem onClick={() => setShowCreateDialog(true)} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Give your book project a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="My Epic Fantasy Novel"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
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
