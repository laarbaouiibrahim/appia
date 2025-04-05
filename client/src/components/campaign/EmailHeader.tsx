import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface EmailHeaderProps {
  campaign: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    subject: string;
    preheader: string;
  };
  updateCampaign: (field: string, value: string) => void;
}

const EmailHeader = ({ campaign, updateCampaign }: EmailHeaderProps) => {
  const { toast } = useToast();
  
  const saveHeaderMutation = useMutation({
    mutationFn: async (campaignData: typeof campaign) => {
      const res = await apiRequest('POST', '/api/campaigns', {
        ...campaignData,
        htmlContent: 'Placeholder content', // Temporary content until the HTML is saved
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Header saved successfully",
        description: "Your email header information has been saved.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save header",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCampaign(e.target.name, e.target.value);
  };
  
  const handleSaveHeader = () => {
    saveHeaderMutation.mutate(campaign);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Email Header</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSaveHeader(); }}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fromName">From Name</Label>
            <Input 
              type="text" 
              id="fromName" 
              name="fromName" 
              value={campaign.fromName} 
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="fromEmail">From Email</Label>
            <Input 
              type="email" 
              id="fromEmail" 
              name="fromEmail" 
              value={campaign.fromEmail} 
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="replyTo">Reply-To</Label>
            <Input 
              type="email" 
              id="replyTo" 
              name="replyTo" 
              value={campaign.replyTo} 
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              type="text" 
              id="subject" 
              name="subject" 
              value={campaign.subject} 
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="preheader">Preheader Text</Label>
            <Input 
              type="text" 
              id="preheader" 
              name="preheader" 
              value={campaign.preheader} 
              onChange={handleInputChange}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-gray-500">This text appears after the subject line in some email clients.</p>
          </div>
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full inline-flex justify-center items-center"
              disabled={saveHeaderMutation.isPending}
            >
              <Save className="-ml-1 mr-2 h-5 w-5" />
              {saveHeaderMutation.isPending ? "Saving..." : "Save Header"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmailHeader;
