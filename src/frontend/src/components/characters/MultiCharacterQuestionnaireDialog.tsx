import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useProjects } from '../../state/useProjects';
import { useCreateMultipleCharacters } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Plus, Trash2, Users, AlertCircle } from 'lucide-react';
import { FAMILY_ROLES, GENDER_OPTIONS, type PersonDraft, type FamilyRole, type Gender } from './multiCharacterQuestionnaireTypes';
import type { FamilyQuestionnairePersonAnswers } from './familyQuestionnaireTypes';
import FamilyQuestionnaireQuestionFlow from './FamilyQuestionnaireQuestionFlow';
import { generateCharacterText } from './familyQuestionnaireTextGenerator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MultiCharacterQuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MultiCharacterQuestionnaireDialog({ open, onOpenChange }: MultiCharacterQuestionnaireDialogProps) {
  const { selectedProjectId, selectedProject } = useProjects();
  const createMultiple = useCreateMultipleCharacters();

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

    // Check against existing characters
    const projectCharacterNames = new Set(
      (selectedProject?.characters || []).map((c) => c.name.toLowerCase())
    );
    for (const name of names) {
      if (projectCharacterNames.has(name)) {
        const person = people.find((p) => p.name.toLowerCase() === name);
        setValidationError(`A character named "${person?.name}" already exists in your project`);
        return false;
      }
    }

    // Check if main character is selected
    if (!mainCharacterId) {
      setValidationError('Please select exactly one person as the Main Character');
      return false;
    }

    // Check if main character has Son or Daughter role
    const mainCharacter = people.find((p) => p.id === mainCharacterId);
    if (mainCharacter && mainCharacter.familyRole !== 'son' && mainCharacter.familyRole !== 'daughter') {
      setValidationError('The Main Character must have the family role of Son or Daughter');
      return false;
    }

    // Check if main character has at least one parent selected
    const mainCharacterParents = mainCharacter?.questionnaireAnswers?.parentIds || [];
    if (mainCharacterParents.length === 0) {
      setValidationError('Please select at least one parent for the Main Character');
      return false;
    }

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

  const handleBackFromQuestions = () => {
    setStep('setup');
  };

  const handleNextPerson = () => {
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
    }
  };

  const handleFinish = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected. Please select a project first.');
      return;
    }

    try {
      const characters = people.map((person) => {
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
        characters,
      });

      toast.success(`Successfully created ${people.length} character${people.length > 1 ? 's' : ''}`);
      handleClose();
    } catch (error) {
      toast.error('Failed to create characters');
      console.error(error);
    }
  };

  const currentPerson = people[currentPersonIndex];
  const isLastPerson = currentPersonIndex === people.length - 1;
  const mainCharacter = people.find((p) => p.id === mainCharacterId);
  const potentialParents = people.filter((p) => p.id !== mainCharacterId);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'setup' ? (
          <>
            <DialogHeader>
              <DialogTitle>Multi-Character Family Questionnaire</DialogTitle>
              <DialogDescription>
                Add all your characters and designate the main character with their parent(s)
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
                {people.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No characters added yet. Click "Add Person" to start.</p>
                  </div>
                ) : (
                  people.map((person, index) => (
                    <div key={person.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Person {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePerson(person.id)}
                          disabled={people.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${person.id}`}>Name *</Label>
                          <Input
                            id={`name-${person.id}`}
                            placeholder="e.g., Sarah, John"
                            value={person.name}
                            onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`role-${person.id}`}>Family Role *</Label>
                          <Select
                            value={person.familyRole}
                            onValueChange={(value) => updatePerson(person.id, 'familyRole', value as FamilyRole)}
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
                            onValueChange={(value) => updatePerson(person.id, 'gender', value as Gender)}
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
                  ))
                )}
              </div>

              <Button onClick={addPerson} variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Person
              </Button>

              {people.length > 0 && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Main Character *</Label>
                    <p className="text-sm text-muted-foreground">
                      Select exactly one person as the main character (must be Son or Daughter)
                    </p>
                    <RadioGroup value={mainCharacterId || ''} onValueChange={handleMainCharacterChange}>
                      <div className="space-y-2">
                        {people.map((person) => (
                          <div key={person.id} className="flex items-center space-x-3">
                            <RadioGroupItem value={person.id} id={`main-${person.id}`} />
                            <Label htmlFor={`main-${person.id}`} className="cursor-pointer font-normal">
                              {person.name || `Person ${people.indexOf(person) + 1}`} ({FAMILY_ROLES.find((r) => r.value === person.familyRole)?.label})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {mainCharacterId && mainCharacter && potentialParents.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-base font-semibold">
                        Parent(s) of {mainCharacter.name} *
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Select at least one parent for the main character
                      </p>
                      <div className="space-y-2">
                        {potentialParents.map((person) => (
                          <div key={person.id} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`parent-${person.id}`}
                              checked={mainCharacter.questionnaireAnswers?.parentIds?.includes(person.id) || false}
                              onChange={(e) => handleParentSelectionChange(person.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`parent-${person.id}`} className="cursor-pointer font-normal">
                              {person.name || `Person ${people.indexOf(person) + 1}`} ({FAMILY_ROLES.find((r) => r.value === person.familyRole)?.label})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleStartDetails} disabled={people.length === 0}>
                  Continue to Questions
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {currentPerson?.name || `Person ${currentPersonIndex + 1}`} ({currentPersonIndex + 1} of {people.length})
              </DialogTitle>
              <DialogDescription>
                {currentPerson?.familyRole && currentPerson?.gender && (
                  <span className="capitalize">
                    {FAMILY_ROLES.find((r) => r.value === currentPerson.familyRole)?.label} • {GENDER_OPTIONS.find((g) => g.value === currentPerson.gender)?.label}
                    {currentPerson.questionnaireAnswers?.isMainCharacter && ' • Main Character'}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <FamilyQuestionnaireQuestionFlow
              personName={currentPerson?.name || `Person ${currentPersonIndex + 1}`}
              answers={currentPerson?.questionnaireAnswers?.answers || {}}
              onAnswerChange={handleAnswerChange}
              onBack={handleBackFromQuestions}
              onNext={handleNextPerson}
              onFinish={handleFinish}
              isLastPerson={isLastPerson}
              isCreating={createMultiple.isPending}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
