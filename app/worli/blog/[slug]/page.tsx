import BlogPostPage from '@/app/components/BlogPostPage';

interface WorliBlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function WorliBlogPostPage({ params }: WorliBlogPostPageProps) {
  return <BlogPostPage params={params} society="worli" />;
} 