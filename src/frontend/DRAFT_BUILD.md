# Draft Build Instructions

This document describes how to produce and test a new draft build containing the multi-character family questionnaire feature.

## Build Steps

1. **Run the frontend build:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the application:**
   ```bash
   dfx deploy
   ```

## Testing the Multi-Character Questionnaire

### Feature Location
- Navigate to the **Characters** section in the app
- Look for the **"Family Questionnaire"** button (with UsersRound icon) alongside "Create Band/Group" and "New Character"

### Testing Checklist

#### Setup Phase
- [ ] Click "Family Questionnaire" button to open the dialog
- [ ] Verify the dialog shows "Multi-Character Family Questionnaire" title
- [ ] Click "Add Person" to add multiple people
- [ ] For each person, enter:
  - Name (required)
  - Family Role (mother/father/grandparent/child/other)
  - Gender (male/female/other)
- [ ] Verify you can remove people (minimum 1 person required)
- [ ] Verify all UI text is in English
- [ ] Click "Continue to Details"

#### Details Phase
- [ ] Verify the dialog shows each person's name and role in the header
- [ ] Verify progress indicator shows "X of Y"
- [ ] Fill in character details using the accordion sections:
  - Identity & Background
  - Motivations & Goals
  - Relationships
  - Conflicts & Flaws
  - Voice & Dialogue
  - Story Role & Arc
- [ ] Use "Next" button to move through each person
- [ ] Use "Back" button to return to previous person or setup
- [ ] On the last person, click "Create All Characters"

#### Validation
- [ ] Verify error message if no project is selected
- [ ] Verify error message for duplicate names
- [ ] Verify error message for names that already exist in the project
- [ ] Verify all people must have names before continuing to details

#### After Submission
- [ ] Verify success toast appears
- [ ] Verify all created characters appear immediately in the Characters list (no manual refresh needed)
- [ ] Verify each character has the correct name and role information
- [ ] Click on each character to verify their profile contains all entered information

### Expected Behavior
- The questionnaire creates multiple distinct character profiles in one flow
- Family role and gender are stored in the `storyRole` field
- Characters appear immediately after creation without page refresh
- Existing "New Character" and "Create Band/Group" flows remain unchanged

## Notes
- This feature does not modify any backend code
- All validation happens on the frontend before submission
- The feature uses existing React Query mutations for character creation
