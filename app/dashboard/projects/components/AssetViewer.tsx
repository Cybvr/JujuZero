// File: app/dashboard/projects/components/AssetViewer.tsx
import React from 'react';

export default function AssetViewer({ projectId, assetId }) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Asset Viewer</h3>
      {assetId ? (
        <p>Viewing asset {assetId} for project {projectId}</p>
      ) : (
        <p>Select an asset to view its details</p>
      )}
      {/* Placeholder for actual asset viewing/editing functionality */}
    </div>
  );
}