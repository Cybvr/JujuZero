import React from 'react';
import { Separator } from './separator'; // Ensure correct import path

export const Breadcrumbs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <nav className="flex items-center text-sm text-gray-600">
      {children}
    </nav>
  );
};

interface BreadcrumbItemProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ children, isActive }) => {
  return (
    <div className="flex items-center">
      <span className={isActive ? 'text-blue-600' : ''}>
        {children}
      </span>
      {!isActive && <Separator orientation="vertical" className="h-4 mx-2" />}
    </div>
  );
};