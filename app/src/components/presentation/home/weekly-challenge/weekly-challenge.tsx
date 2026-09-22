import { useTranslate } from '@tolgee/react';
import { Fragment } from 'react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import { SampleBadge } from '../shared/sample-badge';
import * as S from './weekly-challenge.styles';

interface Challenger {
  name: string;
  score: string;
  avatarColor: string;
  you: boolean;
  leader: boolean;
}

/**
 * Reference challenge card: 361×140, 15.5/600 title, 3 DAYS LEFT chip,
 * 28pt leaderboard rows with r13 avatars and a highlighted "You" row.
 * This is a sample social fixture, so it always carries a Sample badge.
 */
export function WeeklyChallengeSection() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const titleColor = dark ? '#FFFFFF' : '#1C1C1E';
  const chipColor = dark ? '#FFB84D' : '#C93400';
  const rankColor = dark ? '#6C6C70' : '#AEAEB2';
  const nameColor = dark ? '#FFFFFF' : '#1C1C1E';
  const leaderColor = dark ? '#FFB84D' : '#C93400';
  const youAccent = '#FF6A88';

  const challengers: Challenger[] = [
    {
      name: t('home.weekly_challenge.first_name') /* en: "Mia Chen" */,
      score: t('home.weekly_challenge.first_score') /* en: "12,480" */,
      avatarColor: '#FF5AC8',
      you: false,
      leader: true,
    },
    {
      name: t('home.weekly_challenge.second_name') /* en: "Jon Reyes" */,
      score: t('home.weekly_challenge.second_score') /* en: "11,920" */,
      avatarColor: '#0A84FF',
      you: false,
      leader: false,
    },
    {
      name: t('home.weekly_challenge.you') /* en: "You" */,
      score: t('home.weekly_challenge.you_score') /* en: "10,340" */,
      avatarColor: '#FF2D55',
      you: true,
      leader: false,
    },
  ];

  return (
    <HomeCard radius={30} pad={20} style={{ minHeight: 140 }}>
      <S.HeaderRow>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.3}
          numberOfLines={1}
          style={{ fontSize: 15.5, lineHeight: 19, color: titleColor, flexShrink: 1 }}
        >
          {t('home.weekly_challenge.title') /* en: "Weekly Challenge" */}
        </HomeText>
        <S.RightGroup>
          <S.DaysChip>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={0.7}
              style={{ fontSize: 9, lineHeight: 11, color: chipColor }}
            >
              {t('home.weekly_challenge.days_left').toLocaleUpperCase() /* en: "3 DAYS LEFT" */}
            </HomeText>
          </S.DaysChip>
          <SampleBadge />
        </S.RightGroup>
      </S.HeaderRow>
      <S.Rows>
        {challengers.map((challenger, index) => {
          const scoreColor = challenger.you ? youAccent : challenger.leader ? leaderColor : nameColor;
          return (
            <Fragment key={challenger.name}>
              <S.Row>
                {challenger.you && <S.YouHighlight pointerEvents="none" />}
              <S.RankBox>
                <HomeText
                  weight={fontWeight.bold}
                  tabular
                  style={{
                    fontSize: 12,
                    lineHeight: 15,
                    color: challenger.you ? youAccent : rankColor,
                  }}
                >
                  {index + 1}
                </HomeText>
              </S.RankBox>
              {challenger.you ? (
                <S.AvatarBrand style={{ borderCurve: 'continuous' }}>
                  <S.AvatarRing pointerEvents="none" />
                  <HomeText weight={fontWeight.bold} style={{ fontSize: 10.5, lineHeight: 13, color: '#FFFFFF' }}>
                    {challenger.name.charAt(0)}
                  </HomeText>
                </S.AvatarBrand>
              ) : (
                <S.Avatar $color={challenger.avatarColor}>
                  <HomeText weight={fontWeight.semibold} style={{ fontSize: 10.5, lineHeight: 13, color: '#FFFFFF' }}>
                    {challenger.name.charAt(0)}
                  </HomeText>
                </S.Avatar>
              )}
              <S.NameWrap>
                <HomeText
                  weight={challenger.you ? fontWeight.bold : fontWeight.semibold}
                  tracking={-0.15}
                  numberOfLines={1}
                  style={{ fontSize: 12.5, lineHeight: 16, color: nameColor }}
                >
                  {challenger.name}
                </HomeText>
              </S.NameWrap>
              <HomeText
                weight={fontWeight.bold}
                tabular
                tracking={-0.2}
                style={{ fontSize: 12.5, lineHeight: 16, color: scoreColor }}
              >
                {challenger.score}
              </HomeText>
              </S.Row>
              {index < challengers.length - 1 && <S.Divider />}
            </>
          );
        })}
      </S.Rows>
    </HomeCard>
  );
}
