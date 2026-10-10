import type { ReactNode } from 'react';
import { cn } from '@/lib/ui/cn';

export interface BoardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tray?: boolean;
  as?: 'section' | 'div';
}

/**
 * Ardoise accrochée sur la page : cadre de chêne, surface poudrée de craie,
 * rebord où repose la craie. Le texte à l'intérieur passe en craie.
 */
export function Board({
  children,
  className,
  innerClassName,
  tray = true,
  as: Tag = 'section',
}: BoardProps) {
  return (
    <Tag className={cn('board', className)}>
      <div className={cn('board-surface', innerClassName)}>{children}</div>
      {tray && (
        <div className="chalk-tray" aria-hidden="true">
          <span className="bg-chalk absolute -top-[5px] left-[12%] h-[7px] w-9 rounded-[2px]" />
          <span className="bg-chalk-yellow absolute -top-[5px] left-[calc(12%+2.6rem)] h-[7px] w-6 rounded-[2px]" />
          <span className="bg-oak-300 absolute -top-[9px] right-[10%] h-[11px] w-14 rounded-[2px] shadow-xs" />
        </div>
      )}
    </Tag>
  );
}
