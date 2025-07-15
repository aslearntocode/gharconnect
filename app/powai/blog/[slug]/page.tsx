import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export async function generateMetadata(props: any): Promise<Metadata> {
  return sharedGenerateMetadata({ ...props, society: 'powai' });
}

export default async function PowaiBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="powai" />;
} 