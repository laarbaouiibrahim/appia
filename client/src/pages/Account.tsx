import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Marketing',
    phone: '+1 (555) 123-4567',
    bio: 'Email marketing specialist with 5+ years of experience in campaign management and deliverability optimization.',
  });

  const [billingData, setBillingData] = useState({
    plan: 'Professional',
    nextBilling: 'May 4, 2025',
    paymentMethod: 'Visa ending in 4242',
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  const saveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const changePlan = () => {
    toast({
      title: "Plan Upgrade",
      description: "You'll be redirected to the pricing page to select a new plan.",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Upload Started",
                      description: "Select a profile picture to upload.",
                    });
                  }}>
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => handleProfileChange('company', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      rows={4}
                    />
                    <p className="text-sm text-gray-500">Brief description about yourself or your role.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline">Reset</Button>
              <Button onClick={saveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Current Plan: {billingData.plan}</h3>
                    <p className="text-sm text-gray-500">Next billing date: {billingData.nextBilling}</p>
                  </div>
                  <Button onClick={changePlan}>
                    Change Plan
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium">Plan Features:</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Up to 50,000 emails per month</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Advanced deliverability tools</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Multi-server management</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Email templates and analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">Payment Method</h3>
                <div className="flex justify-between items-center bg-white border p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-blue-600 rounded mr-3"></div>
                    <div>
                      <p className="font-medium">{billingData.paymentMethod}</p>
                      <p className="text-sm text-gray-500">Expires 04/26</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Payment Method",
                      description: "You'll be redirected to update your payment method.",
                    });
                  }}>
                    Update
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3">Billing History</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-left">Amount</th>
                        <th className="py-3 px-4 text-left">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 px-4">Apr 4, 2025</td>
                        <td className="py-3 px-4">Subscription - Professional Plan</td>
                        <td className="py-3 px-4">$99.00</td>
                        <td className="py-3 px-4">
                          <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => {
                            toast({
                              title: "Invoice Download",
                              description: "Your invoice has been downloaded.",
                            });
                          }}>
                            Download
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Mar 4, 2025</td>
                        <td className="py-3 px-4">Subscription - Professional Plan</td>
                        <td className="py-3 px-4">$99.00</td>
                        <td className="py-3 px-4">
                          <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => {
                            toast({
                              title: "Invoice Download",
                              description: "Your invoice has been downloaded.",
                            });
                          }}>
                            Download
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">Your API Keys</h3>
                  <p className="text-sm text-gray-500">Use these keys to authenticate API requests from your applications</p>
                </div>
                <Button onClick={() => {
                  toast({
                    title: "New API Key",
                    description: "Your new API key has been generated.",
                  });
                }}>
                  Generate New Key
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left">Key Name</th>
                      <th className="py-3 px-4 text-left">Created</th>
                      <th className="py-3 px-4 text-left">Last Used</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">Primary API Key</p>
                          <p className="text-xs text-gray-500 mt-1">••••••••••••••••••••••••••</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">Jan 15, 2025</td>
                      <td className="py-3 px-4">Apr 3, 2025</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "API Key Copied",
                                description: "The API key has been copied to your clipboard.",
                              });
                            }}
                          >
                            Copy
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              toast({
                                title: "API Key Revoked",
                                description: "Your API key has been revoked and is no longer valid.",
                                variant: "destructive"
                              });
                            }}
                          >
                            Revoke
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">Development Key</p>
                          <p className="text-xs text-gray-500 mt-1">••••••••••••••••••••••••••</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">Feb 23, 2025</td>
                      <td className="py-3 px-4">Apr 2, 2025</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "API Key Copied",
                                description: "The API key has been copied to your clipboard.",
                              });
                            }}
                          >
                            Copy
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              toast({
                                title: "API Key Revoked",
                                description: "Your API key has been revoked and is no longer valid.",
                                variant: "destructive"
                              });
                            }}
                          >
                            Revoke
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">API Documentation</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Learn how to use the EmailMarketer API to integrate with your applications.
                </p>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Documentation",
                    description: "Opening API documentation in a new window.",
                  });
                }}>
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;