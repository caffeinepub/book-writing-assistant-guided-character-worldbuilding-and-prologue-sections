import { useState } from 'react';
import { Plus, User, Users, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProjects } from '../state/useProjects';
import CharacterQuestionnaire from '../components/characters/CharacterQuestionnaire';
import CharacterSummary from '../components/characters/CharacterSummary';
import CreateBandWizardDialog from '../components/characters/CreateBandWizardDialog';
import MultiCharacterQuestionnaireDialog from '../components/characters/MultiCharacterQuestionnaireDialog';
import type { CharacterView } from '../backend';

export default function CharactersPage() {
  const { selectedProject } = useProjects();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showBandWizard, setShowBandWizard] = useState(false);
  const [showMultiCharacterQuestionnaire, setShowMultiCharacterQuestionnaire] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterView | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<CharacterView | null>(null);

  const characters = selectedProject?.characters || [];

  const handleEditCharacter = (character: CharacterView) => {
    setSelectedCharacter(null);
    setEditingCharacter(character);
  };

  const handleEditComplete = () => {
    setEditingCharacter(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Characters</h2>
          <p className="text-muted-foreground mt-1">
            Create compelling characters through guided prompts
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowMultiCharacterQuestionnaire(true)} variant="outline" className="gap-2">
            <UsersRound className="w-4 h-4" />
            Family Questionnaire
          </Button>
          <Button onClick={() => setShowBandWizard(true)} variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            Create Band/Group
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Character
          </Button>
        </div>
      </div>

      {characters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No characters yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Create your first character to start building your story's cast
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowMultiCharacterQuestionnaire(true)} variant="outline" className="gap-2">
                <UsersRound className="w-4 h-4" />
                Family Questionnaire
              </Button>
              <Button onClick={() => setShowBandWizard(true)} variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Create Band/Group
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Character
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <Card
              key={character.name}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCharacter(character)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {character.name}
                </CardTitle>
                {character.storyRole && (
                  <CardDescription className="line-clamp-2">{character.storyRole}</CardDescription>
                )}
              </CardHeader>
              {character.background && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{character.background}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Character</DialogTitle>
            <DialogDescription>
              Answer the guided prompts to build a multi-dimensional character
            </DialogDescription>
          </DialogHeader>
          <CharacterQuestionnaire
            onComplete={() => setShowCreateDialog(false)}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <CreateBandWizardDialog
        open={showBandWizard}
        onOpenChange={setShowBandWizard}
      />

      <MultiCharacterQuestionnaireDialog
        open={showMultiCharacterQuestionnaire}
        onOpenChange={setShowMultiCharacterQuestionnaire}
      />

      <Dialog open={!!selectedCharacter} onOpenChange={() => setSelectedCharacter(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{selectedCharacter?.name}</DialogTitle>
                <DialogDescription>Character Profile</DialogDescription>
              </div>
              {selectedCharacter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditCharacter(selectedCharacter)}
                >
                  Edit
                </Button>
              )}
            </div>
          </DialogHeader>
          {selectedCharacter && <CharacterSummary character={selectedCharacter} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCharacter} onOpenChange={() => setEditingCharacter(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
            <DialogDescription>
              Update the character's details
            </DialogDescription>
          </DialogHeader>
          {editingCharacter && (
            <CharacterQuestionnaire
              mode="edit"
              initialData={editingCharacter}
              onComplete={handleEditComplete}
              onCancel={handleEditComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
