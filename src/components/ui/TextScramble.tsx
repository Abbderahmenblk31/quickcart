'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sound } from '@/lib/audio/sound-fx';

const GLYPHS = '0123456789_//[]#><*~XYZ';

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

export function TextScramble({ text, className = '', triggerOnHover = true }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<any>(null);

  const scramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    sound.playClick(1100);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }

      iteration += 1 / 2;
    }, 28);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <span
      onMouseEnter={triggerOnHover ? scramble : undefined}
      className={`font-mono select-none ${className}`}
    >
      {displayText}
    </span>
  );
}
