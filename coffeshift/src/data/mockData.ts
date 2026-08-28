import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, AppNotification, TaskEvidence, ShiftHandover } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
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
    hoursWorkedMonth: 120,
    punctualityScore: 95,
    branch: 'CoffeeShift',
    storeCode: 'CSFLAG',
    password: '123456',
    certifications: ['Espresso Master'],
    points: 150,
  },
  {
    id: 'emp-2',
    name: 'Trần Thị C',
    role: 'employee',
    email: '0987654321',
    avatar: 'https://ui-avatars.com/api/?name=TTC&background=D4A574&color=fff&bold=true',
    phone: '0987654321',
    position: 'Barista & Cashier',
    hourlyRate: 35000,
    hoursWorkedMonth: 96,
    punctualityScore: 88,
    branch: 'CoffeeShift',
    storeCode: 'CSFLAG',
    password: '123456',
    certifications: ['Latte Art'],
    points: 120,
  },
];

// Ca lam viec mau
export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'shift-1',
    userId: 'emp-1',
    userName: 'Nguyễn Văn B',
    userAvatar: 'https://ui-avatars.com/api/?name=NVB&background=8B7355&color=fff&bold=true',
    userPosition: 'Barista',
    role: 'employee',
    date: '28/08/2026',
    startTime: '06:30',
    endTime: '11:30',
    type: 'morning',
    duration: 5,
    station: 'Espresso Bar 1',
    status: 'upcoming',
  },
  {
    id: 'shift-2',
    userId: 'emp-2',
    userName: 'Trần Thị C',
    userAvatar: 'https://ui-avatars.com/api/?name=TTC&background=D4A574&color=fff&bold=true',
    userPosition: 'Barista & Cashier',
    role: 'employee',
    date: '28/08/2026',
    startTime: '11:30',
    endTime: '16:30',
    type: 'mid',
    duration: 5,
    station: 'POS & Cashier',
    status: 'upcoming',
  },
  {
    id: 'shift-3',
    userId: 'emp-1',
    userName: 'Nguyễn Văn B',
    userAvatar: 'https://ui-avatars.com/api/?name=NVB&background=8B7355&color=fff&bold=true',
    userPosition: 'Barista',
    role: 'employee',
    date: '29/08/2026',
    startTime: '17:30',
    endTime: '22:30',
    type: 'closing',
    duration: 5,
    station: 'Kitchen & Bakery',
    status: 'upcoming',
  },
];

// Cong viec checklist mau
export const INITIAL_TASKS: TaskItem[] = [
  // Ca Sang
  { id: 'task-1', title: 'Mở cửa hàng', category: 'opening', shiftType: 'morning', completed: false, scheduledTime: '06:30', taskStatus: 'not_started', description: 'Kiểm tra cửa, bật đèn, nhạc' },
  { id: 'task-2', title: 'Calibrate máy espresso', category: 'espresso_calibration', shiftType: 'morning', completed: false, scheduledTime: '06:45', taskStatus: 'not_started', description: 'Test shot, điều chỉnh grind' },
  { id: 'task-3', title: 'Kiểm tra tồn kho nguyên liệu', category: 'opening', shiftType: 'morning', completed: false, scheduledTime: '07:00', taskStatus: 'not_started', description: 'Sữa,咖啡, syrup, cốc' },
  { id: 'task-4', title: 'Làm sạch group head', category: 'hygiene', shiftType: 'morning', completed: false, scheduledTime: '07:15', taskStatus: 'not_started' },
  // Ca Trua
  { id: 'task-5', title: 'Duy trì vệ sinh quầy', category: 'midshift', shiftType: 'mid', completed: false, scheduledTime: '12:00', taskStatus: 'not_started' },
  { id: 'task-6', title: 'Vệ sinh WC', category: 'hygiene', shiftType: 'mid', completed: false, scheduledTime: '13:00', taskStatus: 'not_started', description: 'Kiểm tra nước, giấy, mùi' },
  { id: 'task-7', title: 'Bổ sung nguyên liệu', category: 'midshift', shiftType: 'mid', completed: false, scheduledTime: '14:00', taskStatus: 'not_started' },
  // Ca Toi
  { id: 'task-8', title: 'Đóng cửa hàng', category: 'closing', shiftType: 'closing', completed: false, scheduledTime: '22:00', taskStatus: 'not_started', description: 'Tắt đèn, máy, kéo cửa' },
  { id: 'task-9', title: 'Kiểm kê tiền', category: 'closing', shiftType: 'closing', completed: false, scheduledTime: '22:15', taskStatus: 'not_started', description: 'Đếm tiền mặt, đối chiếu POS' },
  { id: 'task-10', title: 'Vệ sinh cuối ngày', category: 'closing', shiftType: 'closing', completed: false, scheduledTime: '22:30', taskStatus: 'not_started', description: 'Rửa dụng cụ, lau bàn' },
];

// Yeu cau doi ca mau
export const INITIAL_SWAPS: ShiftSwapRequest[] = [
  {
    id: 'swap-1',
    fromUserId: 'emp-2',
    fromUserName: 'Trần Thị C',
    fromUserAvatar: 'https://ui-avatars.com/api/?name=TTC&background=D4A574&color=fff&bold=true',
    shiftId: 'shift-2',
    shiftDate: '28/08/2026',
    shiftTime: '11:30-16:30',
    shiftStation: 'POS & Cashier',
    reason: 'Có việc gia đình đột xuất',
    status: 'pending_manager',
    createdAt: 'Vừa xong',
  },
];

// Thong bao mau
export const INITIAL_ANNOUNCEMENTS: StoreAnnouncement[] = [
  {
    id: 'anno-1',
    authorName: 'Quản lý cửa hàng',
    authorRole: 'manager',
    authorAvatar: 'https://ui-avatars.com/api/?name=QL&background=271310&color=e4e4cc&bold=true',
    title: 'Thông báo lịch nghỉ lễ 02/09',
    content: 'Chủ nhật ngày 02/09 cửa hàng nghỉ lễ Quốc khánh. Tất cả nhân viên được nghỉ và hưởng lương.',
    badge: 'Quan trọng',
    timestamp: 'Vừa xong',
    isPinned: true,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const INITIAL_EVIDENCE: TaskEvidence[] = [];
export const INITIAL_HANDOVERS: ShiftHandover[] = [];
