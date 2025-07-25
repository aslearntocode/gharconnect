import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export async function generateMetadata(props: any): Promise<Metadata> {
  return sharedGenerateMetadata({ ...props, society: 'mumbai' });
}

export default async function MumbaiBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="mumbai" />;
} 