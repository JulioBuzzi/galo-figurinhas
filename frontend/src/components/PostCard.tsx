'use client';

import { Post } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';
import { Search, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  post: Post;
  currentUserId?: number;
  onDelete?: (postId: number) => void;
}

export default function PostCard({ post, currentUserId, onDelete }: Props) {
  const isOwner = currentUserId === post.userId;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 fade-in hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
               style={{ background: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)', border: '2px solid #C4A135' }}>
            {post.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{post.userName}</p>
            <p className="text-xs text-gray-400">{formatDistanceToNow(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && onDelete && (
          <button onClick={() => onDelete(post.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {post.text && <p className="text-gray-700 text-sm mb-4 leading-relaxed">{post.text}</p>}

      {post.wantedStickers.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mb-2">
            <Search size={12} /> Procurando ({post.wantedStickers.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.wantedStickers.map((s) => (
              <span key={s.id} className="bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">
                {s.code}
              </span>
            ))}
          </div>
        </div>
      )}

      {post.offeredStickers.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#C4A135' }}>
            <RefreshCw size={12} /> Para troca ({post.offeredStickers.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.offeredStickers.map((s) => (
              <span key={s.id} className="text-xs px-2.5 py-1 rounded-full font-medium border"
                    style={{ backgroundColor: 'rgba(196,161,53,0.1)', borderColor: 'rgba(196,161,53,0.4)', color: '#8a6f1e' }}>
                {s.code}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
