# Specification

## Summary
**Goal:** Convert the Family Questionnaire into a guided ~50-question multiple-choice flow per person that produces complete character background text and enforces that the main character is explicitly a son/daughter with at least one selected parent.

**Planned changes:**
- Replace the current per-person free-text “details” step in `MultiCharacterQuestionnaireDialog` with a Back/Next multiple-choice questionnaire (~50 questions), optionally grouped into sections with progress indicators.
- Add support for “Other (custom)” options where appropriate, using short inputs only for that selection.
- Create a dedicated, reusable Family Questionnaire question bank module with stable question IDs, types, labels, and option values; store answers keyed by question ID per person and persist them while navigating within the wizard.
- Generate the saved character text fields (background, motivations, relationships, flaws, voice, storyRole) deterministically from the selected answers when finishing (“Create All Characters”).
- Add explicit main character selection (exactly one), require the main character to be marked as Son or Daughter, and require selecting at least one parent from the other created people; block finishing with a clear validation error if missing.
- Expand family role choices to include explicit “Son” and “Daughter” and reflect parent/child linkage in the generated output text.

**User-visible outcome:** Users can create a family by answering guided multiple-choice questions for each person; on finishing, characters are created with coherent generated backgrounds, and the wizard prevents completion until the main character is explicitly a son/daughter with at least one selected parent.
