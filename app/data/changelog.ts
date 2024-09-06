// /app/data/changelog.ts

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelogData: ChangelogEntry[] = [
  {
    version: "3.0.0",
    date: "2023-07-15",
    changes: [
      "Migrated from React.js to Next.js 13+ for improved performance and SEO",
      "Implemented new responsive sidebar with collapsible functionality",
      "Integrated Radix UI and shadcn/ui components for enhanced UI/UX",
      "Improved accessibility with ARIA attributes and keyboard navigation",
      "Added dark mode support",
      "Performance optimizations for faster load times"
    ]
  },
  {
    version: "2.5.0",
    date: "2023-05-01",
    changes: [
      "Introduced new dashboard layout with customizable widgets",
      "Added support for multiple file uploads in the media manager",
      "Implemented real-time collaboration features for team projects",
      "Enhanced security with two-factor authentication",
      "Improved error handling and user feedback mechanisms",
      "Optimized database queries for faster data retrieval"
    ]
  },
  // Add more entries here as needed
];