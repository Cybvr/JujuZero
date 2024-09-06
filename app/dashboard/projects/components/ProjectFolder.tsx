// File: app/dashboard/projects/components/ProjectFolder.tsx
import React from 'react';
import Link from 'next/link';

export default function ProjectFolder({ projectId, assets }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <div key={asset.id} className="border rounded p-4 hover:shadow-md transition duration-300">
          <h3 className="font-semibold mb-2">{asset.name}</h3>
          <p className="text-sm text-gray-500 mb-2">Type: {asset.type}</p>
          <Link 
            href={`/dashboard/projects/${projectId}/assets/${asset.id}`}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            View Asset
          </Link>
        </div>
      ))}
    </div>
  );
}