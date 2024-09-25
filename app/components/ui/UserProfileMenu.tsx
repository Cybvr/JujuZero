import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from "@/components/ui/button";
import { CreditCard, User, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfileMenuProps {
  user: FirebaseUser | null;
}

export default function UserProfileMenu({ user }: UserProfileMenuProps) {
  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/default-avatar.png";
              }}
            />
          ) : (
            <span>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}</span>
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-56 mt-2 p-1 bg-popover text-popover-foreground rounded-md shadow-md" align="end" forceMount>
          <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="my-1 h-px bg-muted" />
          <DropdownMenu.Item className="px-2 py-1.5 text-sm cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-sm">
            <Link href="/dashboard/account" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-2 py-1.5 text-sm cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-sm">
            <Link href="/dashboard/billing" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-2 py-1.5 text-sm cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-sm">
            <Link href="/changelog" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              <span>What's new</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-muted" />
          <DropdownMenu.Item 
            className="px-2 py-1.5 text-sm cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-sm text-red-600" 
            onSelect={handleSignOut}
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}