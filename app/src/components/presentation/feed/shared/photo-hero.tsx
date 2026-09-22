import * as S from './media-hero.styles';

/**
 * Photo hero: the bundled photo fills the poster slot edge-to-edge,
 * cover-cropped, with the poster's edge stroke. Photographs do not theme in
 * light mode.
 */
export function PhotoHero({ photo, a11yLabel }: { photo: number; a11yLabel: string }) {
  return (
    <S.ShadowWrap>
      <S.MediaFrame accessibilityRole="image" accessibilityLabel={a11yLabel}>
        <S.Photo source={photo} resizeMode="cover" />
        <S.Edge />
      </S.MediaFrame>
    </S.ShadowWrap>
  );
}
