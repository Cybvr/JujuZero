import React from 'react';
import CustomEditor from '@/components/dashboard/CustomEditor';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Download } from "lucide-react";

interface MarketingCopyAssetProps {
  content: string;
  onChange: (newContent: string) => void;
}

export default function MarketingCopyAsset({ content, onChange }: MarketingCopyAssetProps) {
  const handleDownload = () => {
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    // Create a link element
    const link = document.createElement('a');
    // Set the download attribute with a filename
    link.download = 'marketing_copy.txt';
    // Create a URL for the Blob and set it as the href
    link.href = window.URL.createObjectURL(blob);
    // Append the link to the body
    document.body.appendChild(link);
    // Programmatically click the link to trigger the download
    link.click();
    // Remove the link from the body
    document.body.removeChild(link);
  };

  return (
    <TooltipProvider>
      <div className="p-4 space-y-6 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Marketing Copy</h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white text-black border-gray-300"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-3 w-3" /> Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download this asset</TooltipContent>
          </Tooltip>
        </div>
        <CustomEditor value={content} onChange={onChange} />
      </div>
    </TooltipProvider>
  );
}