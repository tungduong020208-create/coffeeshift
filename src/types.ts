export type UserRole = 'employee' | 'manager';
export type ShiftType = 'morning' | 'mid' | 'closing';
export type ShiftDuration = 5 | 8;
export type ShiftStatus = 'upcoming' | 'checked_in' | 'on_break' | 'completed' | 'swap_requested' | 'time_off';
export type StationType = 'Espresso Bar 1' | 'Espresso Bar 2' | 'Pour Over & Cold Brew' | 'POS & Cashier' | 'Kitchen & Bakery' | 'Floor & Service' | 'Shift Supervisor';

// 6 trạng thái công việc theo yêu cầu
export type TaskStatus = 'not_started' | 'in_progress' | 'pending_review' | 'completed' | 'rejected' | 'overdue';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  phone: string;
  position: string;
  hourlyRate: number;
  hoursWorkedMonth: number;
  punctualityScore: number;
  branch: string;
  certifications: string[];
  points?: number;
  storeCode?: string;
  password?: string;
}

export interface Shift {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userPosition: string;
  role: UserRole;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  duration: ShiftDuration;
  station: StationType;
  status: ShiftStatus;
  checkInTime?: string;
  checkOutTime?: string;
  breakStartTime?: string;
  breakMinutesUsed?: number;
  notes?: string;
  checkInLocation?: { lat: number; lng: number; address: string };
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'opening' | 'espresso_calibration' | 'midshift' | 'closing' | 'hygiene';
  shiftType: ShiftType | 'all';
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  description?: string;
  isUrgent?: boolean;
  scheduledTime?: string;
  taskStatus?: TaskStatus;
  evidenceUrl?: string;
  evidenceNote?: string;
  capturedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Bằng chứng hoàn thành công việc
export interface TaskEvidence {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  note: string;
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// Sổ bàn giao ca
export interface ShiftHandover {
  id: string;
  shiftId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  shiftType: ShiftType;
  date: string;
  ingredients: IngredientStatus[];
  machines: MachineStatus[];
  notes: string;
  createdAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  status: 'pending' | 'confirmed';
}

export interface IngredientStatus {
  name: string;
  status: 'enough' | 'low' | 'empty';
  note?: string;
}

export interface MachineStatus {
  name: string;
  status: 'working' | 'needs_cleaning' | 'broken';
  note?: string;
}

export interface ShiftSwapRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId?: string;
  toUserName?: string;
  toUserAvatar?: string;
  shiftId: string;
  shiftDate: string;
  shiftTime: string;
  shiftStation: string;
  reason: string;
  targetDate?: string;
  status: 'pending_peer' | 'pending_manager' | 'approved' | 'rejected';
  createdAt: string;
}

export interface StoreAnnouncement {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  badge?: string;
  timestamp: string;
  isPinned?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'shift' | 'approval' | 'announcement' | 'alert';
  timestamp: string;
  read: boolean;
}

// Helper colors for 6 task statuses
export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  not_started: { label: 'Chưa bắt đầu', color: '#9ca3af', bgColor: '#f3f4f6', icon: 'radio_button_unchecked' },
  in_progress: { label: 'Đang làm', color: '#ea580c', bgColor: '#fff7ed', icon: 'pending' },
  pending_review: { label: 'Chờ duyệt', color: '#2563eb', bgColor: '#eff6ff', icon: 'rate_review' },
  completed: { label: 'Hoàn thành', color: '#10b981', bgColor: '#d1fae5', icon: 'check_circle' },
  rejected: { label: 'Từ chối', color: '#dc2626', bgColor: '#fef2f2', icon: 'cancel' },
  overdue: { label: 'Quá hạn', color: '#9333ea', bgColor: '#f5f3ff', icon: 'warning' },
};
