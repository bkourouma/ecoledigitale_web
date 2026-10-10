'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/ui/cn';

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      data-reveal
      className={className}
      {...rest}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.18 }}
      transition={{ duration: 0.36, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function RevealGroup({ children, className, ...rest }: RevealGroupProps) {
  return (
    <motion.div
      data-reveal
      className={cn(className)}
      {...rest}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function RevealItem({ children, className, ...rest }: RevealItemProps) {
  return (
    <motion.div
      data-reveal
      className={className}
      {...rest}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  );
}
