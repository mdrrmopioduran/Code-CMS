/**
 * Theme management and customization
 */
import React from 'react';
import { Palette, Download, Upload, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export default function ThemesView() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Themes</h1>
        <p className="text-muted-foreground">Customize your website appearance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Default Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Clean and modern default theme</p>
            <div className="flex gap-2">
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">Active</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
