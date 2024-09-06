import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt } from "lucide-react";

export default function Billing() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-1">Billing Management</h1>
      <p className="text-sm text-muted-foreground mb-4">Manage your payment methods here.</p>
      <Separator className="mb-6" />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm"><span className="font-medium">Current Payment Method:</span> Visa **** **** **** 1234</p>
              <p className="text-sm"><span className="font-medium">Expiration Date:</span> 12/24</p>
            </div>
            <Button variant="outline">Update Payment Method</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Your billing history will be displayed here.</p>
            <Button variant="outline">View All Transactions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}