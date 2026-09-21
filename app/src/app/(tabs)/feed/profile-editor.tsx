import { ProfileEditorScreen } from '@/components/smart/profile-editor-screen';
import { useLocalSearchParams } from 'expo-router';

export default function FeedProfileEditorPage() {
  const { focusPublish } = useLocalSearchParams<{ focusPublish?: string }>();
  return <ProfileEditorScreen focusPublish={!!focusPublish} />;
}
