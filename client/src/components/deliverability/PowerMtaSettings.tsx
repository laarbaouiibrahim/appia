import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server } from '../../../../shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, CloudDownload, Save, Edit, RefreshCw } from 'lucide-react';
import { samplePmtaConfig } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const PowerMtaSettings = () => {
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [configValue, setConfigValue] = useState<string>(samplePmtaConfig);
  const { toast } = useToast();
  
  const { data: servers, isLoading, isError } = useQuery<Server[]>({
    queryKey: ['/api/servers'],
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configValue);
    toast({
      title: "Copied to clipboard",
      description: "Configuration has been copied to clipboard.",
    });
  };

  const saveConfig = () => {
    // Here we would implement the actual saving logic to the server
    setIsEditing(false);
    toast({
      title: "Configuration Saved",
      description: "The configuration has been saved successfully.",
    });
  };

  return (
    <div data-tab-content="powermta-settings">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">PowerMTA Configuration Settings</h2>
          <div className="space-x-2">
            <Select 
              onValueChange={setSelectedServerId} 
              value={selectedServerId}
            >
              <SelectTrigger className="border border-gray-300 rounded-md shadow-sm p-2 text-sm">
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading servers...</SelectItem>
                ) : isError ? (
                  <SelectItem value="error" disabled>Error loading servers</SelectItem>
                ) : servers && servers.length > 0 ? (
                  servers.map(server => (
                    <SelectItem key={server.id} value={String(server.id)}>
                      {server.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No servers available</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="inline-flex items-center"
              onClick={() => {
                if (isEditing) {
                  saveConfig();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <>
                  <Save className="-ml-1 mr-1 h-5 w-5 text-gray-500" />
                  Save Config
                </>
              ) : (
                <>
                  <Edit className="-ml-1 mr-1 h-5 w-5 text-gray-500" />
                  Edit Config
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="inline-flex items-center"
              onClick={() => {
                const blob = new Blob([configValue], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pmta.conf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              <CloudDownload className="-ml-1 mr-1 h-5 w-5 text-gray-500" />
              Export Config
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="py-3 px-4 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">pmta.conf</span>
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="space-x-2">
              <button 
                type="button" 
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const blob = new Blob([configValue], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'pmta.conf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                type="button" 
                onClick={() => {
                  // Simulate refreshing the configuration
                  toast({
                    title: "Configuration Refreshed",
                    description: "The server configuration has been refreshed.",
                  });
                }}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isEditing ? (
              <Textarea 
                value={configValue}
                onChange={(e) => setConfigValue(e.target.value)}
                className="font-mono text-sm text-gray-800 rounded-none border-0 h-96"
              />
            ) : (
              <pre className="p-4 text-sm text-gray-700 overflow-x-auto font-mono bg-gray-50" style={{ maxHeight: '400px' }}>
                {configValue}
              </pre>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-200 p-3 flex justify-between">
            <span className="text-xs text-gray-500">Last modified: April 3, 2025 09:32 AM</span>
            {isEditing && (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={saveConfig}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Configuration Parameters</h3>
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SMTP Port
                  </label>
                  <Input 
                    type="number" 
                    defaultValue="25" 
                    className="mt-1 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Connections
                  </label>
                  <Input 
                    type="number" 
                    defaultValue="20" 
                    className="mt-1 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Log File Path
                  </label>
                  <Input 
                    type="text" 
                    defaultValue="/var/log/pmta/pmta.log" 
                    className="mt-1 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Domain Macros
                  </label>
                  <Textarea 
                    defaultValue="gmail.com, yahoo.com, hotmail.com, aol.com, outlook.com" 
                    className="mt-1 p-2 text-sm h-20"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Services</h3>
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">SMTP Service</span>
                  <div className="flex items-center">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></span>
                    <span className="text-sm text-green-600">Running</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">HTTP Management Interface</span>
                  <div className="flex items-center">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></span>
                    <span className="text-sm text-green-600">Running on port 8080</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Accounting Service</span>
                  <div className="flex items-center">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></span>
                    <span className="text-sm text-green-600">Running</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">REST API</span>
                  <div className="flex items-center">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></span>
                    <span className="text-sm text-green-600">Running on port 25025</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Services Restarted",
                        description: "All PowerMTA services have been restarted successfully.",
                      });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerMtaSettings;