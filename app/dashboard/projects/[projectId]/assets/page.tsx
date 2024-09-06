// File: app/dashboard/projects/[projectId]/assets/page.tsx
import React from 'react';
import { useParams } from 'next/navigation';
import AssetViewer from '../../components/AssetViewer';

export default function ProjectAssets() {
  const { projectId } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Assets</h1>
      <AssetViewer projectId={projectId} />
    </div>
  );
}