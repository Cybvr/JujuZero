"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Account() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSaveAccountInfo = () => {
    // Implement the logic to save account information
    console.log("Saving account information:", { name, email });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Implement the actual account deletion logic here
    console.log("Account deletion initiated");
    setIsDeleteDialogOpen(false);
  };

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
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="max-w-md"
                  />
                ) : (
                  <p className="text-sm">{name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="max-w-md"
                  />
                ) : (
                  <p className="text-sm">{email}</p>
                )}
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
      </div>

      {/* Confirmation Dialog for Account Deletion */}
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