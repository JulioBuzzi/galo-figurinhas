'use client';

import { UserSticker, StickerStatus } from '@/lib/types';
import { Check, X } from 'lucide-react';

interface Props {
  sticker: UserSticker;
  onStatusChange?: (stickerId: number, status: StickerStatus) => void;
  loading?: boolean;
}

export default function StickerCard({ sticker, onStatusChange, loading }: Props) {
  const isTenho   = sticker.status === 'TENHO';
  const hasRepeat = (sticker.repeatedCount ?? 0) > 0;

  // Borda: verde=tenho, vermelho=não tenho, amarelo dourado=tem repetida
  const borderStyle = isTenho
    ? hasRepeat
      ? { borderColor: '#C4A135', backgroundColor: 'rgba(196,161,53,0.08)' }
      : { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' }
    : { borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.06)' };

  return (
    <div
      onClick={() => !loading && onStatusChange?.(sticker.stickerId, isTenho ? 'NAO_TENHO' : 'TENHO')}
      style={borderStyle}
      className={`relative border-2 rounded-xl p-2 transition-all duration-150 cursor-pointer
                  ${loading ? 'opacity-40 pointer-events-none' : 'hover:shadow-md hover:scale-105 active:scale-95'}`}
    >
      {/* Código */}
      <p className="text-[10px] font-mono font-bold text-gray-600 truncate leading-tight">
        {sticker.code}
      </p>

      {/* Badge repetidas */}
      {hasRepeat && (
        <span className="absolute -top-2 -right-2 text-galo-black text-[9px]
                         font-black w-5 h-5 rounded-full flex items-center justify-center
                         shadow border border-white z-10"
              style={{ backgroundColor: '#C4A135' }}>
          {sticker.repeatedCount}
        </span>
      )}

      {/* Ícone status */}
      <div className={`mt-1.5 w-5 h-5 rounded-full mx-auto flex items-center justify-center
        ${isTenho ? 'bg-green-500' : 'bg-red-400'}`}>
        {isTenho
          ? <Check size={11} className="text-white" strokeWidth={3} />
          : <X     size={11} className="text-white" strokeWidth={3} />}
      </div>
    </div>
  );
}
