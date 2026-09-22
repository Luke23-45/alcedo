import { useTranslate } from '@tolgee/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { restartChat } from '@/store/ai-planner';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Purchases, { PRODUCT_CATEGORY, PurchasesStoreProduct } from 'react-native-purchases';
import { setProToken } from '@/store/settings';
import { IndeterminateProgress } from '@/components/presentation/foundation/indeterminate-progress';
import * as S from './pro-prompt.styles';

export function ProPrompt() {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const upgrade = () => {
    const run = async () => {
      if (__DEV__) {
        dispatch(setProToken('test-web-auth-key-12345'));
        dispatch(restartChat());
        return;
      }
      const owned = await presentPaywall();
      if (owned) {
        const info = await Purchases.getCustomerInfo();
        dispatch(setProToken(info.originalAppUserId));
        dispatch(restartChat());
      }
    };
    run().catch(console.error);
  };
  return (
    <S.ProBody>
      <S.ProEyebrow>{t('ai.upgrade_to_pro.eyebrow')}</S.ProEyebrow>
      <S.ProTitle>{t('ai.upgrade_to_pro.title')}</S.ProTitle>
      <S.ProDescription>
        <LimitedHtml value={t('ai.upgrade_to_pro.explanation')} />
      </S.ProDescription>
      <ProPrice />
      <S.UpgradeTouch
        onPress={upgrade}
        accessibilityRole="button"
        accessibilityLabel={t('generic.upgrade.button')}
      >
        <S.UpgradeGradient
          colors={[...S.PRO_PURPLE]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <S.UpgradeLabel>{t('generic.upgrade.button')}</S.UpgradeLabel>
        </S.UpgradeGradient>
      </S.UpgradeTouch>
    </S.ProBody>
  );
}

function ProPrice() {
  const [product, setProduct] = useState<PurchasesStoreProduct>();

  useEffect(() => {
    Purchases.getProducts(['pro'], PRODUCT_CATEGORY.NON_SUBSCRIPTION)
      .then((v) => {
        setProduct(v[0]);
      })
      .catch(console.error);
  }, []);
  if (!product) {
    return (
      <S.ProPriceWrap>
        <IndeterminateProgress />
      </S.ProPriceWrap>
    );
  }

  return <S.ProPriceText>{product.priceString}</S.ProPriceText>;
}

async function presentPaywall(): Promise<boolean> {
  const customer = await Purchases.getCustomerInfo();
  if (customer.entitlements.active['pro']) {
    return true;
  }
  try {
    const restore = await Purchases.restorePurchases();
    if (restore.entitlements.active['pro']) {
      return true;
    }
  } catch (err) {
    console.log('Failed to restore purchases', err, customer.originalAppUserId);
  }
  // Present paywall for current offering:
  const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

  switch (paywallResult) {
    case PAYWALL_RESULT.NOT_PRESENTED:
    case PAYWALL_RESULT.ERROR:
    case PAYWALL_RESULT.CANCELLED:
      return false;
    case PAYWALL_RESULT.PURCHASED:
    case PAYWALL_RESULT.RESTORED:
      return true;
    default:
      return false;
  }
}
