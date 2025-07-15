import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export async function generateMetadata(props: any): Promise<Metadata> {
  return sharedGenerateMetadata({ ...props, society: 'worli' });
}

export default async function WorliBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="worli" />;
} 