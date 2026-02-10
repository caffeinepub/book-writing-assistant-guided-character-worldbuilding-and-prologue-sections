import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProjects } from '../state/useProjects';
import WorldbuildingCategoryEditor from '../components/worldbuilding/WorldbuildingCategoryEditor';

const CATEGORIES = [
  {
    name: 'Setting',
    description: 'Where and when does your story take place?',
    prompts: ['Time period', 'Location', 'Climate and environment', 'Technology level'],
  },
  {
    name: 'History',
    description: 'What major events shaped this world?',
    prompts: ['Founding events', 'Wars and conflicts', 'Cultural shifts', 'Recent history'],
  },
  {
    name: 'Culture/Society',
    description: 'How do people live and interact?',
    prompts: ['Social structure', 'Values and beliefs', 'Customs and traditions', 'Daily life'],
  },
  {
    name: 'Geography',
    description: 'What does the physical world look like?',
    prompts: ['Major landmarks', 'Cities and settlements', 'Natural features', 'Borders and territories'],
  },
  {
    name: 'Politics/Power',
    description: 'Who holds power and how is it used?',
    prompts: ['Government structure', 'Key factions', 'Power dynamics', 'Laws and justice'],
  },
  {
    name: 'Rules/Systems',
    description: 'What are the fundamental rules of your world?',
    prompts: ['Magic system', 'Technology', 'Economy', 'Special abilities or constraints'],
  },
  {
    name: 'Themes/Tone',
    description: 'What is the overall feel and message?',
    prompts: ['Central themes', 'Mood and atmosphere', 'Moral questions', 'Genre conventions'],
  },
];

export default function WorldbuildingPage() {
  const { selectedProject } = useProjects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Worldbuilding</h2>
        <p className="text-muted-foreground mt-1">
          Craft the setting, rules, and atmosphere of your story's world
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>World Elements</CardTitle>
          <CardDescription>
            Expand each category to add details about your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {CATEGORIES.map((category, index) => {
              const categoryData = selectedProject?.worldbuilding[index];
              return (
                <AccordionItem key={category.name} value={category.name}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <WorldbuildingCategoryEditor
                      categoryName={category.name}
                      categoryIndex={index}
                      prompts={category.prompts}
                      initialDescription={categoryData?.description || ''}
                      initialNotes={categoryData?.freeformNotes || []}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
