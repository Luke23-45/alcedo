import { PostDetailScreen } from '@/components/presentation/feed/post-detail';
import { useLocalSearchParams } from 'expo-router';

export default function FeedItemPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PostDetailScreen postId={id} />;
}
