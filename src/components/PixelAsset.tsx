'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import styles from './PixelAsset.module.css';

type PixelAssetProps = {
  alt: string;
  fallback: ReactNode;
  src?: string;
  variant: 'home' | 'item';
};

export function PixelAsset({ alt, fallback, src, variant }: PixelAssetProps) {
  const [failed, setFailed] = useState(false);
  const className = `${styles.image} ${styles[variant]}`;

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    <Image
      unoptimized
      alt={alt}
      className={className}
      height={96}
      src={src}
      width={96}
      onError={() => setFailed(true)}
    />
  );
}
