import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export function generateMetadata(props: any): Metadata {
  return sharedGenerateMetadata({ ...props, society: 'parel' });
}

export default function ParelBlogPostPage(props: any) {
  return <BlogPostPage {...props} society="parel" />;
} 