import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Crown } from 'lucide-react';
import UserProfileMenu from '@/components/ui/UserProfileMenu';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import ToolsSearch from './ToolsSearch';

interface DashboardHeaderProps {
  className?: string;
}

export default function DashboardHeader({ className }: DashboardHeaderProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className={`flex justify-between items-center p-4 bg-background ${className ?? ''}`}>
      <div className="flex items-center space-x-2">
        <ToolsSearch />
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
              <Crown className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Upgrade</span>
            </Button>
            <UserProfileMenu user={user} />
          </>
        ) : (
          <Button onClick={() => setShowAuthModal(true)}>Login</Button>
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}