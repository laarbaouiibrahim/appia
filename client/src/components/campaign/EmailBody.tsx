import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { HtmlEditor } from '@/components/ui/html-editor';
import { Button } from '@/components/ui/button';
import { Layers, Download, Eye } from 'lucide-react';
import { defaultEmailTemplate } from '@/lib/utils';

interface EmailBodyProps {
  htmlContent: string;
  updateHtmlContent: (content: string) => void;
}

const EmailBody = ({ htmlContent, updateHtmlContent }: EmailBodyProps) => {
  const { toast } = useToast();
  const [localContent, setLocalContent] = useState<string>(defaultEmailTemplate);
  
  useEffect(() => {
    // Initialize with default template if empty
    if (!htmlContent) {
      updateHtmlContent(defaultEmailTemplate);
    } else {
      setLocalContent(htmlContent);
    }
  }, []);

  const updatePreviewMutation = useMutation({
    mutationFn: async (content: string) => {
      // In a real implementation, we might save this to a temporary storage
      // or just update the state in the parent component
      return content;
    },
    onSuccess: (content) => {
      updateHtmlContent(content);
      toast({
        title: "Preview updated",
        description: "The email preview has been updated with your changes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update preview",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleUpdatePreview = () => {
    updatePreviewMutation.mutate(localContent);
  };

  const handleContentChange = (value: string) => {
    setLocalContent(value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Email Body HTML</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="outline" size="sm" className="inline-flex items-center">
              <Download className="-ml-0.5 mr-1 h-4 w-4" />
              Import
            </Button>
          </div>
          <div>
            <Button variant="outline" size="sm">
              Templates
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-300 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
            <div className="flex space-x-2">
              <button type="button" className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button type="button" className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button type="button" className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <button type="button" className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
            <div>
              <button type="button" className="p-1 text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <HtmlEditor
            id="html-editor"
            className="w-full code-editor p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={localContent}
            onUpdateValue={handleContentChange}
          />
        </div>
        
        <div>
          <Button 
            onClick={handleUpdatePreview}
            className="w-full inline-flex justify-center items-center"
            disabled={updatePreviewMutation.isPending}
          >
            <Eye className="-ml-1 mr-2 h-5 w-5" />
            {updatePreviewMutation.isPending ? "Updating..." : "Update Preview"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailBody;
