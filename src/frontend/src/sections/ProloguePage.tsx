import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '../state/useProjects';
import PrologueEditor from '../components/prologue/PrologueEditor';
import PrologueOutlineView from '../components/prologue/PrologueOutlineView';

export default function ProloguePage() {
  const { selectedProject } = useProjects();
  const [activeTab, setActiveTab] = useState('editor');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prologue</h2>
        <p className="text-muted-foreground mt-1">
          Craft a compelling opening that hooks readers and sets the stage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prologue Development</CardTitle>
          <CardDescription>
            Use guided prompts to plan your prologue, then draft your opening
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="outline">Outline View</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-6">
              <PrologueEditor prologue={selectedProject?.prologue} />
            </TabsContent>

            <TabsContent value="outline" className="mt-6">
              <PrologueOutlineView prologue={selectedProject?.prologue} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
