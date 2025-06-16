import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Andheri Communities - Coming Soon | GharConnect',
  description: 'Andheri communities are being onboarded to GharConnect. Join us to stay connected with your neighborhood.',
};

export default function AndheriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
