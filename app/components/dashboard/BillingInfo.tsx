// @app/components/dashboard/BillingInfo.tsx

import React from 'react';

interface BillingInfoProps {
  plan: string;
  status: string;
  renewalDate: string;
}

const BillingInfo: React.FC<BillingInfoProps> = ({ plan, status, renewalDate }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <p><strong>Plan:</strong> {plan}</p>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Renewal Date:</strong> {renewalDate}</p>
    </div>
  );
};

export default BillingInfo;