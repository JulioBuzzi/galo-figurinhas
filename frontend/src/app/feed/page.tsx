'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedLayout from '@/components/ProtectedLayout';
import PostCard from '@/components/PostCard';
import { Post, Sticker, CreatePostPayload } from '@/lib/types';
import { useAuthStore } from '@/contexts/authStore';
import api from '@/lib/api';
import { Plus, Loader2, Newspaper, X, Search, RefreshCw, Shield } from 'lucide-react';

export default function FeedPage() {
  const user = useAuthStore((s) => s.user);
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [text,     setText]     = useState('');
  const [wanted,   setWanted]   = useState<number[]>([]);
  const [offered,  setOffered]  = useState<number[]>([]);
  const [posting,  setPosting]  = useState(false);
  const [stickerQ, setStickerQ] = useState('');

  useEffect(() => {
    Promise.all([api.get('/api/posts'), api.get('/api/stickers')])
      .then(([p, s]) => { setPosts(p.data); setStickers(s.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggle = (id: number, list: number[], set: (v: number[]) => void) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const handleCreate = async () => {
    if (!text && !wanted.length && !offered.length) return;
    setPosting(true);
    try {
      const payload: CreatePostPayload = { text, wantedStickerIds: wanted, offeredStickerIds: offered };
      const { data } = await api.post('/api/posts', payload);
      setPosts((p) => [data, ...p]);
      setText(''); setWanted([]); setOffered([]); setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setPosting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deletar este post?')) return;
    try { await api.delete(`/api/posts/${id}`); setPosts((p) => p.filter((x) => x.id !== id)); }
    catch (err) { console.error(err); }
  };

  const filteredS = stickers.filter((s) =>
    stickerQ === '' ||
    s.code.toLowerCase().includes(stickerQ.toLowerCase()) ||
    s.team.toLowerCase().includes(stickerQ.toLowerCase())
  );

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-galo-black rounded-xl flex items-center justify-center shadow border border-galo-gold/30">
                <Newspaper className="text-galo-gold" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-galo-black">Feed</h1>
                <p className="text-xs text-gray-500">{posts.length} publicações</p>
              </div>
            </div>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-galo-black font-black px-4 py-2.5
                         rounded-xl text-sm transition-all shadow-lg"
              style={{ backgroundColor: '#C4A135' }}>
              <Plus size={16} /> Publicar
            </button>
          </div>

          {/* Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center
                            justify-center p-4" onClick={() => setShowForm(false)}>
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                   onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <h2 className="font-black text-galo-black">Nova Publicação</h2>
                  <button onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <textarea value={text} onChange={(e) => setText(e.target.value)}
                    placeholder="Ex: Tenho várias repetidas, alguém quer trocar?" rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:ring-2 focus:ring-galo-gold resize-none" />

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input value={stickerQ} onChange={(e) => setStickerQ(e.target.value)}
                      placeholder="Filtrar figurinhas..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-galo-gold" />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-100 rounded-xl p-2">
                    {filteredS.slice(0, 30).map((s) => (
                      <div key={s.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                        <div>
                          <span className="text-xs font-mono text-gray-400">{s.code}</span>
                          <span className="text-xs text-gray-500 ml-1">({s.team})</span>
                        </div>
                        <div className="flex gap-1.5 ml-2 shrink-0">
                          <button onClick={() => toggle(s.id, wanted, setWanted)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all
                              ${wanted.includes(s.id) ? 'bg-red-500 border-red-500 text-white' : 'border-red-300 text-red-400 hover:bg-red-50'}`}>
                            Quero
                          </button>
                          <button onClick={() => toggle(s.id, offered, setOffered)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all
                              ${offered.includes(s.id) ? 'text-galo-black border-transparent' : 'text-gray-400 hover:bg-yellow-50'}` }
                            style={ offered.includes(s.id) ? { backgroundColor: '#C4A135', borderColor: '#C4A135' } : { borderColor: '#C4A135' } }>
                            Troco
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(wanted.length > 0 || offered.length > 0) && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {wanted.length  > 0 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg font-bold">🔍 {wanted.length} procurando</span>}
                      {offered.length > 0 && <span className="font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(196,161,53,0.15)', color: '#8a6f1e' }}>🔄 {offered.length} para trocar</span>}
                    </div>
                  )}

                  <button onClick={handleCreate}
                    disabled={posting || (!text && !wanted.length && !offered.length)}
                    className="w-full font-black py-3 rounded-xl transition-all disabled:opacity-40
                               flex items-center justify-center gap-2 text-galo-black text-sm"
                    style={{ backgroundColor: '#C4A135' }}>
                    {posting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {posting ? 'Publicando...' : 'PUBLICAR'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 bg-galo-black rounded-xl flex items-center justify-center animate-pulse border border-galo-gold/30">
                <Shield className="text-galo-gold" size={24} fill="currentColor" />
              </div>
              <p className="text-gray-400 text-sm">Carregando feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Newspaper size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-bold text-gray-600">Nenhuma publicação ainda</p>
              <p className="text-sm mt-1">Seja o primeiro a publicar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} currentUserId={user?.userId} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedLayout>
  );
}
