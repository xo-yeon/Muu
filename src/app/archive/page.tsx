import type { Metadata } from 'next';
import { ArchiveScreen } from '@/components/ArchiveScreen';

export const metadata: Metadata = {
  title: 'Muu Archive | 감정 기록',
  description: '날짜별로 저장된 Muu 감정 기록과 인간 유형을 확인합니다.'
};

export default function ArchivePage() {
  return <ArchiveScreen />;
}
