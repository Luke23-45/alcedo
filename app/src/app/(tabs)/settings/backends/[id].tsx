import { SettingsPage } from '@/components/layout/settings-page';
import { BackendHeaderEditor } from '@/components/presentation/backends/backend-header-editor';
import { ConnectionCard } from '@/components/presentation/backends/connection-card';
import { KindSection } from '@/components/presentation/backends/kind-section';
import { ProbeStatusCard } from '@/components/presentation/backends/probe-status-card';
import { PageActions } from '@/components/presentation/foundation/page-actions';
import {
  Backend,
  backendFeatureNameKey,
  backendUrlIsValid,
  BackendKind,
  normalizeBackendUrl,
  ReportedBackendFeature,
} from '@/models/backend';
import {
  BackendProbeFailure,
  BackendProbeResult,
  probeBackendFeatures,
  probeBackupEndpoint,
} from '@/services/backend-probe';
import { useAppSelector } from '@/store';
import { putBackend, removeBackend } from '@/store/backends';
import { useTranslate } from '@tolgee/react';
import type { TranslationKey } from '@tolgee/web';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import ExperimentIcon from '@expo/material-symbols/experiment.xml';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import * as S from '@/components/presentation/backends/backend-editor.styles';

const kindOptions = [
  { value: 'liftlog', label: 'backends.kind.liftlog.label', body: 'backends.kind.liftlog.body' },
  {
    value: 'backupEndpoint',
    label: 'backends.kind.backup_endpoint.label',
    body: 'backends.kind.backup_endpoint.body',
  },
] as const satisfies { value: BackendKind; label: TranslationKey; body: TranslationKey }[];

type ProbeState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'done'; ok: boolean; title: string; body: string };

/** HTTP/2 has no reason phrase, so the code stands alone rather than trailing a space. */
const statusLabel = (statusCode: number, statusText: string) => [statusCode, statusText].filter(Boolean).join(' ');

/** What a test result is a result for: the same values tested again would answer the same. */
const probeSignatureOf = (backend: Backend) => JSON.stringify([backend.url, backend.kind, backend.headers]);

export default function BackendEditorPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const backend = useAppSelector((s) => s.backends.backends.find((x) => x.id === id));
  if (!backend) {
    return <Redirect href={'/settings/backends'} />;
  }
  return <BackendEditor backend={backend} />;
}

