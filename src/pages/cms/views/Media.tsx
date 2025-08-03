/**
 * Media library management with upload, organize, and browse functionality
 */
import React, { useState, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  File,
  Search,
  Filter,
  Grid3X3,
  List,
  Trash2,
  Download,
  Copy,
  Eye,
  Plus,
  FolderPlus,
  Folder
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { useCMSStore } from '../../../store/cmsStore';
import { formatFileSize, formatDate } from '../../../lib/utils';
import { MediaItem } from '../../../types/cms';

export default function MediaView() {
  const { mediaItems, uploadMedia, deleteMedia, fetchMedia } = useCMSStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  /**
   * Filter media items
   */
  const filteredItems = mediaItems.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle file upload
   */
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadMedia(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    setIsUploadDialogOpen(false);
  }, [uploadMedia]);

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  /**
   * Get file type icon
   */
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-green-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  /**
   * Toggle item selection
   */
  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  /**
   * Delete selected items
   */
  const deleteSelectedItems = async () => {
    for (const itemId of selectedItems) {
      await deleteMedia(itemId);
    }
    setSelectedItems([]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Media Library</h1>
            <p className="text-muted-foreground">
              Manage your images, videos, and documents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Media Files</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF, MP4, PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selection actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy URLs
            </Button>
            <Button size="sm" variant="destructive" onClick={deleteSelectedItems}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No media files</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first media file to get started
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            {getFileIcon(item.type)}
                            <span className="text-xs mt-2 font-medium">
                              {item.filename.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium truncate">
                          {item.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(item.size)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer hover:shadow-sm ${
                      selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.originalName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            getFileIcon(item.type)
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.originalName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(item.size)} • {formatDate(item.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {item.type}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
