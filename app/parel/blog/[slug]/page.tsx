import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export function generateMetadata(props: { params: { slug: string } }): Metadata {
  return sharedGenerateMetadata({ ...props, society: 'parel' });
}

export default function ParelBlogPostPage(props: { params: { slug: string } }) {
  return <BlogPostPage {...props} society="parel" />;
} 