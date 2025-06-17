import BlogPostPage from '@/app/components/BlogPostPage';

interface ParelBlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function ParelBlogPostPage({ params }: ParelBlogPostPageProps) {
  return <BlogPostPage params={params} society="parel" />;
} 