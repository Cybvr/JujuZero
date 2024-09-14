// @app/dashboard/projects/[projectId]/assets/page.tsx
import React from 'react';
import { useParams } from 'next/navigation';
import AssetViewer from '../../components/AssetViewer';

export default function ProjectAssetsPage() {
  const { projectId } = useParams();

  return (
    <div className="project-assets-page p-6">
      <h1 className="text-xl font-bold mb-6">Project Assets</h1>
      <AssetViewer projectId={projectId as string} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Asset</h2>
        <form className="flex items-center space-x-4">
          <input type="file" className="border p-2 rounded" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}