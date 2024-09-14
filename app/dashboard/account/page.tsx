'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Trash2, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, signOut } from 'firebase/auth';
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast";

export default function Account() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!loading && !user) {
        router.push('/login');
      } else if (user) {
        console.log("User object:", user); // Debug log
        setDisplayName(user.displayName || '');
        setEmail(user.email || '');
        setPhotoURL(user.photoURL || '');

        // Fetch additional data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Firestore user data:", userData); // Debug log
            setDisplayName(userData.name || user.displayName || '');
            setPhotoURL(userData.avatar || user.photoURL || '');
          } else {
            // If the document doesn't exist, create it
            await setDoc(doc(db, 'users', user.uid), {
              name: user.displayName || '',
              email: user.email || '',
              avatar: user.photoURL || '',
              uid: user.uid,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Error fetching/creating user data in Firestore:", error);
        }
      }
    };

    fetchUserData();
  }, [user, loading, router]);

  const handleSaveAccountInfo = async () => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName: displayName,
          photoURL: photoURL
        });

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: displayName,
          avatar: photoURL,
          updatedAt: new Date()
        });

        setIsEditing(false);
        toast({
          title: "Success",
          description: "Account information updated successfully.",
        });
      } catch (error) {
        console.error("Error updating account info:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update account information.",
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic here
    console.log("Account deletion initiated");
    setIsDeleteDialogOpen(false);
    // Add actual deletion logic and error handling
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-1">My Account</h1>
      <p className="text-sm text-muted-foreground mb-4">Manage your account details here.</p>
      <Separator className="mb-6" />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {photoURL ? (
                    <Image src={photoURL} alt="User avatar" width={100} height={100} className="rounded-full" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{displayName || 'No name set'}</h3>
                  <p className="text-sm text-muted-foreground">{email || 'No email set'}</p>
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-md"
                  />
                ) : (
                  <p className="text-sm">{displayName || 'No name set'}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <p className="text-sm">{email || 'No email set'}</p>
              </div>
              {isEditing ? (
                <Button onClick={handleSaveAccountInfo}>Save Changes</Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Account Information</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Permanently delete your account and all associated data.</p>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete Account</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Sign out of your account.</p>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>Yes, delete my account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}