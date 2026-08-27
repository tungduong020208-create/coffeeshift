import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, AppNotification, TaskEvidence, ShiftHandover } from '../types';

// Khong co tai khoan mau nao - nhan vien se dang ky qua form
export const INITIAL_USERS: UserProfile[] = [{
    id: 'mgr-1',
    name: 'Quản lý cửa hàng',
    role: 'manager',
    email: 'manager@coffeeshift.com',
    avatar: 'https://ui-avatars.com/api/?name=QL&background=271310&color=e4e4cc&bold=true',
    phone: '0900000000',
    position: 'General Store Manager',
    hourlyRate: 75000,
    hoursWorkedMonth: 0,
    punctualityScore: 100,
    branch: 'CoffeeShift',
    certifications: [],
  },
  {
    id: 'emp-1',
    name: 'Nguyễn Văn B',
    role: 'employee',
    email: '0912345678',
    avatar: 'https://ui-avatars.com/api/?name=NVB&background=8B7355&color=fff&bold=true',
    phone: '0912345678',
    position: 'Barista',
    hourlyRate: 35000,
    hoursWorkedMonth: 0,
    punctualityScore: 100,
    branch: 'CoffeeShift',
    storeCode: 'CSFLAG',
    password: '123456',
    certifications: [],
  },
];

// Khong co du lieu mau - he thong bat dau trong sach
export const INITIAL_SHIFTS: Shift[] = [];
export const INITIAL_TASKS: TaskItem[] = [];
export const INITIAL_SWAPS: ShiftSwapRequest[] = [];
export const INITIAL_ANNOUNCEMENTS: StoreAnnouncement[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const INITIAL_EVIDENCE: TaskEvidence[] = [];
export const INITIAL_HANDOVERS: ShiftHandover[] = [];
