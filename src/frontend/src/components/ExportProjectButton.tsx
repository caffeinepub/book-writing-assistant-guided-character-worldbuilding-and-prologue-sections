import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '../state/useProjects';
import { exportProject } from '../lib/exportProject';
import { toast } from 'sonner';

export default function ExportProjectButton() {
  const { selectedProject } = useProjects();

  const handleExport = () => {
    if (!selectedProject) {
      toast.error('No project selected');
      return;
    }

    try {
      exportProject(selectedProject);
      toast.success('Project exported successfully');
    } catch (error) {
      toast.error('Failed to export project');
      console.error(error);
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Export Project
    </Button>
  );
}
