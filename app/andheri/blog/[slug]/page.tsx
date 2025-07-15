import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export async function generateMetadata(props: any): Promise<Metadata> {
  return sharedGenerateMetadata({ ...props, society: 'andheri' });
}

export default async function AndheriBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="andheri" />;
} 