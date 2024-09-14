import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { usePricingDialog } from '@/context/PricingDialogContext';

const features = [
  "Access to all tools",
  "10 GB storage",
  "Priority email support",
  "Monthly reports"
];

export default function PricingDialog() {
  const { isPricingOpen, setIsPricingOpen } = usePricingDialog();

  return (
    <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="flex">
          <div className="w-1/2 bg-gray-100">
            <Image
              src="/images/marketing/success.svg"
              alt="Success"
              width={400}
              height={400}
              className="h-full object-cover"
            />
          </div>
          <div className="w-1/2 p-8">
            <h2 className="text-xl font-bold mb-4">Upgrade to Juju Pro</h2>
            <p className="text-sm text-gray-600 mb-6">
              Create without limits by upgrading to an unlimited plan.
            </p>
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4 mb-6">
              <div className="border rounded-lg p-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Annual</span>
                  <div className="text-right">
                    <span className="text-lg font-bold">$6.00/mo</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$12.00</span>
                  </div>
                </div>
                <span className="text-sm text-green-500 mt-1 block">Save 60%</span>
              </div>
              <div className="border rounded-lg p-4 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Monthly</span>
                  <div className="text-right">
                    <span className="text-lg font-bold">$15.00/mo</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$30.00</span>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full" variant="default">
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}