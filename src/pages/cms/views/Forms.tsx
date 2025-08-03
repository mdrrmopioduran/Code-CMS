/**
 * Advanced form builder with drag-and-drop field creation and submission handling
 */
import React, { useState, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Settings,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  List,
  Hash,
  FileText,
  Upload,
  ToggleLeft,
  Star,
  Move,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { formatDate, generateId } from '../../../lib/utils';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'tel';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  order: number;
}

interface Form {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  settings: {
    submitButtonText: string;
    successMessage: string;
    redirectUrl?: string;
    emailNotifications: boolean;
    notificationEmail?: string;
    storeSubmissions: boolean;
  };
  submissions: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ipAddress: string;
  userAgent: string;
}

export default function FormsView() {
  const [forms, setForms] = useState<Form[]>([
    {
      id: '1',
      name: 'Contact Form',
      description: 'Main contact form for the website',
      fields: [
        {
          id: '1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          order: 0,
        },
        {
          id: '2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'your.email@example.com',
          required: true,
          order: 1,
        },
        {
          id: '3',
          type: 'textarea',
          label: 'Message',
          placeholder: 'How can we help you?',
          required: true,
          order: 2,
        },
      ],
      settings: {
        submitButtonText: 'Send Message',
        successMessage: 'Thank you for your message! We\'ll get back to you soon.',
        emailNotifications: true,
        notificationEmail: 'contact@example.com',
        storeSubmissions: true,
      },
      submissions: 45,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isActive: true,
    },
  ]);

  const [submissions, setSubmissions] = useState<FormSubmission[]>([
    {
      id: '1',
      formId: '1',
      data: {
        'Full Name': 'John Doe',
        'Email Address': 'john@example.com',
        'Message': 'I\'m interested in your services.',
      },
      submittedAt: new Date('2024-01-20'),
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
    },
  ]);

  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedField, setDraggedField] = useState<FormField | null>(null);

  /**
   * Available field types for the form builder
   */
  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: Type },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'tel', label: 'Phone', icon: Phone },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'textarea', label: 'Textarea', icon: FileText },
    { type: 'select', label: 'Dropdown', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'radio', label: 'Radio Buttons', icon: ToggleLeft },
    { type: 'file', label: 'File Upload', icon: Upload },
    { type: 'date', label: 'Date Picker', icon: Calendar },
  ];

  /**
   * Create new form
   */
  const createForm = () => {
    const newForm: Form = {
      id: generateId(),
      name: 'New Form',
      description: '',
      fields: [],
      settings: {
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!',
        emailNotifications: false,
        storeSubmissions: true,
      },
      submissions: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    setForms(prev => [...prev, newForm]);
    setSelectedForm(newForm);
    setIsBuilderOpen(true);
  };

  /**
   * Add field to form
   */
  const addField = (fieldType: string) => {
    if (!selectedForm) return;

    const newField: FormField = {
      id: generateId(),
      type: fieldType as FormField['type'],
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      required: false,
      order: selectedForm.fields.length,
    };

    setSelectedForm(prev => prev ? {
      ...prev,
      fields: [...prev.fields, newField],
    } : null);
  };

  /**
   * Update field properties
   */
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!selectedForm) return;

    setSelectedForm(prev => prev ? {
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    } : null);
  };

  /**
   * Delete field
   */
  const deleteField = (fieldId: string) => {
    if (!selectedForm) return;

    setSelectedForm(prev => prev ? {
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    } : null);
  };

  /**
   * Save form
   */
  const saveForm = () => {
    if (!selectedForm) return;

    setForms(prev => prev.map(form =>
      form.id === selectedForm.id ? { ...selectedForm, updatedAt: new Date() } : form
    ));
    setIsBuilderOpen(false);
    setSelectedForm(null);
  };

  /**
   * Render form field in builder
   */
  const renderFieldPreview = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder,
      required: field.required,
      className: "w-full",
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return <Input {...commonProps} type={field.type} />;
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, idx) => (
                <SelectItem key={idx} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="checkbox" id={`${field.id}-${idx}`} />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="radio" name={field.id} id={`${field.id}-${idx}`} />
                <Label htmlFor={`${field.id}-${idx}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'file':
        return <Input type="file" />;
      case 'date':
        return <Input type="date" />;
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground">
            Create and manage custom forms for your website
          </p>
        </div>
        <Button onClick={createForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground">
              {forms.filter(f => f.isActive).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forms.reduce((sum, form) => sum + form.submissions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">Average across all forms</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        {/* Forms Tab */}
        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Forms</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search forms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{form.name}</p>
                          <p className="text-sm text-muted-foreground">{form.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{form.fields.length}</TableCell>
                      <TableCell>{form.submissions}</TableCell>
                      <TableCell>
                        <Badge variant={form.isActive ? 'default' : 'secondary'}>
                          {form.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(form.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedForm(form);
                              setIsBuilderOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
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
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        {forms.find(f => f.id === submission.formId)?.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {Object.entries(submission.data).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                      <TableCell className="font-mono text-sm">{submission.ipAddress}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Form Builder Dialog */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Form Builder - {selectedForm?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedForm && (
            <div className="flex h-full gap-6">
              {/* Left Sidebar - Field Types */}
              <div className="w-64 border-r pr-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="form-name">Form Name</Label>
                    <Input
                      id="form-name"
                      value={selectedForm.name}
                      onChange={(e) => setSelectedForm({ ...selectedForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      value={selectedForm.description}
                      onChange={(e) => setSelectedForm({ ...selectedForm, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Add Fields</h3>
                    <div className="space-y-2">
                      {fieldTypes.map((fieldType) => {
                        const Icon = fieldType.icon;
                        return (
                          <Button
                            key={fieldType.type}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addField(fieldType.type)}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {fieldType.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Form Preview */}
              <div className="flex-1">
                <div className="border rounded-lg p-6 bg-white">
                  <h2 className="text-xl font-bold mb-2">{selectedForm.name}</h2>
                  {selectedForm.description && (
                    <p className="text-muted-foreground mb-6">{selectedForm.description}</p>
                  )}
                  
                  <div className="space-y-6">
                    {selectedForm.fields
                      .sort((a, b) => a.order - b.order)
                      .map((field) => (
                        <div
                          key={field.id}
                          className="group relative border-2 border-dashed border-transparent hover:border-gray-300 p-4 rounded-lg"
                        >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteField(field.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {renderFieldPreview(field)}
                          </div>
                        </div>
                      ))}
                    
                    {selectedForm.fields.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4" />
                        <p>No fields added yet. Add fields from the sidebar to get started.</p>
                      </div>
                    )}
                    
                    <Button className="w-full">
                      {selectedForm.settings.submitButtonText}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Field Properties */}
              <div className="w-80 border-l pl-4">
                <ScrollArea className="h-full">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Form Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="submit-button-text">Submit Button Text</Label>
                          <Input
                            id="submit-button-text"
                            value={selectedForm.settings.submitButtonText}
                            onChange={(e) => setSelectedForm({
                              ...selectedForm,
                              settings: {
                                ...selectedForm.settings,
                                submitButtonText: e.target.value
                              }
                            })}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="success-message">Success Message</Label>
                          <Textarea
                            id="success-message"
                            value={selectedForm.settings.successMessage}
                            onChange={(e) => setSelectedForm({
                              ...selectedForm,
                              settings: {
                                ...selectedForm.settings,
                                successMessage: e.target.value
                              }
                            })}
                            rows={3}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Email Notifications</Label>
                          <Switch
                            checked={selectedForm.settings.emailNotifications}
                            onCheckedChange={(checked) => setSelectedForm({
                              ...selectedForm,
                              settings: {
                                ...selectedForm.settings,
                                emailNotifications: checked
                              }
                            })}
                          />
                        </div>

                        {selectedForm.settings.emailNotifications && (
                          <div>
                            <Label htmlFor="notification-email">Notification Email</Label>
                            <Input
                              id="notification-email"
                              type="email"
                              value={selectedForm.settings.notificationEmail || ''}
                              onChange={(e) => setSelectedForm({
                                ...selectedForm,
                                settings: {
                                  ...selectedForm.settings,
                                  notificationEmail: e.target.value
                                }
                              })}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Label>Store Submissions</Label>
                          <Switch
                            checked={selectedForm.settings.storeSubmissions}
                            onCheckedChange={(checked) => setSelectedForm({
                              ...selectedForm,
                              settings: {
                                ...selectedForm.settings,
                                storeSubmissions: checked
                              }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={saveForm} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save Form
                      </Button>
                      <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