function BackendEditor({ backend }: { backend: Backend }) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();
  const [probe, setProbe] = useState<ProbeState>({ status: 'idle' });

  const update = (changes: Partial<Backend>) => dispatch(putBackend({ ...backend, ...changes }));

  const nameError = backend.name.trim() ? '' : t('backends.name.required.message');
  const urlError = !backend.url.trim()
    ? t('backends.url.required.message')
    : backendUrlIsValid(backend.url)
      ? ''
      : t('backends.url.error.message');
  const canTest = backendUrlIsValid(backend.url);

  // A result is a result for the values it was run against, so editing them retires it.
  const probeSignature = probeSignatureOf(backend);
  useEffect(() => setProbe((current) => (current.status === 'idle' ? current : { status: 'idle' })), [probeSignature]);

  // Adding a backend creates it, so one that was opened and never filled in was never really added.
  const latest = useRef(backend);
  useEffect(() => {
    latest.current = backend;
  }, [backend]);
  useEffect(
    () => () => {
      const abandoned = latest.current;
      if (!abandoned.name.trim() && !abandoned.url.trim()) {
        dispatch(removeBackend(abandoned.id));
      }
    },
    [dispatch],
  );

  // A server is free to report a feature this version has never heard of, and its own id is the
  // most useful thing we can show for it.
  const featureName = (feature: string) =>
    feature in backendFeatureNameKey ? t(backendFeatureNameKey[feature as ReportedBackendFeature]) : feature;

  // A failed test is only useful if it says what the server did, so every line we have is shown.
  const lines = (...parts: (string | undefined)[]) => parts.filter(Boolean).join('\n');

  const describeFailure = (failure: BackendProbeFailure) => {
    switch (failure.kind) {
      case 'httpError':
        return t('backends.test.http_error', { status: statusLabel(failure.statusCode, failure.statusText) });
      case 'notJson':
        return failure.contentType
          ? t('backends.test.not_json_content_type', { contentType: failure.contentType })
          : t('backends.test.not_json');
      case 'notFeatureObject':
        return t('backends.test.not_feature_object');
    }
  };

  const describeUnreachable = (error: string) =>
    error ? t('backends.test.unreachable_detail', { error }) : t('backends.test.unreachable');

  const describeBody = (body: string) => (body ? t('backends.test.response_body', { body }) : undefined);

  const describeProbe = (result: BackendProbeResult) => {
    switch (result.status) {
      case 'ok':
        return t('backends.test.offers', { features: result.features.map(featureName).join(', ') });
      case 'notLiftLog':
        return lines(
          describeFailure(result.failure),
          describeBody(result.failure.body),
          t('backends.test.not_liftlog'),
        );
      case 'unreachable':
        return describeUnreachable(result.error);
    }
  };

  const test = async () => {
    setProbe({ status: 'checking' });
    // A backup endpoint has no /features to ask, so it is checked the only way the protocol allows.
    if (backend.kind === 'backupEndpoint') {
      const result = await probeBackupEndpoint(backend);
      const ok = result.status === 'ok';
      setProbe({
        status: 'done',
        ok,
        title: t(ok ? 'backends.test.connected' : 'backends.test.failed'),
        body:
          result.status === 'ok'
            ? t('backends.test.backup_ok')
            : result.status === 'refused'
              ? lines(
                  t('backends.test.backup_refused', {
                    status: statusLabel(result.statusCode, result.statusText),
                  }),
                  describeBody(result.body),
                )
              : describeUnreachable(result.error),
      });
      return;
    }
    const result = await probeBackendFeatures(backend);
    const ok = result.status === 'ok';
    setProbe({
      status: 'done',
      ok,
      title: t(ok ? 'backends.test.connected' : 'backends.test.failed'),
      body: describeProbe(result),
    });
  };

  const confirmDelete = () => {
    Alert.alert(t('backends.delete.title'), t('backends.delete.message'), [
      { text: t('generic.cancel.button'), style: 'cancel' },
      {
        text: t('generic.delete.button'),
        style: 'destructive',
        onPress: () => {
          dispatch(removeBackend(backend.id));
          router.back();
        },
      },
    ]);
  };

  const selectedKind = kindOptions.find((option) => option.value === backend.kind)!;

  return (
    <SettingsPage
      title={backend.name || t('backends.add.button')}
      actions={
        <PageActions
          primary={{
            disabled: !canTest || probe.status === 'checking',
            label: t('generic.test.button'),
            onPress: () => void test(),
            icon: ExperimentIcon,
            systemImage: 'flask',
          }}
        />
      }
    >
      <ConnectionCard
        nameField={{
          label: t('backends.name.label'),
          value: backend.name,
          error: nameError,
          onChange: (name) => update({ name }),
          onBlur: () => update({ name: backend.name.trim() }),
        }}
        urlField={{
          label: t('backends.url.label'),
          value: backend.url,
          error: urlError,
          placeholder: 'https://liftlog.example.com',
          autoCapitalize: 'none',
          keyboardType: 'url',
          onChange: (url) => update({ url }),
          onBlur: () => update({ url: normalizeBackendUrl(backend.url) }),
        }}
      />

      <KindSection
        value={backend.kind}
        options={kindOptions.map(({ value, label }) => ({ value, label: t(label) }))}
        supportingText={t(selectedKind.body)}
        onChange={(kind) => update({ kind })}
      />

      <BackendHeaderEditor headers={backend.headers} onChange={(headers) => update({ headers })} />

      {probe.status === 'idle' ? null : (
        <ProbeStatusCard probe={probe} checkingLabel={t('backends.test.checking')} />
      )}

      <S.DeleteRow onPress={confirmDelete} accessibilityRole="button">
        <S.DeleteLabel>{t('backends.delete.action')}</S.DeleteLabel>
      </S.DeleteRow>
    </SettingsPage>
  );
}
