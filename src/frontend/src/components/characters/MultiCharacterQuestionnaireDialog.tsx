import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useProjects } from '../../state/useProjects';
import { useAddMultipleCharacters } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Plus, Trash2, Users, AlertCircle } from 'lucide-react';
import { FAMILY_ROLES, GENDER_OPTIONS, type PersonDraft, type FamilyRole, type Gender } from './multiCharacterQuestionnaireTypes';
import type { FamilyQuestionnaireAnswers } from './familyQuestionnaireTypes';
import FamilyQuestionnaireQuestionFlow from './FamilyQuestionnaireQuestionFlow';
import { generateCharacterText } from './familyQuestionnaireTextGenerator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MultiCharacterQuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MultiCharacterQuestionnaireDialog({ open, onOpenChange }: MultiCharacterQuestionnaireDialogProps) {
  const { selectedProjectId, selectedProject } = useProjects();
  const createMultiple = useAddMultipleCharacters();

  const [step, setStep] = useState<'setup' | 'details'>('setup');
  const [people, setPeople] = useState<PersonDraft[]>([]);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const [mainCharacterId, setMainCharacterId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const resetWizard = () => {
    setStep('setup');
    setPeople([]);
    setCurrentPersonIndex(0);
    setMainCharacterId(null);
    setValidationError(null);
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const addPerson = () => {
    const newPerson: PersonDraft = {
      id: `person-${Date.now()}-${Math.random()}`,
      name: '',
      familyRole: 'other',
      gender: 'other',
      background: '',
      motivations: '',
      relationships: '',
      flaws: '',
      voice: '',
      storyRole: '',
      questionnaireAnswers: {
        answers: {},
        isMainCharacter: false,
        parentIds: [],
      },
    };
    setPeople([...people, newPerson]);
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) {
      toast.error('You must have at least one person');
      return;
    }
    // If removing the main character, clear main character selection
    if (id === mainCharacterId) {
      setMainCharacterId(null);
    }
    setPeople(people.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: keyof PersonDraft, value: string) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleMainCharacterChange = (personId: string) => {
    setMainCharacterId(personId);
    setValidationError(null);
    // Update questionnaireAnswers for all people
    setPeople(people.map((p) => ({
      ...p,
      questionnaireAnswers: {
        ...p.questionnaireAnswers!,
        isMainCharacter: p.id === personId,
      },
    })));
  };

  const handleParentSelectionChange = (parentId: string, checked: boolean) => {
    if (!mainCharacterId) return;
    
    setPeople(people.map((p) => {
      if (p.id === mainCharacterId) {
        const currentParents = p.questionnaireAnswers?.parentIds || [];
        const newParents = checked
          ? [...currentParents, parentId]
          : currentParents.filter((id) => id !== parentId);
        return {
          ...p,
          questionnaireAnswers: {
            ...p.questionnaireAnswers!,
            parentIds: newParents,
          },
        };
      }
      return p;
    }));
    setValidationError(null);
  };

  const validateSetup = (): boolean => {
    // Check if at least one person exists
    if (people.length === 0) {
      setValidationError('Please add at least one person');
      return false;
    }

    // Validate all people have names
    for (const person of people) {
      if (!person.name.trim()) {
        setValidationError('All people must have a name');
        return false;
      }
    }

    // Check for duplicate names
    const names = people.map((p) => p.name.toLowerCase());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      setValidationError('All names must be unique');
      return false;
    }

    // Check against existing characters in project
    const projectCharacterNames = new Set(
      (selectedProject?.characters || []).map((c) => c.name.toLowerCase())
    );
    for (const name of names) {
      if (projectCharacterNames.has(name)) {
        const duplicateName = people.find((p) => p.name.toLowerCase() === name)?.name;
        setValidationError(`A character named "${duplicateName}" already exists in your project`);
        return false;
      }
    }

    // Validate main character selection
    if (!mainCharacterId) {
      setValidationError('Please select a main character');
      return false;
    }

    const mainCharacter = people.find((p) => p.id === mainCharacterId);
    if (!mainCharacter) {
      setValidationError('Main character not found');
      return false;
    }

    // Main character must be son or daughter
    if (mainCharacter.familyRole !== 'son' && mainCharacter.familyRole !== 'daughter') {
      setValidationError('Main character must be a son or daughter');
      return false;
    }

    // Main character must have at least one parent selected
    const parentIds = mainCharacter.questionnaireAnswers?.parentIds || [];
    if (parentIds.length === 0) {
      setValidationError('Main character must have at least one parent selected');
      return false;
    }

    // Validate that selected parents exist and are actually parents
    const parents = people.filter((p) => parentIds.includes(p.id));
    if (parents.length === 0) {
      setValidationError('Selected parents not found');
      return false;
    }

    for (const parent of parents) {
      if (parent.familyRole !== 'mother' && parent.familyRole !== 'father') {
        setValidationError(`${parent.name} is not a valid parent (must be mother or father)`);
        return false;
      }
    }

    setValidationError(null);
    return true;
  };

  const handleStartDetails = () => {
    if (!validateSetup()) {
      return;
    }
    setStep('details');
    setCurrentPersonIndex(0);
  };

  const handleAnswerChange = (questionId: string, value: string | string[], customInput?: string) => {
    const currentPerson = people[currentPersonIndex];
    if (!currentPerson) return;

    setPeople(people.map((p) => {
      if (p.id === currentPerson.id) {
        return {
          ...p,
          questionnaireAnswers: {
            ...p.questionnaireAnswers!,
            answers: {
              ...p.questionnaireAnswers!.answers,
              [questionId]: {
                value,
                customInput,
              },
            },
          },
        };
      }
      return p;
    }));
  };

  const handleBackToPreviousPerson = () => {
    if (currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1);
    } else {
      setStep('setup');
    }
  };

  const handleNextPerson = () => {
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
    }
  };

  const handleFinish = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected');
      return;
    }

    try {
      // Generate character text from questionnaire answers
      const charactersToCreate = people.map((person) => {
        const generated = generateCharacterText(person, person.questionnaireAnswers!, people);
        return {
          name: person.name,
          background: generated.background,
          motivations: generated.motivations,
          relationships: generated.relationships,
          flaws: generated.flaws,
          voice: generated.voice,
          storyRole: generated.storyRole,
        };
      });

      await createMultiple.mutateAsync({
        projectId: selectedProjectId,
        characters: charactersToCreate,
      });

      toast.success(`Successfully created ${people.length} characters`);
      handleClose();
    } catch (error) {
      toast.error('Failed to create characters');
      console.error(error);
    }
  };

  const currentPerson = people[currentPersonIndex];
  const potentialParents = people.filter(
    (p) => (p.familyRole === 'mother' || p.familyRole === 'father') && p.id !== mainCharacterId
  );
  const isLastPerson = currentPersonIndex === people.length - 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'setup' ? (
          <>
            <DialogHeader>
              <DialogTitle>Family Questionnaire Setup</DialogTitle>
              <DialogDescription>
                Add family members and designate the main character
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {people.map((person, index) => (
                  <div key={person.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Person {index + 1}</h4>
                      {people.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePerson(person.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${person.id}`}>Name *</Label>
                        <Input
                          id={`name-${person.id}`}
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`role-${person.id}`}>Family Role *</Label>
                        <Select
                          value={person.familyRole}
                          onValueChange={(value) => updatePerson(person.id, 'familyRole', value)}
                        >
                          <SelectTrigger id={`role-${person.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FAMILY_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`gender-${person.id}`}>Gender *</Label>
                        <Select
                          value={person.gender}
                          onValueChange={(value) => updatePerson(person.id, 'gender', value)}
                        >
                          <SelectTrigger id={`gender-${person.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}

                <Button onClick={addPerson} variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Add Person
                </Button>
              </div>

              {people.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label>Main Character *</Label>
                    <p className="text-sm text-muted-foreground">
                      Select the main character (must be a son or daughter)
                    </p>
                    <RadioGroup value={mainCharacterId || ''} onValueChange={handleMainCharacterChange}>
                      {people
                        .filter((p) => p.familyRole === 'son' || p.familyRole === 'daughter')
                        .map((person) => (
                          <div key={person.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={person.id} id={`main-${person.id}`} />
                            <Label htmlFor={`main-${person.id}`} className="cursor-pointer">
                              {person.name || 'Unnamed'} ({person.familyRole})
                            </Label>
                          </div>
                        ))}
                    </RadioGroup>
                  </div>

                  {mainCharacterId && potentialParents.length > 0 && (
                    <div className="space-y-2">
                      <Label>Select Parent(s) for Main Character *</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose at least one parent for the main character
                      </p>
                      <div className="space-y-2">
                        {potentialParents.map((parent) => {
                          const mainChar = people.find((p) => p.id === mainCharacterId);
                          const isSelected = mainChar?.questionnaireAnswers?.parentIds?.includes(parent.id) || false;
                          return (
                            <div key={parent.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`parent-${parent.id}`}
                                checked={isSelected}
                                onChange={(e) => handleParentSelectionChange(parent.id, e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor={`parent-${parent.id}`} className="cursor-pointer">
                                {parent.name} ({parent.familyRole})
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleStartDetails} className="gap-2">
                  <Users className="w-4 h-4" />
                  Start Questionnaire
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {currentPerson?.name || 'Person'} - Question Flow
              </DialogTitle>
              <DialogDescription>
                Person {currentPersonIndex + 1} of {people.length}
              </DialogDescription>
            </DialogHeader>

            {currentPerson && (
              <FamilyQuestionnaireQuestionFlow
                personName={currentPerson.name}
                answers={currentPerson.questionnaireAnswers?.answers || {}}
                onAnswerChange={handleAnswerChange}
                onBack={handleBackToPreviousPerson}
                onNext={handleNextPerson}
                onFinish={handleFinish}
                isLastPerson={isLastPerson}
                isCreating={createMultiple.isPending}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
