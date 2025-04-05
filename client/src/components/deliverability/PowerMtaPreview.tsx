import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server } from '../../../../shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Download, Copy, RotateCw, Mail, AlertCircle, CheckCircle, Clock, ArrowRight,
  Home, Activity, List, Database, Briefcase, Clipboard, ChevronRight
} from 'lucide-react';
import { samplePmtaConfig } from '@/lib/utils';

const PowerMtaPreview = () => {
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [emailDotsPosition, setEmailDotsPosition] = useState<{ left: number, active: boolean }[]>([]);
  
  const { data: servers, isLoading, isError } = useQuery<Server[]>({
    queryKey: ['/api/servers'],
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(samplePmtaConfig);
  };
  
  // Simulate email flow animation
  useEffect(() => {
    // Initialize email dots for animation
    const initialDots = Array.from({ length: 8 }, (_, i) => ({
      left: Math.floor(Math.random() * 20), // Randomize starting positions
      active: false
    }));
    
    setEmailDotsPosition(initialDots);
    
    // Animate dots movement
    const interval = setInterval(() => {
      setEmailDotsPosition(prev => {
        return prev.map((dot, i) => {
          // Randomly activate dots at different times
          const active = dot.active || Math.random() > 0.8;
          
          // Move active dots across the flow
          if (active) {
            const newLeft = dot.left + 2;
            
            // Reset dots that reached the end
            if (newLeft > 100) {
              return { left: 0, active: false };
            }
            
            return { left: newLeft, active: true };
          }
          
          return dot;
        });
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-tab-content="powermta-preview">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">PMTA Manager</h2>
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
            <Button>Open</Button>
            <Button variant="secondary">Run</Button>
          </div>
        </div>

        {/* Header cards */}
        <div className="mb-4 space-y-2">
          <div className="bg-indigo-200 p-4 rounded flex items-center justify-between">
            <span className="font-medium">PMTA Manager</span>
            <ChevronRight className="h-5 w-5" />
          </div>
          <div className="bg-indigo-200 p-4 rounded flex items-center justify-between">
            <span className="font-medium">PMTA</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>

        {/* Server info and version */}
        <div className="mb-4">
          <div className="text-sm text-gray-600">
            Test <span className="text-gray-900 font-medium">192.227.111.208</span> Raw Servers
          </div>
          <div className="mt-2 flex justify-between">
            <div className="flex items-center">
              <div className="text-xl font-bold text-red-700">port25</div>
              <div className="ml-2 text-xs text-gray-500">software™, ltd.</div>
            </div>
            <div className="text-sm text-right">
              <div className="font-medium">PowerMTA™ 4.0r6</div>
              <div className="text-gray-500">Staff online</div>
            </div>
          </div>
        </div>

        {/* PMTA Menu navigation */}
        <div className="bg-white border border-gray-300 rounded mb-4">
          <div className="flex bg-gray-100 border-b border-gray-300 text-sm">
            <button className="px-4 py-2 bg-blue-600 text-white font-medium">
              <Home className="h-4 w-4 inline mr-1" />
              Home
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200">
              <Activity className="h-4 w-4 inline mr-1" />
              Status
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200">
              <List className="h-4 w-4 inline mr-1" />
              Queues
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200">
              <Database className="h-4 w-4 inline mr-1" />
              Domains
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Virtual MTAs
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Jobs
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200">
              <Clipboard className="h-4 w-4 inline mr-1" />
              Logs
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="queue">PMTA Queue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Server Status</h3>
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="mt-1 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Running
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Uptime</p>
                        <p className="mt-1 text-sm text-gray-900">12d 5h 32m</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Queue Size</p>
                        <p className="mt-1 text-sm text-gray-900">145 MB</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Connections</p>
                        <p className="mt-1 text-sm text-gray-900">23</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">Delivery Statistics</h3>
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sent Today</p>
                        <p className="mt-1 text-sm text-gray-900">142,567</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Delivery Rate</p>
                        <p className="mt-1 text-sm text-gray-900">98.2%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bounces</p>
                        <p className="mt-1 text-sm text-gray-900">1.8%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Message Rate</p>
                        <p className="mt-1 text-sm text-gray-900">89/min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="queue">
              <div className="bg-white rounded-lg">
                <h3 className="text-base font-medium text-gray-900 mb-4">PowerMTA Queue Status</h3>
                
                <div className="space-y-6">
                  {/* Queue Summary */}
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Queue Size</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">78,345</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Deferred</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">12,567</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Delivered</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">534,987</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Failed</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">8,932</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Queue Details */}
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Queue Processing</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <Mail className="h-4 w-4 mr-1" /> Active
                            <span className="ml-1 text-xs text-gray-500">(65%)</span>
                          </span>
                          <span className="text-sm text-gray-500">78,345</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> Deferred
                            <span className="ml-1 text-xs text-gray-500">(12%)</span>
                          </span>
                          <span className="text-sm text-gray-500">12,567</span>
                        </div>
                        <Progress value={12} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> Delivered
                            <span className="ml-1 text-xs text-gray-500">(85%)</span>
                          </span>
                          <span className="text-sm text-gray-500">534,987</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" /> Failed
                            <span className="ml-1 text-xs text-gray-500">(8%)</span>
                          </span>
                          <span className="text-sm text-gray-500">8,932</span>
                        </div>
                        <Progress value={8} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Domains in Queue */}
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Top Domains in Queue</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">gmail.com</span>
                          <span className="text-sm text-gray-500">42,567</span>
                        </div>
                        <Progress value={54} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">yahoo.com</span>
                          <span className="text-sm text-gray-500">18,234</span>
                        </div>
                        <Progress value={23} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">hotmail.com</span>
                          <span className="text-sm text-gray-500">9,876</span>
                        </div>
                        <Progress value={13} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">aol.com</span>
                          <span className="text-sm text-gray-500">4,321</span>
                        </div>
                        <Progress value={6} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">outlook.com</span>
                          <span className="text-sm text-gray-500">3,347</span>
                        </div>
                        <Progress value={4} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Real-time Email Flow */}
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Real-time Email Flow</h4>
                    
                    <div className="relative h-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-md border border-gray-200 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4 h-full">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-6 w-6 text-blue-500" />
                          <span className="text-sm font-medium">Queue</span>
                        </div>
                        
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                        
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                          <span className="text-sm font-medium">Delivered</span>
                        </div>
                      </div>
                      
                      {/* Animated email dots */}
                      {emailDotsPosition.map((dot, i) => (
                        dot.active && (
                          <div 
                            key={i}
                            className="absolute h-2 w-2 rounded-full bg-blue-500"
                            style={{ 
                              left: `${dot.left}%`, 
                              top: `${35 + (i % 3) * 10}%`,
                              opacity: 0.7 + (Math.sin(dot.left * 0.1) * 0.3)
                            }}
                          />
                        )
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-between text-xs text-gray-500">
                      <div>Processing: <span className="font-medium text-gray-700">~89 emails/min</span></div>
                      <div>Current throughput: <span className="font-medium text-gray-700">5.3 MB/s</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PowerMtaPreview;
