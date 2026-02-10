import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PrologueView {
    stakes: string;
    povVoice: string;
    hook: string;
    keyReveals: string;
    draft: string;
    connectionToChapterOne: string;
}
export interface WorldbuildingCategoryView {
    description: string;
    freeformNotes: Array<string>;
}
export interface CharacterView {
    flaws: string;
    background: string;
    storyRole: string;
    voice: string;
    name: string;
    motivations: string;
    relationships: string;
}
export interface BookProjectView {
    id: string;
    worldbuilding: Array<WorldbuildingCategoryView>;
    name: string;
    characters: Array<CharacterView>;
    prologue?: PrologueView;
}
export interface backendInterface {
    addCharacter(projectId: string, name: string, background: string, motivations: string, relationships: string, flaws: string, voice: string, storyRole: string): Promise<void>;
    addWorldbuildingNote(projectId: string, categoryName: string, note: string): Promise<void>;
    createProject(id: string, name: string): Promise<void>;
    deleteProject(id: string): Promise<void>;
    getAllProjects(): Promise<Array<BookProjectView>>;
    getProject(id: string): Promise<BookProjectView>;
    renameProject(id: string, newName: string): Promise<void>;
    savePrologue(projectId: string, hook: string, povVoice: string, stakes: string, keyReveals: string, connectionToChapterOne: string, draft: string): Promise<void>;
    updateWorldbuildingCategory(projectId: string, categoryName: string, description: string): Promise<void>;
}
