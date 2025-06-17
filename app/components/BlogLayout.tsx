import { ReactNode } from 'react';
import Header from '@/components/Header';

interface BlogLayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Blog Content */}
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
} 