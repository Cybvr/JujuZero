// @app/dashboard/projects/components/AssetViewer.tsx
import React from 'react';

interface AssetViewerProps {
  projectId: string;
  editable?: boolean;
}

const AssetViewer: React.FC<AssetViewerProps> = ({ projectId, editable = false }) => {
  return (
    <div className="asset-viewer">
      <h2 className="text-xl font-semibold mb-4">Assets for Project {projectId}</h2>
      <p>Asset list will be displayed here.</p>
      {editable && <p>Editable mode is enabled.</p>}
    </div>
  );
};

export default AssetViewer;