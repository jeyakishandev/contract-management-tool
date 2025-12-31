import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Contract Management Tool',
  description: 'Gestion des contrats et obligations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}



