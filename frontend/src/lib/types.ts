export interface User {
  userId: number;
  name: string;
  email: string;
  token: string;
}

export type StickerStatus = 'TENHO' | 'NAO_TENHO';

export interface Sticker {
  id: number;
  code: string;
  name: string;
  team: string;
  albumNumber?: number;
}

export interface UserSticker {
  stickerId: number;
  code: string;
  name: string;
  team: string;
  albumNumber?: number;
  status: StickerStatus;
  repeatedCount: number;
  updatedAt?: string;
}

export interface AlbumProgress {
  total: number;
  tenho: number;
  naoTenho: number;
  comRepetidas: number;
  totalRepetidas: number;
  completionPercent: number;
}

export interface Post {
  id: number;
  userId: number;
  userName: string;
  text: string;
  wantedStickers: Sticker[];
  offeredStickers: Sticker[];
  createdAt: string;
}

export interface CreatePostPayload {
  text: string;
  wantedStickerIds: number[];
  offeredStickerIds: number[];
}

export interface Match {
  userId: number;
  userName: string;
  userEmail: string;
  theyHaveWhatINeed: Sticker[];
  iHaveWhatTheyNeed: Sticker[];
  matchScore: number;
}
