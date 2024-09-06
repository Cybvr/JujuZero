// File: app/dashboard/projects/components/ExportOptions.tsx
import React from 'react';

export default function ExportOptions({ projectId }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Export Options</h2>
      <button className="px-4 py-2 bg-green-500 text-white rounded">
        Export Project
      </button>
    </div>
  );
}