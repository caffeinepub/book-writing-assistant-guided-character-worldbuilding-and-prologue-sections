import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProjects } from '../../state/useProjects';
import { useCreateMultipleCharacters } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Plus, Trash2, Users } from 'lucide-react';
import { FAMILY_ROLES, GENDER_OPTIONS, type PersonDraft, type FamilyRole, type Gender } from './multiCharacterQuestionnaireTypes';

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

  const resetWizard = () => {
    setStep('setup');
    setPeople([]);
    setCurrentPersonIndex(0);
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
    };
    setPeople([...people, newPerson]);
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) {
      toast.error('You must have at least one person');
      return;
    }
    setPeople(people.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: keyof PersonDraft, value: string) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleStartDetails = () => {
    if (people.length === 0) {
      toast.error('Please add at least one person');
      return;
    }

    // Validate all people have names and roles
    for (const person of people) {
      if (!person.name.trim()) {
        toast.error('All people must have a name');
        return;
      }
    }

    // Check for duplicate names
    const names = people.map((p) => p.name.toLowerCase());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      toast.error('All names must be unique');
      return;
    }

    // Check against existing characters
    const projectCharacterNames = new Set(
      (selectedProject?.characters || []).map((c) => c.name.toLowerCase())
    );
    for (const name of names) {
      if (projectCharacterNames.has(name)) {
        const person = people.find((p) => p.name.toLowerCase() === name);
        toast.error(`A character named "${person?.name}" already exists in your project`);
        return;
      }
    }

    setStep('details');
    setCurrentPersonIndex(0);
  };

  const handleNext = () => {
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1);
    } else {
      setStep('setup');
    }
  };

  const updateCurrentPerson = (field: keyof PersonDraft, value: string) => {
    const currentPerson = people[currentPersonIndex];
    if (currentPerson) {
      updatePerson(currentPerson.id, field, value);
    }
  };

  const handleFinish = async () => {
    if (!selectedProjectId) {
      toast.error('No project selected. Please select a project first.');
      return;
    }

    try {
      const characters = people.map((person) => ({
        name: person.name,
        background: person.background,
        motivations: person.motivations,
        relationships: person.relationships,
        flaws: person.flaws,
        voice: person.voice,
        storyRole: `${person.familyRole} - ${person.gender}${person.storyRole ? ` - ${person.storyRole}` : ''}`,
      }));

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {step === 'setup' ? (
          <>
            <DialogHeader>
              <DialogTitle>Multi-Character Family Questionnaire</DialogTitle>
              <DialogDescription>
                Add all your characters at once and organize them by family roles
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
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

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleStartDetails} disabled={people.length === 0}>
                  Continue to Details
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
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <Accordion type="multiple" className="w-full" defaultValue={['identity']}>
                <AccordionItem value="identity">
                  <AccordionTrigger>Identity & Background</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="person-background">
                        Who is this character? What's their history, occupation, and defining traits?
                      </Label>
                      <Textarea
                        id="person-background"
                        placeholder="Describe their background, identity, age, occupation, and key personality traits..."
                        value={currentPerson?.background || ''}
                        onChange={(e) => updateCurrentPerson('background', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="motivations">
                  <AccordionTrigger>Motivations & Goals</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="person-motivations">
                        What does this character want? What drives them?
                      </Label>
                      <Textarea
                        id="person-motivations"
                        placeholder="Describe their desires, ambitions, fears, and what motivates their actions..."
                        value={currentPerson?.motivations || ''}
                        onChange={(e) => updateCurrentPerson('motivations', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="relationships">
                  <AccordionTrigger>Relationships</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="person-relationships">
                        Who are the important people in their life? How do they relate to others?
                      </Label>
                      <Textarea
                        id="person-relationships"
                        placeholder="Describe their family, friends, enemies, romantic interests, and key relationships..."
                        value={currentPerson?.relationships || ''}
                        onChange={(e) => updateCurrentPerson('relationships', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="flaws">
                  <AccordionTrigger>Conflicts & Flaws</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="person-flaws">
                        What are their weaknesses, internal conflicts, and obstacles?
                      </Label>
                      <Textarea
                        id="person-flaws"
                        placeholder="Describe their flaws, fears, internal struggles, and external conflicts..."
                        value={currentPerson?.flaws || ''}
                        onChange={(e) => updateCurrentPerson('flaws', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="voice">
                  <AccordionTrigger>Voice & Dialogue</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="person-voice">
                        How do they speak? What's their communication style?
                      </Label>
                      <Textarea
                        id="person-voice"
                        placeholder="Describe their speech patterns, vocabulary, tone, and how they express themselves..."
                        value={currentPerson?.voice || ''}
                        onChange={(e) => updateCurrentPerson('voice', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="arc">
                  <AccordionTrigger>Story Role & Arc</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="person-storyRole">
                        What role do they play in the story? How will they change?
                      </Label>
                      <Textarea
                        id="person-storyRole"
                        placeholder="Describe their function in the plot, their character arc, and how they'll develop..."
                        value={currentPerson?.storyRole || ''}
                        onChange={(e) => updateCurrentPerson('storyRole', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  {isLastPerson ? (
                    <Button onClick={handleFinish} disabled={createMultiple.isPending}>
                      {createMultiple.isPending ? 'Creating...' : 'Create All Characters'}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
