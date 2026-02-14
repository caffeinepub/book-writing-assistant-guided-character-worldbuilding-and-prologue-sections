# Specification

## Summary
**Goal:** Replace the freeform Band/Group creation with a dedicated multi-step Band/Group questionnaire, support much larger group sizes, and create all members’ Characters efficiently via a backend batch API.

**Planned changes:**
- Add a dedicated, multi-step Band/Group questionnaire flow separate from the single-character and family questionnaires, including at least one group-level setup step and per-member steps.
- Update the Band/Group “Number of Members” selection to allow counts beyond 7, with a configurable maximum of at least 45, and keep navigation/validation usable at larger sizes.
- Implement a backend batch API to create multiple characters in a single call (projectId + array of character fields) with existing project access control, and update the Band/Group flow to use it.

**User-visible outcome:** Users can start “Create Band/Group” and complete a guided questionnaire that creates one Character per member in the selected project (including for large groups up to at least 45), and the new characters appear in the Character Hub.
