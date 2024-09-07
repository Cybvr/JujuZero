// File: app/components/assets/SocialMediaAsset.tsx
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Edit, Trash, Download } from "lucide-react";

export default function SocialMediaAsset({ content }) {
  return (
    <TooltipProvider>
      <div>
        <div className="flex space-x-2 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit this asset</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete this asset</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download this asset</TooltipContent>
          </Tooltip>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {content.map((image, index) => (
            <img key={index} src={image} alt={`Social Media Asset ${index + 1}`} className="max-w-full h-auto" />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}