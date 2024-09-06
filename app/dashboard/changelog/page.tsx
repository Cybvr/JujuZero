// /app/dashboard/changelog/page.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { changelogData, ChangelogEntry } from '../../data/changelog';

const ChangelogPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Changelog</h1>
      {changelogData.map((entry: ChangelogEntry, index: number) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>Version {entry.version} - {entry.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {entry.changes.map((change: string, changeIndex: number) => (
                <li key={changeIndex}>{change}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChangelogPage;