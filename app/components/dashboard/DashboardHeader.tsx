import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Crown, Search } from 'lucide-react';
import UserProfileMenu from '@/components/ui/UserProfileMenu';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

interface DashboardHeaderProps {
  className?: string;
}

export default function DashboardHeader({ className }: DashboardHeaderProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className={`flex justify-between items-center p-4 bg-background ${className ?? ''}`}>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search..."
            className="w-[200px] lg:w-[300px] pl-10"
          />
        </div>
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