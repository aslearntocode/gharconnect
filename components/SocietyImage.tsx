"use client";
import React, { useState } from 'react';

export default function SocietyImage({ src, alt, ...props }: { src: string, alt: string, className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc('/images/societies/fallback.jpg')}
      {...props}
    />
  );
} 