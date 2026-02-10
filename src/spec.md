# Specification

## Summary
**Goal:** Build a multi-section book writing assistant where users can manage book projects and draft Characters, Worldbuilding, and Prologue content with guided prompts, persistent storage, and export.

**Planned changes:**
- Add top-level navigation with dedicated pages for Characters, Worldbuilding, and Prologue, preserving saved data when switching sections.
- Implement “Book Project” CRUD (create, view/select, rename, delete) with per-project scoped data and visible selected-project context.
- Build Characters section: create multiple characters per project, guided questionnaire (Identity, Background, Motivation/Goals, Conflicts/Flaws, Relationships, Voice/Dialogue, Arc/Role), persistent answers, and a read-only compiled Character Summary.
- Build Worldbuilding section: guided prompt categories (Setting, History, Culture/Society, Geography, Politics/Power, Rules/Systems, Themes/Tone) with saved short answers and longer freeform notes per category.
- Build Prologue section: guided prompts (Hook, POV/Voice, Stakes, Key Information/Reveals, Tone, Connection to Chapter One), a draft editor, and an Outline View showing prompts alongside the draft.
- Add frontend export for a selected project into a downloadable plain-text or Markdown file containing clearly separated Characters, Worldbuilding, and Prologue content.
- Implement backend Motoko actor APIs for CRUD on projects and characters (including questionnaire answers), plus save/load for worldbuilding notes and prologue prompts/draft, with stable storage persistence across upgrades.
- Apply a consistent creative visual theme (non-blue/purple primary palette) across navigation, forms, and pages.
- Add and display generated static images in the UI, served from `frontend/public/assets/generated`.

**User-visible outcome:** Users can create and manage book projects, fill out guided character and worldbuilding questionnaires, draft a prologue with supporting prompts, keep everything saved across reloads, and export a project to a single downloadable text/Markdown file, all within a cohesive themed UI.
