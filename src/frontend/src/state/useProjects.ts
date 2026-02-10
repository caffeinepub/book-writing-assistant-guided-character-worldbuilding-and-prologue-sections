import { useState, useEffect } from 'react';
import { useGetAllProjects, useGetProject } from '../hooks/useQueries';

const SELECTED_PROJECT_KEY = 'selectedProjectId';

export function useProjects() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SELECTED_PROJECT_KEY);
    }
    return null;
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useGetAllProjects();
  const { data: selectedProject, isLoading: isLoadingProject } = useGetProject(selectedProjectId);

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem(SELECTED_PROJECT_KEY, selectedProjectId);
    } else {
      localStorage.removeItem(SELECTED_PROJECT_KEY);
    }
  }, [selectedProjectId]);

  // Auto-select first project if none selected and projects exist
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Clear selection if selected project no longer exists
  useEffect(() => {
    if (selectedProjectId && projects.length > 0 && !projects.find(p => p.id === selectedProjectId)) {
      setSelectedProjectId(null);
    }
  }, [projects, selectedProjectId]);

  return {
    projects,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    isLoading: isLoadingProjects || isLoadingProject,
  };
}
