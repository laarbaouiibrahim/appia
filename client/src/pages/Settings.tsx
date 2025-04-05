import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [smtpSettings, setSmtpSettings] = useState({
    server: 'smtp.example.com',
    port: '587',
    username: 'user@example.com',
    password: '••••••••••••',
    useTLS: true,
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: '••••••••••••••••••••••••••••••••',
    enableAnalytics: true,
    enableTracking: true,
    webhookUrl: 'https://webhook.example.com/emails',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    campaignCompletionAlerts: true,
    bounceAlerts: true,
    dailyReports: true,
  });

  const handleSmtpChange = (field: string, value: string | boolean) => {
    setSmtpSettings({
      ...smtpSettings,
      [field]: value,
    });
  };

  const handleApiChange = (field: string, value: string | boolean) => {
    setApiSettings({
      ...apiSettings,
      [field]: value,
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your application preferences and configurations</p>
      </div>

      <Tabs defaultValue="smtp">
        <TabsList className="mb-6">
          <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Settings</CardTitle>
              <CardDescription>Configure your SMTP server for sending emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input
                    id="smtp-server"
                    value={smtpSettings.server}
                    onChange={(e) => handleSmtpChange('server', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input
                    id="smtp-port"
                    value={smtpSettings.port}
                    onChange={(e) => handleSmtpChange('port', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input
                    id="smtp-username"
                    value={smtpSettings.username}
                    onChange={(e) => handleSmtpChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={smtpSettings.password}
                    onChange={(e) => handleSmtpChange('password', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="tls"
                  checked={smtpSettings.useTLS}
                  onCheckedChange={(checked) => handleSmtpChange('useTLS', checked)}
                />
                <Label htmlFor="tls">Use TLS/SSL</Label>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Test your SMTP connection</h4>
                <div className="flex space-x-2">
                  <Input placeholder="test@example.com" className="max-w-xs" />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Test Email Sent",
                        description: "A test email has been sent to verify your SMTP settings.",
                      });
                    }}
                  >
                    Send Test Email
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>Configure API keys and third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    value={apiSettings.apiKey}
                    type="password"
                    className="font-mono"
                    onChange={(e) => handleApiChange('apiKey', e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "API Key Regenerated",
                        description: "Your API key has been regenerated. Make sure to update it in your applications.",
                      });
                    }}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Analytics & Tracking</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-analytics"
                    checked={apiSettings.enableAnalytics}
                    onCheckedChange={(checked) => handleApiChange('enableAnalytics', checked)}
                  />
                  <Label htmlFor="enable-analytics">Enable Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-tracking"
                    checked={apiSettings.enableTracking}
                    onCheckedChange={(checked) => handleApiChange('enableTracking', checked)}
                  />
                  <Label htmlFor="enable-tracking">Enable Email Tracking</Label>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-lg font-medium">Webhooks</h3>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={apiSettings.webhookUrl}
                  onChange={(e) => handleApiChange('webhookUrl', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll send POST requests to this URL when email events occur (delivered, opened, clicked, etc.)
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Methods</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', !!checked)}
                  />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="desktop-notifications"
                    checked={notificationSettings.desktopNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('desktopNotifications', !!checked)}
                  />
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Alert Types</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campaign-completion"
                    checked={notificationSettings.campaignCompletionAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('campaignCompletionAlerts', !!checked)}
                  />
                  <Label htmlFor="campaign-completion">Campaign Completion Alerts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bounce-alerts"
                    checked={notificationSettings.bounceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('bounceAlerts', !!checked)}
                  />
                  <Label htmlFor="bounce-alerts">Bounce Rate Alerts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="daily-reports"
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => handleNotificationChange('dailyReports', !!checked)}
                  />
                  <Label htmlFor="daily-reports">Daily Summary Reports</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security options for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account with two-factor authentication
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Status: <span className="text-red-500">Disabled</span></p>
                  </div>
                  <Button onClick={() => {
                    toast({
                      title: "2FA Setup",
                      description: "Follow the instructions to set up two-factor authentication.",
                    });
                  }}>
                    Enable 2FA
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-lg font-medium">Session Management</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                      <p className="text-sm text-gray-500">Started: April 4, 2025 at 2:45 PM</p>
                    </div>
                    <Button variant="outline" size="sm">
                      End Session
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  className="mt-4"
                  onClick={() => {
                    toast({
                      title: "All Sessions Ended",
                      description: "You have been logged out of all devices.",
                      variant: "destructive"
                    });
                  }}
                >
                  Log Out of All Devices
                </Button>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-lg font-medium">Password Reset</h3>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Password Reset Email Sent",
                    description: "Check your email for instructions to reset your password.",
                  });
                }}>
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;