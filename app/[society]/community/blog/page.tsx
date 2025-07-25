import BlogPage from '@/app/components/BlogPage';

interface CommunityBlogPageProps {
  params: Promise<{
    society: string;
  }>;
}

export default async function CommunityBlogPage({ params }: CommunityBlogPageProps) {
  const { society } = await params;
  return <BlogPage society={society} />;
} 