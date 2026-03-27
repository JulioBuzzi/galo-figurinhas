'use client';

import { UserSticker } from '@/lib/types';
import { Check, X } from 'lucide-react';

interface Props {
  sticker: UserSticker;
  onToggle?: (stickerId: number) => void;
  loading?: boolean;
}

export default function StickerCard({ sticker, onToggle, loading }: Props) {
  const isOwned   = sticker.owned;
  const hasRepeat = (sticker.repeatedCount ?? 0) > 0;

  const borderStyle = isOwned
    ? hasRepeat
      ? { borderColor: '#C4A135', backgroundColor: 'rgba(196,161,53,0.08)' }
      : { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' }
    : { borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)' };

  return (
    <div
      onClick={() => !loading && onToggle?.(sticker.stickerId)}
      style={borderStyle}
      className={`relative border-2 rounded-xl p-2 transition-all duration-150 cursor-pointer
                  select-none
                  ${loading
                    ? 'opacity-40 pointer-events-none'
                    : 'hover:shadow-md hover:scale-105 active:scale-95'}`}
    >
      <p className="text-[10px] font-mono font-bold text-gray-500 truncate leading-tight">
        {sticker.code}
      </p>

      {/* Badge de repetidas */}
      {hasRepeat && (
        <span className="absolute -top-2 -right-2 text-galo-black text-[9px]
                         font-black w-5 h-5 rounded-full flex items-center justify-center
                         shadow border border-white z-10"
              style={{ backgroundColor: '#C4A135' }}>
          {sticker.repeatedCount}
        </span>
      )}

      <div className={`mt-1.5 w-5 h-5 rounded-full mx-auto flex items-center justify-center
        ${isOwned ? 'bg-green-500' : 'bg-red-400'}`}>
        {isOwned
          ? <Check size={11} className="text-white" strokeWidth={3} />
          : <X     size={11} className="text-white" strokeWidth={3} />}
      </div>
    </div>
  );
}