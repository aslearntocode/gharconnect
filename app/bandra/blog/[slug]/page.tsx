import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export async function generateMetadata(props: any): Promise<Metadata> {
  return sharedGenerateMetadata({ ...props, society: 'bandra' });
}

export default async function BandraBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="bandra" />;
} 