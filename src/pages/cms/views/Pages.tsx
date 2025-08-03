/**
 * Pages management view with CRUD operations
 */
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { formatDate } from '../../../lib/utils';

export default function PagesView() {
  const [pages] = useState([
    {
      id: '1',
      title: 'Home',
      status: 'published',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-20'),
      author: 'John Doe',
    },
    {
      id: '2',
      title: 'About Us',
      status: 'draft',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-19'),
      author: 'Jane Smith',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(page.status)} text-white`}>
                      {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{page.author}</TableCell>
                  <TableCell>{formatDate(page.createdAt)}</TableCell>
                  <TableCell>{formatDate(page.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
