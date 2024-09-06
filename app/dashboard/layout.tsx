// app/dashboard/layout.tsx

"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PricingDialog from '@/components/dashboard/PricingDialog';
import { PricingDialogProvider } from '@/context/PricingDialogContext';
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <PricingDialogProvider>
      <div className="flex h-screen bg-white">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
            {children}
          </main>
          <div className="fixed bottom-0 left-0 right-0 md:hidden" style={{ paddingBottom: '30px' }}>
            <ComboboxDemo />
          </div>
        </div>
      </div>
      <PricingDialog />
    </PricingDialogProvider>
  );
}