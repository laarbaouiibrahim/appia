import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Box } from 'lucide-react';

const MultiServer = () => {
  const { toast } = useToast();
  const [installType, setInstallType] = useState<string>('PowerMTA');
  const [installMode, setInstallMode] = useState<string>('Parallel');
  const [servers, setServers] = useState([
    { id: 1, name: 'Server 1', ip: '192.168.1.20' },
    { id: 2, name: 'Server 2', ip: '192.168.1.21' }
  ]);
  const [nextServerId, setNextServerId] = useState(3);

  const installMutation = useMutation({
    mutationFn: async () => {
      // In a real app, we'd make calls to install on multiple servers
      const res = await apiRequest('POST', '/api/servers', {
        name: 'Multi-server installation',
        ip: 'various',
        username: 'admin',
        password: 'password',
        serverType: installType
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Installation started",
        description: `Installing ${installType} on all servers in ${installMode.toLowerCase()} mode.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
    },
    onError: (error) => {
      toast({
        title: "Installation failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const addServer = () => {
    setServers([...servers, { id: nextServerId, name: `Server ${nextServerId}`, ip: '192.168.1.x' }]);
    setNextServerId(nextServerId + 1);
  };

  const removeServer = (id: number) => {
    setServers(servers.filter(server => server.id !== id));
  };

  const handleInstallOnAllServers = () => {
    if (servers.length === 0) {
      toast({
        title: "No servers added",
        description: "Please add at least one server to proceed with installation.",
        variant: "destructive",
      });
      return;
    }
    
    installMutation.mutate();
  };

  return (
    <div data-tab-content="multi-server">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Multi-Server Installation</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-900">Server List</h3>
            <Button 
              onClick={addServer}
              variant="default" 
              size="sm"
              className="inline-flex items-center px-3 py-1.5 text-xs"
            >
              <Plus className="-ml-0.5 mr-1 h-4 w-4" />
              Add Server
            </Button>
          </div>

          {servers.map(server => (
            <div key={server.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{server.name}</h4>
                  <p className="text-sm text-gray-500">{server.ip}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeServer(server.id)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="multi-install-type" className="block text-sm font-medium text-gray-700">Installation Type</label>
              <Select
                onValueChange={setInstallType}
                value={installType}
              >
                <SelectTrigger id="multi-install-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PowerMTA">PowerMTA</SelectItem>
                  <SelectItem value="Postal">Postal</SelectItem>
                  <SelectItem value="Custom Configuration">Custom Configuration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="multi-install-mode" className="block text-sm font-medium text-gray-700">Installation Mode</label>
              <Select
                onValueChange={setInstallMode}
                value={installMode}
              >
                <SelectTrigger id="multi-install-mode" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parallel">Parallel</SelectItem>
                  <SelectItem value="Sequential">Sequential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleInstallOnAllServers}
              className="inline-flex items-center"
              disabled={installMutation.isPending || servers.length === 0}
            >
              <Box className="-ml-1 mr-2 h-5 w-5" />
              {installMutation.isPending ? "Installing..." : "Install on All Servers"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiServer;
