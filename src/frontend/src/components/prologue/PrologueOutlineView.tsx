import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PrologueView } from '../../backend';

interface PrologueOutlineViewProps {
  prologue?: PrologueView;
}

export default function PrologueOutlineView({ prologue }: PrologueOutlineViewProps) {
  if (!prologue) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No prologue content yet. Switch to the Editor tab to start writing.</p>
      </div>
    );
  }

  const sections = [
    { title: 'Hook', content: prologue.hook },
    { title: 'POV & Voice', content: prologue.povVoice },
    { title: 'Stakes', content: prologue.stakes },
    { title: 'Key Information & Reveals', content: prologue.keyReveals },
    { title: 'Connection to Chapter One', content: prologue.connectionToChapterOne },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          section.content && (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </CardContent>
            </Card>
          )
        ))}
      </div>

      {prologue.draft && (
        <>
          <Separator className="my-8" />
          <Card>
            <CardHeader>
              <CardTitle>Draft</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap font-serif leading-relaxed">{prologue.draft}</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
