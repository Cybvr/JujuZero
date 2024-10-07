import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, DownloadCloud, Edit } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";

interface ProjectHeaderProps {
  projectName: string;
  projectTagline?: string;
  projectLogo?: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectTagline,
  projectLogo
}) => {
  return (
    <>
      <div className="mb-4">
        <Breadcrumbs>
          <BreadcrumbItem isActive={false}>
            <Link href="/dashboard/projects">Projects</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive={true}>
            {projectName || 'Untitled Project'}
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar
            src={projectLogo || null}
            alt={projectName}
            className="h-16 w-16 md:h-20 md:w-20"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{projectName || 'Untitled Project'}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{projectTagline || 'No tagline available'}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="border-2 border-gray-300">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Invite</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Invite team members</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="border-2 border-gray-300">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export project data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Edit Brand</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit brand details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default ProjectHeader;