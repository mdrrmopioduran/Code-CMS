/**
 * Visual page builder with drag-and-drop components
 */
import React, { useState } from 'react';
import {
  Plus,
  Settings,
  Eye,
  Save,
  Undo,
  Redo,
  Type,
  Image,
  Video,
  MousePointer,
  Layout,
  Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import { Badge } from '../../../components/ui/badge';
import { useCMSStore } from '../../../store/cmsStore';
import { BlockType, BlockDefinition } from '../../../types/cms';

export default function PageBuilder() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('New Page');
  const [pageBlocks, setPageBlocks] = useState<any[]>([]);

  /**
   * Available block definitions
   */
  const blockDefinitions: BlockDefinition[] = [
    {
      type: 'heading',
      name: 'Heading',
      icon: 'Type',
      category: 'content',
      defaultContent: { text: 'Your Heading Here', level: 'h2' },
      editableFields: [
        { key: 'text', label: 'Text', type: 'text', required: true },
        { key: 'level', label: 'Level', type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }
      ]
    },
    {
      type: 'text',
      name: 'Text Block',
      icon: 'Type',
      category: 'content',
      defaultContent: { text: 'Add your text content here.' },
      editableFields: [
        { key: 'text', label: 'Content', type: 'textarea', required: true }
      ]
    },
    {
      type: 'image',
      name: 'Image',
      icon: 'Image',
      category: 'media',
      defaultContent: { src: '', alt: 'Image description' },
      editableFields: [
        { key: 'src', label: 'Image URL', type: 'image', required: true },
        { key: 'alt', label: 'Alt Text', type: 'text', required: true }
      ]
    },
  ];

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Blocks */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Page Builder</h2>
          <p className="text-sm text-muted-foreground">Drag blocks to build your page</p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
              />
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Content Blocks</h3>
              <div className="grid grid-cols-2 gap-2">
                {blockDefinitions.map(block => (
                  <Card key={block.type} className="cursor-pointer hover:shadow-md">
                    <CardContent className="p-3 text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-lg flex items-center justify-center">
                        {block.icon === 'Type' && <Type className="h-4 w-4" />}
                        {block.icon === 'Image' && <Image className="h-4 w-4" />}
                      </div>
                      <p className="text-xs font-medium">{block.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white min-h-[600px] shadow-lg">
              {pageBlocks.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Start Building</h3>
                    <p className="text-muted-foreground">
                      Add blocks from the sidebar to start building your page
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* Render page blocks here */}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 border-l bg-background">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Block Properties</h2>
        </div>
        
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4">
            {selectedBlock ? (
              <div>
                <Badge variant="secondary">Selected Block</Badge>
                {/* Block properties form */}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Settings className="h-8 w-8 mx-auto mb-2" />
                <p>Select a block to edit its properties</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
