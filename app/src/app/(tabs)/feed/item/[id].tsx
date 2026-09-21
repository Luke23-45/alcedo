import { PostDetailScreen } from '@/components/presentation/feed/post-detail';
import { useServices } from '@/components/smart/services-provider';
import { useLocalSearchParams } from 'expo-router';

export default function FeedItemPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { keyValueStore } = useServices();

  return <PostDetailScreen postId={id ?? ''} keyValueStore={keyValueStore} />;
}
