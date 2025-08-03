/**
 * Downloads management view for handling downloadable resources
 */
import React, { useState } from 'react';
import {
  Plus,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  FileText,
  File,
  Archive,
  Image as ImageIcon,
  Video,
  Music,
  Edit,
  Eye,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { formatFileSize, formatDate } from '../../../lib/utils';

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  filename: string;
  fileType: string;
  category: string;
  size: number;
  downloadCount: number;
  createdAt: Date;
  isPublic: boolean;
}

export default function DownloadsView() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: '1',
      title: 'User Manual PDF',
      description: 'Complete user guide for the CMS system with step-by-step instructions.',
      filename: 'user-manual.pdf',
      fileType: 'pdf',
      category: 'Documentation',
      size: 2048000,
      downloadCount: 45,
      createdAt: new Date('2024-01-15'),
      isPublic: true,
    },
    {
      id: '2',
      title: 'Brand Assets Package',
      description: 'Logo files, color palettes, and brand guidelines for marketing materials.',
      filename: 'brand-assets.zip',
      fileType: 'zip',
      category: 'Branding',
      size: 5120000,
      downloadCount: 23,
      createdAt: new Date('2024-01-10'),
      isPublic: true,
    },
    {
      id: '3',
      title: 'Annual Report 2024',
      description: 'Comprehensive annual report with financial data and company insights.',
      filename: 'annual-report-2024.pdf',
      fileType: 'pdf',
      category: 'Reports',
      size: 3072000,
      downloadCount: 78,
      createdAt: new Date('2024-01-20'),
      isPublic: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [newDownload, setNewDownload] = useState({
    title: '',
    description: '',
    category: '',
    file: null as File | null,
    isPublic: true,
  });

  /**
   * Get file type icon
   */
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="h-5 w-5 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="h-5 w-5 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  /**
   * Filter downloads
   */
  const filteredDownloads = downloads.filter(download => {
    const matchesSearch =
      download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      download.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || download.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Get unique categories
   */
  const categories = Array.from(new Set(downloads.map(d => d.category)));

  /**
   * Handle file upload
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewDownload(prev => ({ ...prev, file }));
    }
  };

  /**
   * Handle download creation
   */
  const handleCreateDownload = () => {
    if (!newDownload.title || !newDownload.file) return;

    const download: DownloadItem = {
      id: Date.now().toString(),
      title: newDownload.title,
      description: newDownload.description,
      filename: newDownload.file.name,
      fileType: newDownload.file.name.split('.').pop() || '',
      category: newDownload.category || 'General',
      size: newDownload.file.size,
      downloadCount: 0,
      createdAt: new Date(),
      isPublic: newDownload.isPublic,
    };

    setDownloads(prev => [...prev, download]);
    setNewDownload({ title: '', description: '', category: '', file: null, isPublic: true });
    setIsUploadDialogOpen(false);
  };

  /**
   * Handle download deletion
   */
  const handleDeleteDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  /**
   * Handle download edit
   */
  const handleEditDownload = (download: DownloadItem) => {
    setEditingItem(download);
  };

  /**
   * Save edited download
   */
  const handleSaveEdit = () => {
    if (!editingItem) return;

    setDownloads(prev => prev.map(d =>
      d.id === editingItem.id ? editingItem : d
    ));
    setEditingItem(null);
  };

  /**
   * Copy download URL
   */
  const copyDownloadUrl = (download: DownloadItem) => {
    const url = `${window.location.origin}/downloads/${download.id}`;
    navigator.clipboard.writeText(url);
    // Show success toast
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Download Resources</h1>
          <p className="text-muted-foreground">
            Manage downloadable files for your website visitors
          </p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Download
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Download</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newDownload.title}
                  onChange={(e) => setNewDownload(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter download title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDownload.description}
                  onChange={(e) => setNewDownload(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this download"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newDownload.category}
                  onChange={(e) => setNewDownload(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Documentation, Reports"
                />
              </div>

              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.mp4,.mp3"
                />
                {newDownload.file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {newDownload.file.name}
                    ({formatFileSize(newDownload.file.size)})
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newDownload.isPublic}
                  onChange={(e) => setNewDownload(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <Label htmlFor="isPublic">Make publicly accessible</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateDownload} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads.length}</div>
            <p className="text-xs text-muted-foreground">
              {downloads.filter(d => d.isPublic).length} public
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {downloads.reduce((sum, d) => sum + d.downloadCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(downloads.reduce((sum, d) => sum + d.size, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total file size</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search downloads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Downloads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Download Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDownloads.map((download) => (
                <TableRow key={download.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(download.fileType)}
                      <div>
                        <p className="font-medium">{download.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {download.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{download.category}</Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(download.size)}</TableCell>
                  <TableCell>{download.downloadCount}</TableCell>
                  <TableCell>
                    <Badge variant={download.isPublic ? 'default' : 'secondary'}>
                      {download.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(download.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyDownloadUrl(download)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDownload(download)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDownload(download.id)}
                      >
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

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Download</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPublic"
                  checked={editingItem.isPublic}
                  onChange={(e) => setEditingItem({ ...editingItem, isPublic: e.target.checked })}
                />
                <Label htmlFor="edit-isPublic">Make publicly accessible</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
