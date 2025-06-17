import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export function generateMetadata(props: any): Metadata {
  return sharedGenerateMetadata({ ...props, society: 'worli' });
}

export default function WorliBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="worli" />;
} 