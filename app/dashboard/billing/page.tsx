"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { getUserCredits } from '@/lib/credits';
import { useAuth } from '@/context/AuthContext';

const MAX_CREDITS = 500;

const features = "Access to all tools, 10 GB storage, Priority email support, Access to documents";

const freeTier = {
  title: "Free",
  price: "$0/mo",
  description: "For casual users",
  features: "Access to 4 tools, 1 GB storage, Community support, No access to documents",
  isCurrent: true,
  credits: 200,
  renewalDate: "Nov 5, 2024",
};
const proTier = {
  title: "Pro",
  price: "$12.00/mo",
  description: "Billed monthly",
  features: features,
  isCurrent: false, // Assuming the user is currently on the free tier
  credits: MAX_CREDITS, // Changed from "Unlimited" to a numerical value
  renewalDate: "Nov 5, 2024", // Update with actual renewal date if applicable
};



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface Invoice {
  id: string;
  amount: number;
  status: string;
  date: string;
  url: string;
}

export default function BillingPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const userCredits = await getUserCredits(user.uid);
        setCredits(userCredits);
      }
    }
    fetchCredits();
  }, [user]);

  useEffect(() => {
    async function fetchInvoices() {
      setIsLoadingInvoices(true);
      try {
        const response = await fetch('/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data: Invoice[] = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast({
          title: "Error",
          description: "Failed to load invoices. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingInvoices(false);
      }
    }

    fetchInvoices();
  }, [toast]);

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: 'price_1Q4so4D8nor3Ao7WoFUrxpel' }), // Replace with your actual price ID
      });
      const session = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) {
          console.error('Error redirecting to checkout:', error);
          toast({
            title: "Error",
            description: "Failed to redirect to checkout. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        throw new Error('Stripe object is null');
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const renderPricingCard = (option: typeof freeTier, index: number) => (
    <Card key={index} className={`flex flex-col ${index === 1 ? 'border-primary' : ''}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">{option.title}</CardTitle>
        <CardDescription>{option.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-xl font-medium mb-2">{option.price}</div>
        <p className="text-sm text-muted-foreground mb-2">{option.features}</p>
        <p className="text-sm font-medium">Credits: {option.credits}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          variant={index === 1 ? "default" : "secondary"}
          onClick={() => option.isCurrent ? null : handleUpgrade()}
          disabled={option.isCurrent}
        >
          {option.isCurrent ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderPlanSummaryCard = () => (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-8">
          <CardTitle className="text-xl font-medium">Plan Summary</CardTitle>
          <Badge variant="secondary" className="text-xs">{freeTier.title} Plan</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start text-sm mb-4">
          <div className="flex-1">
            <p className="font-medium">{credits !== null ? `${credits} credits left` : 'Loading credits...'}</p>
            <Progress value={credits !== null ? (credits / MAX_CREDITS) * 100 : 0} className="w-full h-2 mt-1" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Price/Month</p>
            <p>{freeTier.price}</p>
          </div>
          <div className="flex-1">
            <p className="font-medium">Included Credits</p>
            <p>{freeTier.credits}</p>
          </div>
          <div className="flex-1">
            <p className="font-medium">Renewal Date</p>
            <p>{freeTier.renewalDate}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleUpgrade}>
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentCard = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Payment Information</CardTitle>
        <CardDescription>Manage your payment details</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Manage your payment method through Stripe.</p>
        <div className="flex justify-end">
          <Button onClick={handleUpgrade}>
            Manage Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderInvoicesTable = () => (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingInvoices ? (
          <p>Loading invoices...</p>
        ) : invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => window.open(invoice.url, '_blank')} variant="outline" size="sm">
                      View Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No invoices found.</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 bg-background">
      <h1 className="text-2xl font-medium mb-6">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {renderPlanSummaryCard()}
          {renderPaymentCard()}
          {renderInvoicesTable()}
        </div>
        <div className="space-y-6">
          {renderPricingCard(freeTier, 0)}
          {renderPricingCard(proTier, 1)}
        </div>
      </div>
    </div>
  );
}
