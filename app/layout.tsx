import './cb-parel/globals.css';

export const metadata = {
  title: 'GharConnect',
  description: 'Your one-stop platform for societies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
} 