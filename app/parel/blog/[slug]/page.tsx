import BlogPostPage, { generateMetadata as sharedGenerateMetadata } from '@/app/components/BlogPostPage';

export const generateMetadata = sharedGenerateMetadata;

export default function ParelBlogPostPage(props: { params: { slug: string } }) {
  return <BlogPostPage {...props} society="parel" />;
} 