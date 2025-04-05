import { useState } from 'react';
import EmailHeader from '@/components/campaign/EmailHeader';
import EmailBody from '@/components/campaign/EmailBody';
import EmailPreview from '@/components/campaign/EmailPreview';

const Campaign = () => {
  const [campaign, setCampaign] = useState({
    fromName: '',
    fromEmail: '',
    replyTo: '',
    subject: 'Monthly Newsletter',
    preheader: '',
    htmlContent: '',
  });
  
  const updateCampaign = (field: string, value: string) => {
    setCampaign(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Email Campaign Builder</h1>
        <p className="mt-1 text-sm text-gray-600">Create and customize your email campaigns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Header */}
        <EmailHeader 
          campaign={campaign}
          updateCampaign={updateCampaign}
        />
        
        {/* Email Body */}
        <EmailBody 
          htmlContent={campaign.htmlContent}
          updateHtmlContent={(value) => updateCampaign('htmlContent', value)}
        />
        
        {/* Email Preview */}
        <EmailPreview 
          campaign={campaign}
        />
      </div>
    </div>
  );
};

export default Campaign;
