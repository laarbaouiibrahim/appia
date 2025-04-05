import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Mail, Save, Monitor, Smartphone } from 'lucide-react';
import { sanitizeHtml } from '@/lib/utils';

interface EmailPreviewProps {
  campaign: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    subject: string;
    preheader: string;
    htmlContent: string;
  };
}

const EmailPreview = ({ campaign }: EmailPreviewProps) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  
  useEffect(() => {
    if (campaign.htmlContent) {
      setPreviewHtml(sanitizeHtml(campaign.htmlContent));
    }
  }, [campaign.htmlContent]);
  
  const sendTestMutation = useMutation({
    mutationFn: async () => {
      // In a real app, we'd send a test email to a selected address
      const res = await apiRequest('POST', '/api/campaigns/test', {
        ...campaign
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Test email sent",
        description: "Check your inbox for the test email.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send test email",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
  
  const saveCampaignMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/campaigns', campaign);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaign saved",
        description: "Your campaign has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save campaign",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  const handleSaveCampaign = () => {
    saveCampaignMutation.mutate();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Email Preview</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-gray-700">View mode:</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                size="icon"
                variant={viewMode === 'desktop' ? 'default' : 'secondary'}
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant={viewMode === 'mobile' ? 'default' : 'secondary'}
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md overflow-hidden h-[450px]">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">Subject:</span> <span className="text-gray-700" id="preview-subject">{campaign.subject || 'Monthly Newsletter'}</span>
            </div>
            <div>
              <button type="button" className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </button>
            </div>
          </div>
          <div className={`p-1 overflow-auto bg-white h-[410px] ${viewMode === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
            {previewHtml ? (
              <iframe
                id="email-preview"
                className="w-full h-full border-0"
                srcDoc={previewHtml}
                title="Email Preview"
                sandbox="allow-same-origin"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Update the HTML content to see a preview here</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="inline-flex justify-center items-center"
            onClick={handleSendTest}
            disabled={sendTestMutation.isPending || !campaign.htmlContent}
          >
            <Mail className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            {sendTestMutation.isPending ? "Sending..." : "Send Test"}
          </Button>
          <Button
            className="inline-flex justify-center items-center"
            onClick={handleSaveCampaign}
            disabled={saveCampaignMutation.isPending || !campaign.htmlContent}
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            {saveCampaignMutation.isPending ? "Saving..." : "Save Campaign"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
