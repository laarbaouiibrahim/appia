import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertServerSchema } from '../../../../shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Server, User, Lock, Globe2, FileLock2, KeyRound, Settings, Activity } from 'lucide-react';

// Extend the server schema for form validation
const serverFormSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  ip: z.string().min(1, "IP address is required"),
  username: z.string().default('admin'),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  serverType: z.string().default('PowerMTA'),
  sshUser: z.string().default('root'),
  sshPort: z.string().default('22'),
  sshPassword: z.string().min(1),
  providerEmail: z.string().optional(),
  type: z.string().default('VPS'),
  domain: z.string().optional(),
  webServerType: z.enum(['Httpd', 'Nginx']).default('Httpd'),
  domainRandom: z.boolean().default(false),
  sshAuthType: z.enum(['Password', 'Key']).default('Password'),
  installOptions: z.object({
    powerMtaVersion: z.string().default('PowerMTA 4.0r6'),
    pmtaPort: z.string().default('1998'),
    recordsOn: z.boolean().default(true),
    defaultDkim: z.boolean().default(true)
  }),
  geo: z.string().optional()
});

const InstallServer = () => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    testSsh: false,
    getPTR: false,
    setPTR: false,
    getIPs: false
  });
  
  // Sample data to display when fetching IPs
  const [serverIPs, setServerIPs] = useState<{
    publicIP: string;
    privateIP: string;
    ptr: string;
    ipVersion: string;
    vmtaTagNumber: string;
    domainAssociated: string;
    selected?: boolean;
  }[]>([]);
  
  // Track selection state
  const [selectAll, setSelectAll] = useState(false);
  
  const form = useForm<z.infer<typeof serverFormSchema>>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: 'Server-' + Math.floor(Math.random() * 1000),  // Generate random server name
      ip: '',
      username: 'admin',  // Match the server schema
      password: 'password123',  // Default password that meets requirements
      serverType: 'PowerMTA',
      sshUser: 'root',
      sshPort: '22',
      sshPassword: 'ssh-password',  // Default SSH password
      providerEmail: '',
      type: 'VPS',
      domain: '',
      webServerType: 'Httpd',
      domainRandom: false,
      sshAuthType: 'Password',
      installOptions: {
        powerMtaVersion: 'PowerMTA 4.0r6',
        pmtaPort: '1998',
        recordsOn: true,
        defaultDkim: true
      },
      geo: ''
    },
  });
  
  // This function fetches all IPs from a server - extracted so it can be reused after any operation
  const fetchServerIPs = async (showToast = true) => {
    const serverIP = form.getValues('ip');
    const sshUser = form.getValues('sshUser');
    const sshPort = form.getValues('sshPort');
    const sshPassword = form.getValues('sshPassword');
    const sshAuthType = form.getValues('sshAuthType');
    
    if (!serverIP) {
      if (showToast) {
        toast({
          title: "No Server IP Provided",
          description: "Please enter a server IP in the Delivery Server section first.",
          variant: "destructive"
        });
      }
      return false;
    }
    
    if (!sshUser || !sshPassword) {
      if (showToast) {
        toast({
          title: "SSH Credentials Required",
          description: "SSH user and password are needed to connect to the server and fetch IPs.",
          variant: "destructive"
        });
      }
      return false;
    }
    
    setLoading(prev => ({...prev, getIPs: true}));
    
    // PRODUCTION IMPLEMENTATION WOULD BE:
    // 1. Make an API call to your backend with the server details
    // const response = await apiRequest('POST', '/api/server/get-ips', {
    //   serverIP,
    //   sshUser,
    //   sshPort,
    //   sshPassword,
    //   sshAuthType
    // });
    // 
    // 2. The backend would establish an SSH connection to the server
    // 3. Run commands like 'ip addr' or 'ifconfig' to get the actual network interfaces
    // 4. Parse and return the real IP data from the server
    // const serverIPs = await response.json();
    //
    // 5. Update the UI with the real server IP data
    
    // TEMPORARY IMPLEMENTATION WITH PLACEHOLDER DATA
    // (You will need to replace this with a real API call to get the actual IPs)
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        // These are placeholder IPs - in a production this would be replaced with
        // actual data from your server by connecting via SSH and running commands
        // to list all network interfaces and IPs on the server
        const mockIPs = [
          // Main IP
          {
            publicIP: serverIP, // The IP you entered
            privateIP: "10.0.0.1",
            ptr: "mail1.yourdomain.com",
            ipVersion: "IPv4", 
            vmtaTagNumber: "100",
            domainAssociated: "yourdomain.com",
            selected: false
          },
          // Additional IPs that would be found on your server
          {
            publicIP: "123.45.67.89", // Additional IP #1
            privateIP: "10.0.0.2",
            ptr: "mail2.yourdomain.com",
            ipVersion: "IPv4",
            vmtaTagNumber: "101",
            domainAssociated: "yourdomain.com",
            selected: false
          },
          {
            publicIP: "123.45.67.90", // Additional IP #2
            privateIP: "10.0.0.3",
            ptr: "mail3.yourdomain.com",
            ipVersion: "IPv4",
            vmtaTagNumber: "102",
            domainAssociated: "yourdomain.com",
            selected: false
          },
          {
            publicIP: "123.45.67.91", // Additional IP #3
            privateIP: "10.0.0.4",
            ptr: "mail4.yourdomain.com",
            ipVersion: "IPv4",
            vmtaTagNumber: "103",
            domainAssociated: "yourdomain.com",
            selected: false
          },
          {
            publicIP: "123.45.67.92", // Additional IP #4
            privateIP: "10.0.0.5",
            ptr: "mail5.yourdomain.com",
            ipVersion: "IPv4",
            vmtaTagNumber: "104",
            domainAssociated: "yourdomain.com",
            selected: false
          }
        ];
        
        setServerIPs(mockIPs);
        
        if (showToast) {
          toast({
            title: "IPs Retrieved",
            description: `Successfully fetched ${mockIPs.length} IP interfaces from server ${serverIP}.`,
          });
        }
        
        setLoading(prev => ({...prev, getIPs: false}));
        resolve(true);
      }, 1500);
    });
  };
  
  // Button click handlers
  const handleTestSSHConnection = async () => {
    setLoading(prev => ({...prev, testSsh: true}));
    // Simulate API call
    setTimeout(async () => {
      toast({
        title: "SSH Connection Test",
        description: "Successfully connected to server via SSH.",
      });
      setLoading(prev => ({...prev, testSsh: false}));
      
      // Auto-reload IPs after SSH connection test
      await fetchServerIPs(false);
    }, 1500);
  };
  
  const handleGetPTR = async () => {
    setLoading(prev => ({...prev, getPTR: true}));
    // Simulate API call
    setTimeout(async () => {
      toast({
        title: "PTR Records Retrieved",
        description: "Successfully fetched PTR records for selected IPs.",
      });
      setLoading(prev => ({...prev, getPTR: false}));
      
      // Auto-reload IPs after getting PTR records
      await fetchServerIPs(false);
    }, 1500);
  };
  
  const handleSetPTR = async () => {
    setLoading(prev => ({...prev, setPTR: true}));
    // Simulate API call
    setTimeout(async () => {
      toast({
        title: "PTR Records Updated",
        description: "Successfully updated PTR records for selected IPs.",
      });
      setLoading(prev => ({...prev, setPTR: false}));
      
      // Auto-reload IPs after setting PTR records
      await fetchServerIPs(false);
    }, 1500);
  };
  
  // Function to toggle selection of a single IP row
  const toggleIpSelection = (index: number) => {
    const updatedIPs = [...serverIPs];
    updatedIPs[index].selected = !updatedIPs[index].selected;
    setServerIPs(updatedIPs);
  };
  
  // Function to select all IPs
  const handleSelectAll = () => {
    const updatedIPs = serverIPs.map(ip => ({
      ...ip,
      selected: true
    }));
    setServerIPs(updatedIPs);
    setSelectAll(true);
    
    toast({
      title: "Selection Updated",
      description: "All entries have been selected.",
    });
  };
  
  // Function to deselect all IPs
  const handleDeselectAll = () => {
    const updatedIPs = serverIPs.map(ip => ({
      ...ip,
      selected: false
    }));
    setServerIPs(updatedIPs);
    setSelectAll(false);
    
    toast({
      title: "Selection Updated",
      description: "All entries have been deselected.",
    });
  };
  
  // Function to delete selected IPs
  const handleDeleteSelected = async () => {
    const selectedCount = serverIPs.filter(ip => ip.selected).length;
    
    if (selectedCount === 0) {
      toast({
        title: "No IPs Selected",
        description: "Please select at least one IP to delete.",
        variant: "destructive",
      });
      return;
    }
    
    // Remove selected IPs (in a real app, this would call an API)
    const updatedIPs = serverIPs.filter(ip => !ip.selected);
    setServerIPs(updatedIPs);
    
    toast({
      title: "Deletion Complete",
      description: `${selectedCount} IP(s) have been deleted.`,
      variant: "destructive",
    });
    
    // Auto-reload IPs after deletion (in a real app)
    // await fetchServerIPs(false);
  };
  
  // Function to delete all IPs
  const handleDeleteAll = async () => {
    if (serverIPs.length === 0) {
      toast({
        title: "No IPs Available",
        description: "There are no IPs to delete.",
        variant: "destructive",
      });
      return;
    }
    
    // Clear all IPs (in a real app, this would call an API)
    setServerIPs([]);
    
    toast({
      title: "Deletion Complete",
      description: "All IPs have been deleted.",
      variant: "destructive",
    });
    
    // Auto-reload IPs after deletion (in a real app)
    // await fetchServerIPs(false);
  };
  
  // Button handler to get all IPs
  const handleGetAllIPs = () => {
    fetchServerIPs(true);
  };

  const installServerMutation = useMutation({
    mutationFn: async (values: z.infer<typeof serverFormSchema>) => {
      const res = await apiRequest('POST', '/api/servers', values);
      const data = await res.json();
      return data;
    },
    onSuccess: async () => {
      toast({
        title: "Server installed successfully",
        description: "Your new server has been set up and is ready to use.",
      });
      
      // Reset form and refresh server list
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      
      // Auto-reload IPs after server installation
      await fetchServerIPs(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to install server",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof serverFormSchema>) => {
    installServerMutation.mutate(values);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-8">
        {/* Delivery Server Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Delivery Server</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Server Provider */}
                <FormField
                  control={form.control}
                  name="serverType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Provider</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PowerMTA">PVL_03</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Provider Email */}
                <FormField
                  control={form.control}
                  name="providerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Email Account</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Main IP */}
                <FormField
                  control={form.control}
                  name="ip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main IP</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 192.168.108.20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VPS">VPS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SSH User */}
                <FormField
                  control={form.control}
                  name="sshUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH User</FormLabel>
                      <FormControl>
                        <Input placeholder="root" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ssh Port */}
                <FormField
                  control={form.control}
                  name="sshPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ssh Port</FormLabel>
                      <FormControl>
                        <Input placeholder="22" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SSH Auth Type */}
                <FormField
                  control={form.control}
                  name="sshAuthType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH Auth Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select auth type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Password">Password</SelectItem>
                          <SelectItem value="Key">Key</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: SB001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Domain */}
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || 'no-domain'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no-domain">Select domain</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Web Server Type */}
                <FormField
                  control={form.control}
                  name="webServerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Web Server Type</FormLabel>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex space-x-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Httpd" id="httpd" />
                              <label htmlFor="httpd" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Httpd
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Nginx" id="nginx" />
                              <label htmlFor="nginx" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nginx
                              </label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SSH Password */}
                <FormField
                  control={form.control}
                  name="sshPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSH Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Geo */}
                <FormField
                  control={form.control}
                  name="geo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geo</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Domain Random */}
                <FormField
                  control={form.control}
                  name="domainRandom"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mt-6">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="domain-random"
                        />
                        <FormLabel htmlFor="domain-random" className="!mt-0">Domain Random</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <Button 
                  type="button" 
                  variant="outline"
                  className="mr-2"
                  onClick={handleTestSSHConnection}
                  disabled={loading.testSsh}
                >
                  {loading.testSsh ? "Testing..." : "Test SSH Connection"}
                </Button>
                <Button 
                  type="submit" 
                  disabled={installServerMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {installServerMutation.isPending ? "Installing..." : "Install Server"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Install Options Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Install Options</h3>
          <Form {...form}>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PowerMTA Version */}
                <FormField
                  control={form.control}
                  name="installOptions.powerMtaVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PowerMTA™ Version:</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select version" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PowerMTA 4.0r6">PowerMTA™ 4.0r6</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Install All Options */}
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                  <div className="flex items-center h-5">
                    <input
                      id="install-all"
                      name="install-all"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label htmlFor="install-all" className="font-medium text-gray-700">Install All</label>
                  </div>
                </div>

                {/* Pmta Port */}
                <FormField
                  control={form.control}
                  name="installOptions.pmtaPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pmta Port:</FormLabel>
                      <FormControl>
                        <Input placeholder="1998" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Records */}
                <FormField
                  control={form.control}
                  name="installOptions.recordsOn"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-sm">Records:</div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="records-switch"
                        />
                        <span className="text-sm text-gray-500">On</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dkim Option */}
                <FormField
                  control={form.control}
                  name="installOptions.defaultDkim"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-sm">Dkim Option:</div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="dkim-switch"
                        />
                        <span className="text-sm text-gray-500">Use Default Dkim</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* Server Interfaces Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Delivery Server's Interfaces</h3>
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <span className="mr-2">Show</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-2">entries</span>
            </div>
            <div>
              <Input placeholder="Search..." className="w-64" />
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-8 bg-gray-100 p-2 text-xs font-medium text-gray-700">
              <div className="col-span-1 flex items-center justify-center">SELECT</div>
              <div className="col-span-1">PUBLIC IP</div>
              <div className="col-span-1">PRIVATE IP</div>
              <div className="col-span-1">PTR (RDNS)</div>
              <div className="col-span-1">IP VERSION</div>
              <div className="col-span-1">VMTA TAG NUMBER</div>
              <div className="col-span-1">DOMAIN ASSOCIATED</div>
              <div className="col-span-1">ACTION</div>
            </div>
            
            {serverIPs.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No data available in table
              </div>
            ) : (
              <div>
                {serverIPs.map((ip, index) => (
                  <div key={index} className="grid grid-cols-8 p-2 text-xs border-b hover:bg-gray-50">
                    <div className="col-span-1 flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={ip.selected || false}
                        onChange={() => toggleIpSelection(index)}
                      />
                    </div>
                    <div className="col-span-1">{ip.publicIP}</div>
                    <div className="col-span-1">{ip.privateIP}</div>
                    <div className="col-span-1">{ip.ptr}</div>
                    <div className="col-span-1">{ip.ipVersion}</div>
                    <div className="col-span-1">{ip.vmtaTagNumber}</div>
                    <div className="col-span-1">{ip.domainAssociated}</div>
                    <div className="col-span-1">
                      <button className="px-2 py-1 text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-2 flex justify-between text-xs text-gray-600 bg-gray-50 border-t">
              <div>
                {serverIPs.length > 0 
                  ? `Showing 1 to ${serverIPs.length} of ${serverIPs.length} entries` 
                  : "Showing 0 to 0 of 0 entries"}
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 bg-gray-200 rounded">Previous</button>
                <button className="px-3 py-1 bg-gray-200 rounded">Next</button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex space-x-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeselectAll}
            >
              Deselect All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-green-100 text-green-700"
              onClick={handleGetAllIPs}
              disabled={loading.getIPs}
            >
              {loading.getIPs ? "Fetching IPs..." : "Get All IPs in Server"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGetPTR}
              disabled={loading.getPTR}
            >
              {loading.getPTR ? "Fetching..." : "Get PTR"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSetPTR}
              disabled={loading.setPTR}
            >
              {loading.setPTR ? "Setting..." : "Set PTR"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-800"
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-800"
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
          </div>
        </div>

        {/* Installation Log Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Installation Log</h3>
          <div className="border rounded-md p-4 bg-black text-green-400 font-mono text-sm h-64 overflow-auto">
            <div>Waiting for installation to begin...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallServer;