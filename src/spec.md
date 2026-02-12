# Specification

## Summary
**Goal:** Add a new multi-character “giant questionnaire” flow that collects multiple related characters in one guided session and generates separate character profiles in the selected project.

**Planned changes:**
- Add a new multi-character questionnaire accessible from the Characters page alongside existing “New Character” and “Create Band/Group” flows.
- In the questionnaire, let users define multiple characters grouped by family-tree roles (mother, father, grandparent, child/kid, other) and capture per-character trait/background details in one continuous flow.
- On submit, create one saved character per defined person in the currently selected project and refresh the Characters list immediately.
- Block submission when no project is selected and show an English error message.
- Produce a new draft build including this functionality.

**User-visible outcome:** From the Characters page, users can launch a multi-character questionnaire, fill out several related characters in one session (organized by family roles), submit once, and immediately see multiple new character profiles appear in the Characters list.
