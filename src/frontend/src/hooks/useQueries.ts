import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookProjectView, BookSetupAnswers } from '../backend';

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<BookProjectView[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProject(projectId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<BookProjectView | null>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      return actor.getProject(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.createProject(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useRenameProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.renameProject(id, newName);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useAddCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      name,
      background,
      motivations,
      relationships,
      flaws,
      voice,
      storyRole,
    }: {
      projectId: string;
      name: string;
      background: string;
      motivations: string;
      relationships: string;
      flaws: string;
      voice: string;
      storyRole: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addCharacter(projectId, name, background, motivations, relationships, flaws, voice, storyRole);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useUpdateCharacter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      name,
      background,
      motivations,
      relationships,
      flaws,
      voice,
      storyRole,
    }: {
      projectId: string;
      name: string;
      background: string;
      motivations: string;
      relationships: string;
      flaws: string;
      voice: string;
      storyRole: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateCharacter(projectId, name, background, motivations, relationships, flaws, voice, storyRole);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useCreateMultipleCharacters() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      characters,
    }: {
      projectId: string;
      characters: Array<{
        name: string;
        background: string;
        motivations: string;
        relationships: string;
        flaws: string;
        voice: string;
        storyRole: string;
      }>;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      for (const character of characters) {
        await actor.addCharacter(
          projectId,
          character.name,
          character.background,
          character.motivations,
          character.relationships,
          character.flaws,
          character.voice,
          character.storyRole
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useUpdateWorldbuildingCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      categoryName,
      description,
    }: {
      projectId: string;
      categoryName: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateWorldbuildingCategory(projectId, categoryName, description);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useAddWorldbuildingNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      categoryName,
      note,
    }: {
      projectId: string;
      categoryName: string;
      note: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addWorldbuildingNote(projectId, categoryName, note);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useSavePrologue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      hook,
      povVoice,
      stakes,
      keyReveals,
      connectionToChapterOne,
      draft,
    }: {
      projectId: string;
      hook: string;
      povVoice: string;
      stakes: string;
      keyReveals: string;
      connectionToChapterOne: string;
      draft: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.savePrologue(projectId, hook, povVoice, stakes, keyReveals, connectionToChapterOne, draft);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useSaveBookSetupAnswers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      answers,
    }: {
      projectId: string;
      answers: BookSetupAnswers;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveBookSetupAnswers(projectId, answers);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookSetupAnswers', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useGetBookSetupAnswers(projectId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<BookSetupAnswers | null>({
    queryKey: ['bookSetupAnswers', projectId],
    queryFn: async () => {
      if (!actor || !projectId) return null;
      return actor.getBookSetupAnswers(projectId);
    },
    enabled: !!actor && !isFetching && !!projectId,
  });
}
