import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, AppNotification, TaskEvidence, ShiftHandover } from '../types';

// Khong co tai khoan mau nao - nhan vien se dang ky qua form
export const INITIAL_USERS: UserProfile[] = [];

// Khong co du lieu mau - he thong bat dau trong sach
export const INITIAL_SHIFTS: Shift[] = [];
export const INITIAL_TASKS: TaskItem[] = [];
export const INITIAL_SWAPS: ShiftSwapRequest[] = [];
export const INITIAL_ANNOUNCEMENTS: StoreAnnouncement[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const INITIAL_EVIDENCE: TaskEvidence[] = [];
export const INITIAL_HANDOVERS: ShiftHandover[] = [];
