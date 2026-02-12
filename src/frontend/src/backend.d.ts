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
export interface BookSetupCharacterAnswers {
    flaws: string;
    background: string;
    voice: string;
    name: string;
    role: string;
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
export interface CharacterView {
    flaws: string;
    background: string;
    storyRole: string;
    voice: string;
    name: string;
    motivations: string;
    relationships: string;
}
export interface BookSetupAnswers {
    worldbuilding: Array<BookSetupWorldbuildingCategoryAnswers>;
    hasPrologue: boolean;
    characters: Array<BookSetupCharacterAnswers>;
}
export interface UserProfile {
    name: string;
}
export interface BookSetupWorldbuildingCategoryAnswers {
    categoryName: string;
    description: string;
    freeformNotes: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCharacter(projectId: string, name: string, background: string, motivations: string, relationships: string, flaws: string, voice: string, storyRole: string): Promise<void>;
    addWorldbuildingNote(projectId: string, categoryName: string, note: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(id: string, name: string): Promise<void>;
    deleteProject(id: string): Promise<void>;
    getAllProjects(): Promise<Array<BookProjectView>>;
    getBookSetupAnswers(projectId: string): Promise<BookSetupAnswers | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(id: string): Promise<BookProjectView>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    renameProject(id: string, newName: string): Promise<void>;
    saveBookSetupAnswers(projectId: string, answers: BookSetupAnswers): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePrologue(projectId: string, hook: string, povVoice: string, stakes: string, keyReveals: string, connectionToChapterOne: string, draft: string): Promise<void>;
    updateCharacter(projectId: string, name: string, background: string, motivations: string, relationships: string, flaws: string, voice: string, storyRole: string): Promise<void>;
    updateWorldbuildingCategory(projectId: string, categoryName: string, description: string): Promise<void>;
}
