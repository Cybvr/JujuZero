import { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import { metadata as layoutMetadata } from './layout-metadata';

export const metadata: Metadata = layoutMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode 
}) {
  return <ClientLayout>{children}</ClientLayout>;
}