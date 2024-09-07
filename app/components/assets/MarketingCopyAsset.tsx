import React from 'react';
import CustomEditor from '@/components/dashboard/CustomEditor';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Download } from "lucide-react";

export default function MarketingCopyAsset({ content, onChange }) {
  return (
    <TooltipProvider>
      <div className="p-4 space-y-6 text-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Marketing Copy</h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white text-black border-gray-300">
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