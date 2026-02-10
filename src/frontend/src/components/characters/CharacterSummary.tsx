import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CharacterView } from '../../backend';

interface CharacterSummaryProps {
  character: CharacterView;
}

export default function CharacterSummary({ character }: CharacterSummaryProps) {
  const sections = [
    { title: 'Identity & Background', content: character.background },
    { title: 'Motivations & Goals', content: character.motivations },
    { title: 'Relationships', content: character.relationships },
    { title: 'Conflicts & Flaws', content: character.flaws },
    { title: 'Voice & Dialogue', content: character.voice },
    { title: 'Story Role & Arc', content: character.storyRole },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        section.content && (
          <div key={section.title}>
            {index > 0 && <Separator className="my-6" />}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </CardContent>
            </Card>
          </div>
        )
      ))}
    </div>
  );
}
