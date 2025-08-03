/**
 * Database connection and management interface
 */
import React, { useState } from 'react';
import {
  Database as DatabaseIcon,
  Settings,
  Play,
  CheckCircle,
  XCircle,
  RefreshCw,
  Table,
  Download,
  Upload,
  Trash2,
  Plus,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { Progress } from '../../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { DatabaseConfig } from '../../../types/cms';

interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  engine: string;
  collation: string;
}

interface Migration {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executedAt?: Date;
  description: string;
}

export default function DatabaseView() {
  const [config, setConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    port: 3306,
    database: 'cms_database',
    username: 'root',
    password: '',
    ssl: false,
  });

  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [tables, setTables] = useState<DatabaseTable[]>([
    { name: 'users', rows: 125, size: '2.4 MB', engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
    { name: 'pages', rows: 45, size: '1.2 MB', engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
    { name: 'posts', rows: 234, size: '5.8 MB', engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
    { name: 'media', rows: 89, size: '512 KB', engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
    { name: 'downloads', rows: 12, size: '256 KB', engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
  ]);

  const [migrations, setMigrations] = useState<Migration[]>([
    {
      id: '1',
      name: '2024_01_01_create_users_table',
      status: 'completed',
      executedAt: new Date('2024-01-01'),
      description: 'Create users table with authentication fields',
    },
    {
      id: '2',
      name: '2024_01_02_create_pages_table',
      status: 'completed',
      executedAt: new Date('2024-01-02'),
      description: 'Create pages table for content management',
    },
    {
      id: '3',
      name: '2024_01_15_add_downloads_table',
      status: 'pending',
      description: 'Add downloads table for file management',
    },
  ]);

  const [customQuery, setCustomQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);

  /**
   * Test database connection
   */
  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('connecting');

    // Simulate connection test
    setTimeout(() => {
      // Mock connection logic
      if (config.host && config.database && config.username) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
      setIsTestingConnection(false);
    }, 2000);
  };

  /**
   * Run migrations
   */
  const runMigrations = async () => {
    const pendingMigrations = migrations.filter(m => m.status === 'pending');

    for (const migration of pendingMigrations) {
      setMigrations(prev => prev.map(m =>
        m.id === migration.id ? { ...m, status: 'running' } : m
      ));

      // Simulate migration execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMigrations(prev => prev.map(m =>
        m.id === migration.id
          ? { ...m, status: 'completed', executedAt: new Date() }
          : m
      ));
    }
  };

  /**
   * Execute custom query
   */
  const executeQuery = async () => {
    setIsRunningQuery(true);

    // Simulate query execution
    setTimeout(() => {
      // Mock query result
      setQueryResult({
        columns: ['id', 'name', 'email', 'created_at'],
        rows: [
          ['1', 'John Doe', 'john@example.com', '2024-01-01 10:00:00'],
          ['2', 'Jane Smith', 'jane@example.com', '2024-01-02 11:30:00'],
        ],
        affectedRows: 2,
        executionTime: '0.05s',
      });
      setIsRunningQuery(false);
    }, 1500);
  };

  /**
   * Export database
   */
  const exportDatabase = () => {
    // Mock export functionality
    console.log('Exporting database...');
  };

  /**
   * Import database
   */
  const importDatabase = (file: File) => {
    // Mock import functionality
    console.log('Importing database from:', file.name);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Database Management</h1>
          <p className="text-muted-foreground">
            Configure database connection and manage your data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={connectionStatus === 'connected' ? 'default' : 'secondary'}
            className={connectionStatus === 'connected' ? 'bg-green-500' : ''}
          >
            {connectionStatus === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
            {connectionStatus === 'error' && <XCircle className="h-3 w-3 mr-1" />}
            {connectionStatus === 'connecting' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
            {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="connection" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="migrations">Migrations</TabsTrigger>
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Connection Tab */}
        <TabsContent value="connection">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      value={config.host}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={config.port}
                      onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="database">Database Name</Label>
                  <Input
                    id="database"
                    value={config.database}
                    onChange={(e) => setConfig({ ...config, database: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={config.username}
                    onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ssl"
                    checked={config.ssl}
                    onChange={(e) => setConfig({ ...config, ssl: e.target.checked })}
                  />
                  <Label htmlFor="ssl">Use SSL Connection</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    className="flex-1"
                  >
                    {isTestingConnection ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Config
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectionStatus === 'connected' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Successfully connected to database "{config.database}" on
                        {config.host}:{config.port}
                      </AlertDescription>
                    </Alert>
                  )}

                  {connectionStatus === 'error' && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to connect to database. Please check your configuration.
                      </AlertDescription>
                    </Alert>
                  )}

                  {connectionStatus === 'connecting' && (
                    <Alert>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <AlertDescription>
                        Testing connection to database...
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>MySQL Version:</span>
                      <span className="font-mono">8.0.35</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Character Set:</span>
                      <span className="font-mono">utf8mb4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collation:</span>
                      <span className="font-mono">utf8mb4_unicode_ci</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Connections:</span>
                      <span className="font-mono">151</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tables Tab */}
        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Database Tables
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UITable>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Engine</TableHead>
                    <TableHead>Collation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-mono">{table.name}</TableCell>
                      <TableCell>{table.rows.toLocaleString()}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell>{table.engine}</TableCell>
                      <TableCell className="font-mono text-sm">{table.collation}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
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
              </UITable>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Migrations Tab */}
        <TabsContent value="migrations">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Database Migrations</h3>
              <Button onClick={runMigrations}>
                <Play className="h-4 w-4 mr-2" />
                Run Pending Migrations
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Migration</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Executed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {migrations.map((migration) => (
                      <TableRow key={migration.id}>
                        <TableCell className="font-mono text-sm">{migration.name}</TableCell>
                        <TableCell>{migration.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              migration.status === 'completed' ? 'default' :
                              migration.status === 'running' ? 'secondary' :
                              migration.status === 'failed' ? 'destructive' : 'outline'
                            }
                          >
                            {migration.status === 'running' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                            {migration.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {migration.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                            {migration.status.charAt(0).toUpperCase() + migration.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {migration.executedAt ? migration.executedAt.toLocaleDateString() : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Query Tab */}
        <TabsContent value="query">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SQL Query Console</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="query">SQL Query</Label>
                  <Textarea
                    id="query"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    rows={6}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={executeQuery} disabled={isRunningQuery}>
                    {isRunningQuery ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Execute Query
                  </Button>
                  <Button variant="outline">
                    Clear
                  </Button>
                </div>

                {queryResult && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Query Result</span>
                      <Badge variant="secondary">
                        {queryResult.affectedRows} rows • {queryResult.executionTime}
                      </Badge>
                    </div>

                    <div className="border rounded-lg overflow-auto">
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            {queryResult.columns.map((col: string) => (
                              <TableHead key={col} className="font-mono">{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {queryResult.rows.map((row: string[], index: number) => (
                            <TableRow key={index}>
                              {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} className="font-mono text-sm">
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </UITable>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create a backup of your database by exporting all tables and data.
                </p>

                <div className="space-y-2">
                  <Label>Export Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Include data</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Include structure</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Compress output</span>
                    </label>
                  </div>
                </div>

                <Button onClick={exportDatabase} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Database
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Importing will overwrite existing data. Make sure to backup first.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="import-file">SQL File</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".sql,.zip"
                    onChange={(e) => e.target.files?.[0] && importDatabase(e.target.files[0])}
                  />
                </div>

                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Database
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
