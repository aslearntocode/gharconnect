import type { Metadata } from 'next';
import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    society: string;
  }>;
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const { society } = await props.params;
  return sharedGenerateMetadata({ ...props, society });
}

export default async function DynamicBlogPostPage(props: BlogPostPageProps) {
  const { society } = await props.params;
  return <BlogPostPage {...props} society={society} />;
} 