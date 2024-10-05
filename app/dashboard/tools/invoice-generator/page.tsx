"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Toolbar from '../../../components/dashboard/toolbar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Download, Plus, Trash } from 'lucide-react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AuthModal from '@/components/dashboard/AuthModal';
import { getUserCredits, deductCredits } from '@/lib/credits';

const INVOICE_GENERATION_COST = 20;

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be non-negative"),
  })).min(1, "At least one item is required"),
  taxRate: z.number().min(0).max(100),
  currency: z.string(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function InvoiceGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: '',
      customerName: '',
      customerEmail: '',
      items: [{ description: '', quantity: 1, price: 0 }],
      taxRate: 0,
      currency: 'USD',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const watchTaxRate = watch("taxRate");
  const watchCurrency = watch("currency");

  useEffect(() => {
    async function fetchCredits() {
      if (user) {
        const credits = await getUserCredits(user.uid);
        setUserCredits(credits);
      }
    }
    fetchCredits();
  }, [user]);

  const calculateSubtotal = () => {
    return watchItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (watchTaxRate / 100);
    return subtotal + taxAmount;
  };

  const generatePDF = (data: InvoiceFormData) => {
    const doc = new jsPDF();

    // Add invoice header
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);

    doc.text(`Customer: ${data.customerName}`, 20, 70);
    doc.text(`Email: ${data.customerEmail}`, 20, 80);

    // Add invoice items
    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Quantity', 'Price', 'Total']],
      body: data.items.map(item => [
        item.description,
        item.quantity.toString(),
        `${data.currency} ${item.price.toFixed(2)}`,
        `${data.currency} ${(item.quantity * item.price).toFixed(2)}`
      ]),
      foot: [
        ['', '', 'Subtotal', `${data.currency} ${calculateSubtotal().toFixed(2)}`],
        ['', '', 'Tax', `${data.currency} ${(calculateSubtotal() * data.taxRate / 100).toFixed(2)}`],
        ['', '', 'Total', `${data.currency} ${calculateTotal().toFixed(2)}`],
      ],
    });

    // Save the PDF
    doc.save(`Invoice_${data.invoiceNumber}.pdf`);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (userCredits === null || userCredits < INVOICE_GENERATION_COST) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${INVOICE_GENERATION_COST} credits to generate an invoice. Please add more credits.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Deduct credits first
      await deductCredits(user.uid, INVOICE_GENERATION_COST);
      setUserCredits(prevCredits => prevCredits !== null ? Math.max(prevCredits - INVOICE_GENERATION_COST, 0) : null);

      generatePDF(data);
      toast({
        title: "Success",
        description: `Invoice generated successfully! ${INVOICE_GENERATION_COST} credits have been deducted from your account.`,
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-grow mb-6 lg:mb-0 lg:mr-6">
        <h1 className="text-2xl font-bold mb-4">Invoice Generator</h1>
        <Card className="bg-card shadow-md rounded-lg overflow-hidden mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Controller
                    name="invoiceNumber"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Controller
                    name="customerEmail"
                    control={control}
                    render={({ field }) => <Input {...field} type="email" />}
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label>Invoice Items</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <Controller
                      name={`items.${index}.description`}
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="Description" />}
                    />
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field }) => <Input {...field} type="number" placeholder="Quantity" />}
                    />
                    <Controller
                      name={`items.${index}.price`}
                      control={control}
                      render={({ field }) => <Input {...field} type="number" placeholder="Price" />}
                    />
                    <Button type="button" onClick={() => remove(index)} size="icon" variant="ghost">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => append({ description: '', quantity: 1, price: 0 })} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Controller
                    name="taxRate"
                    control={control}
                    render={({ field }) => <Input {...field} type="number" />}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="text-right mb-4">
                <strong>Total: {calculateTotal().toFixed(2)} {watchCurrency}</strong>
              </div>

              <div className="flex justify-between items-center mt-4">
                {userCredits !== null && (
                  <p className="text-sm text-muted-foreground">
                    Your current balance: {userCredits} credits
                  </p>
                )}
                <Button 
                  type="submit"
                  disabled={isLoading || (userCredits !== null && userCredits < INVOICE_GENERATION_COST)}
                >
                  <Download className="mr-2 h-4 w-4" /> 
                  {isLoading ? 'Generating...' : `Generate Invoice (${INVOICE_GENERATION_COST} credits)`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="w-full lg:w-auto">
        <Toolbar />
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}