import type { Metadata } from 'next';
import { DecisionLab } from '@/components/DecisionLab';

export const metadata: Metadata = {
  title: 'Decision Lab | Muu 결정 실험실',
  description: '현재 인간 유형과 감정 상태를 바탕으로 고민 중인 선택지를 비교합니다.'
};

export default function DecisionLabPage() {
  return <DecisionLab />;
}
