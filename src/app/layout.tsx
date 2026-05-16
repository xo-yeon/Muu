import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muu | 오늘의 인간 상태 분석',
  description: '귀여운 픽셀 감성으로 확인하는 오늘의 내 상태. 15개 질문을 통해 당신의 인간 유형과 행동 패턴을 분석해 드립니다.',
  keywords: ['Muu', '감정 체크', '인간 유형', '픽셀 아트', '자기 관찰', '심리 테스트', 'MBTI', '상태 리포트', '감정 기록'],
  authors: [{ name: 'Muu Team' }],
  openGraph: {
    title: 'Muu | 오늘의 인간 상태 분석',
    description: '귀여운 화면에 속지 마세요. 결과는 꽤 현실적으로 말합니다.',
    url: 'https://muu-app.vercel.app', // 예시 URL, 필요시 변경 가능
    siteName: 'Muu',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Muu 오늘의 인간 상태 분석',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muu | 오늘의 인간 상태 분석',
    description: '귀여운 픽셀 감성으로 확인하는 오늘의 내 상태.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#DDF8E8'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
