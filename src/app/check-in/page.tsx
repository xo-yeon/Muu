import type { Metadata } from 'next';
import { CheckInApp } from '@/components/CheckInApp';

type CheckInPageProps = {
  searchParams?: Promise<{
    restore?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: 'Muu Check-in | 오늘의 인간 상태 분석',
  description: '12개 질문과 감정 태그로 오늘의 인간 유형과 상태 리포트를 확인합니다.'
};

export default async function CheckInPage({ searchParams }: CheckInPageProps) {
  const params = await searchParams;
  const restore = params?.restore;
  const restoreLastOnMount = Array.isArray(restore) ? restore.includes('last') : restore === 'last';

  return <CheckInApp restoreLastOnMount={restoreLastOnMount} />;
}
