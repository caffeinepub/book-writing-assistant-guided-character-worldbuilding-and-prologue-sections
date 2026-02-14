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
export interface CharacterQuestionnaireAnswers {
    flaws: string;
    storyRole: string;
    voice: string;
    motivations: string;
    hasCompletedOtherSections: boolean;
    hasCompletedBackground: boolean;
    relationships: string;
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
export interface CharacterInput {
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
    batchCreateCharacters(projectId: string, characters: Array<CharacterInput>): Promise<void>;
    createProject(id: string, name: string): Promise<void>;
    deleteProject(id: string): Promise<void>;
    getAllProjects(): Promise<Array<BookProjectView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacterQuestionnaireAnswers(projectId: string, characterName: string): Promise<CharacterQuestionnaireAnswers | null>;
    getProject(id: string): Promise<BookProjectView>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markBackgroundAndCreateCharacter(projectId: string, characterName: string, background: string): Promise<void>;
    markBackgroundQuestionnaireComplete(projectId: string, characterName: string): Promise<void>;
    renameProject(id: string, newName: string): Promise<void>;
    saveBookSetupAnswers(projectId: string, answers: BookSetupAnswers): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCharacterQuestionnaireAnswers(projectId: string, characterName: string, answers: CharacterQuestionnaireAnswers): Promise<void>;
    savePrologue(projectId: string, hook: string, povVoice: string, stakes: string, keyReveals: string, connectionToChapterOne: string, draft: string): Promise<void>;
    updateCharacter(projectId: string, name: string, background: string, motivations: string, relationships: string, flaws: string, voice: string, storyRole: string): Promise<void>;
    updateWorldbuildingCategory(projectId: string, categoryName: string, description: string): Promise<void>;
}
