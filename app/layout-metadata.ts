// app/layout-metadata
import { Metadata } from 'next'; 

export const metadata: Metadata = {
  title: 'Juju: Simple tools for simple tasks',
  description: 'Juju is your all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features.',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    title: 'Juju: Simple tools for simple tasks',
    description: 'Juju is your all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features.',
    images: [{ url: 'https://jujuagi.com/images/logos/cover.png' }],
    url: 'https://jujuagi.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juju: Simple tools for everyone',
    description: 'Juju is your all-in-one platform for file conversion and editing tasks. We offer a suite of tools including PDF conversion, image editing, text tools, data conversion, and AI-powered features.',
    images: ['https://jujuagi.com/images/marketing/feature1.png'],
  },
};