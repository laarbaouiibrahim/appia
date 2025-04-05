import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Server } from '../../../../shared/schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

const ReinstallServer = () => {
  const { toast } = useToast();
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [installType, setInstallType] = useState<string>('Clean Install');
  const [serverVersion, setServerVersion] = useState<string>('Latest');
  
  const { data: servers, isLoading, isError } = useQuery<Server[]>({
    queryKey: ['/api/servers'],
  });

  const reinstallMutation = useMutation({
    mutationFn: async () => {
      // In a real app, we would pass the install type and version
      const res = await apiRequest('PATCH', `/api/servers/${selectedServerId}`, {
        status: 'reinstalling',
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Server is being reinstalled",
        description: "The server reinstallation process has started.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to reinstall server",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleReinstallServer = () => {
    if (!selectedServerId) {
      toast({
        title: "No server selected",
        description: "Please select a server to reinstall.",
        variant: "destructive",
      });
      return;
    }
    
    reinstallMutation.mutate();
  };

  const getServerDisplayName = (server: Server) => {
    return `${server.name} (${server.ip})`;
  };

  return (
    <div data-tab-content="reinstall-server">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Reinstall Existing Server</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="select-server" className="block text-sm font-medium text-gray-700">Select Server to Reinstall</label>
            <Select 
              onValueChange={setSelectedServerId} 
              value={selectedServerId}
            >
              <SelectTrigger id="select-server" className="mt-1">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading servers...</SelectItem>
                ) : isError ? (
                  <SelectItem value="error" disabled>Error loading servers</SelectItem>
                ) : servers && servers.length > 0 ? (
                  servers.map(server => (
                    <SelectItem key={server.id} value={String(server.id)}>
                      {getServerDisplayName(server)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No servers available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Alert variant="warning" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <AlertTitle className="text-yellow-800">Warning</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Reinstalling a server will reset its configuration. This action cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label htmlFor="reinstall-type" className="block text-sm font-medium text-gray-700">Installation Type</label>
              <Select 
                onValueChange={setInstallType} 
                value={installType}
              >
                <SelectTrigger id="reinstall-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clean Install">Clean Install</SelectItem>
                  <SelectItem value="Keep Configuration">Keep Configuration</SelectItem>
                  <SelectItem value="Keep Data">Keep Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="reinstall-version" className="block text-sm font-medium text-gray-700">Server Version</label>
              <Select 
                onValueChange={setServerVersion} 
                value={serverVersion}
              >
                <SelectTrigger id="reinstall-version" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="5.0">5.0</SelectItem>
                  <SelectItem value="4.5">4.5</SelectItem>
                  <SelectItem value="4.0">4.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={handleReinstallServer} 
              className="inline-flex items-center"
              disabled={reinstallMutation.isPending || !selectedServerId}
            >
              <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
              {reinstallMutation.isPending ? "Reinstalling..." : "Reinstall Server"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReinstallServer;
