import { Leaderboard } from './Leaderboard';
import { Logo } from './Logo';
import React, { useState, useEffect } from 'react';
import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, TaskStatus, TASK_STATUS_CONFIG } from '../types';
import { SalaryModal } from './modals/SalaryModal';
import { CustomerReviewModal } from './modals/CustomerReviewModal';
import { ClockInModal } from './modals/ClockInModal';
import { SwapShiftModal } from './modals/SwapShiftModal';
import { AddShiftModal } from './modals/AddShiftModal';
import { NewAnnouncementModal } from './modals/NewAnnouncementModal';

type NavTab = 'dashboard' | 'tasks' | 'evidence' | 'handover' | 'leaderboard' | 'profile' | 'roster' | 'approvals' | 'checklists' | 'staff' | 'announcements';

interface Props {
  user: UserProfile; shifts: Shift[]; tasks: TaskItem[]; swaps: ShiftSwapRequest[];
  announcements: StoreAnnouncement[]; allUsers: UserProfile[];
  evidence: any[]; handovers: any[];
  onToggleTask: (id: string) => void; onSubmitEvidence: (taskId: string, url: string, note: string) => void;
  onApproveEvidence: (id: string) => void; onRejectEvidence: (id: string) => void;
  onConfirmHandover: (id: string) => void; onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onClockIn: (id: string, station: string) => void; onClockOut: (id: string) => void;
  onToggleBreak: (id: string) => void; onSubmitSwap: (p: any) => void;
  onAcceptSwap: (id: string) => void; onLogout: () => void;
  onAddShift?: (s: Omit<Shift, "id">) => void;
  onDeleteShift?: (id: string) => void;
  onApproveSwap?: (id: string) => void;
  onRejectSwap?: (id: string) => void;
  onPostAnnouncement?: (a: Omit<StoreAnnouncement, "id" | "timestamp">) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const EmployeeDashboard: React.FC<Props> = ({
  user, shifts, tasks, swaps, announcements, allUsers, evidence = [], handovers = [],
  onToggleTask, onSubmitEvidence, onApproveEvidence, onRejectEvidence, onConfirmHandover,
  onAddTask, onClockIn, onClockOut, onToggleBreak, onSubmitSwap, onAcceptSwap, onLogout,
  onAddShift, onDeleteShift, onApproveSwap, onRejectSwap, onPostAnnouncement, onDeleteAnnouncement
}) => {
  const [activeNav, setActiveNav] = useState<NavTab>('dashboard');
  const [isClockInOpen, setIsClockInOpen] = useState(false);
  const [isClockOutOpen, setIsClockOutOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isNewAnnoOpen, setIsNewAnnoOpen] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("all");
  const isManager = user.role === 'manager';
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNotePriority, setNewNotePriority] = useState("normal");
  const [notes, setNotes] = useState<Array<{id: string, text: string, priority: string, time: string, userId: string}>>([
    { id: "note-1", text: "Máy Slayer hơi yếu ở group 2, Espresso chảy chậm. Cần bảo trì sau ca tối nay.", priority: "important", time: "22:25", userId: "emp-1" },
    { id: "note-2", text: "Bean Espresso blend còn 1.5kg. Ca mai cần đặt hàng thêm nếu không đủ phục vụ giờ cao điểm.", priority: "urgent", time: "22:20", userId: "emp-1" },
    { id: "note-3", text: "Khách khen Latte Art hôm nay đẹp. Tiếp tục duy trì phong độ!", priority: "normal", time: "21:45", userId: "emp-1" },
  ]);
  const [handoverNotes, setHandoverNotes] = useState<Record<string, string>>({});
  const [submitEvidence, setSubmitEvidence] = useState<string | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const userShifts = shifts.filter(s => s.userId === user.id);
  const todayShift = userShifts.find(s => s.date === todayStr);

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let iv: any = null;
    if (todayShift?.status === 'checked_in') iv = setInterval(() => setElapsed(p => p + 1), 1000);
    else setElapsed(0);
    return () => clearInterval(iv);
  }, [todayShift?.status]);

  const shiftPct = (() => {
    if (!todayShift) return 0;
    if (todayShift.status === 'completed') return 100;
    if (todayShift.status === 'upcoming') return 0;
    const [sh, sm] = todayShift.startTime.split(':').map(Number);
    const [eh, em] = todayShift.endTime.split(':').map(Number);
    const total = (eh * 60 + em) - (sh * 60 + sm);
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes() - (sh * 60 + sm);
    return Math.min(100, Math.max(0, Math.round((cur / total) * 100)));
  })();

  const dateStr = new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  const shiftLabel = (t: string) => t === 'morning' ? 'Ca Sáng' : t === 'mid' ? 'Ca Trưa' : 'Ca Tối';
  // Filter tasks by current shift type
  const currentShiftType = todayShift?.type || 'morning';
  const shiftTimeRanges: Record<string, {start: string, end: string}> = {
    morning: { start: '06:30', end: '11:30' },
    mid: { start: '11:30', end: '16:30' },
    closing: { start: '17:30', end: '22:30' }
  };
  const isTimeInShift = (time?: string) => {
    if (!time || !todayShift) return false;
    const range = shiftTimeRanges[currentShiftType];
    if (!range) return true;
    return time >= range.start && time <= range.end;
  };
  const currentShiftTasks = tasks.filter(t =>
    t.shiftType === currentShiftType && isTimeInShift(t.scheduledTime)
  );
  const sc = (ts?: TaskStatus) => TASK_STATUS_CONFIG[ts || 'not_started'];

  const pendingSwaps = swaps.filter((s: any) => s.status === 'pending_manager');
  const activeFloorShifts = shifts.filter((s: any) => s.date === todayStr && s.status === 'checked_in');
  const uniqueDates = Array.from(new Set(shifts.map((s: any) => s.date))).sort();
  const filteredShifts = shifts.filter((s: any) => selectedDayFilter === 'all' ? true : s.date === selectedDayFilter);
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const taskPercent = Math.round((completedTasks / (tasks.length || 1)) * 100);
  const pendingEvidence = evidence.filter((e: any) => e.status === 'pending_review');
  const employees = allUsers.filter((u: any) => u.role === 'employee');
  const todayShiftsAll = shifts.filter((s: any) => s.date === todayStr);
  const morningShift = todayShiftsAll.filter((s: any) => s.type === 'morning');
  const midShift = todayShiftsAll.filter((s: any) => s.type === 'mid');
  const closingShift = todayShiftsAll.filter((s: any) => s.type === 'closing');
  const myEvidence = evidence.filter((e: any) => e.userId === user.id);
  const myHandovers = handovers.filter((h: any) => h != null && (h.fromUserId === user.id || h.toUserId === user.id));

  const handleSubmitEvidence = (taskId: string) => {
    onSubmitEvidence(taskId, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300', evidenceNote);
    setSubmitEvidence(null);
    setEvidenceNote('');
  };

  const handleAddNote = (text: string, priority: string) => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const newNote = { id: "note-" + Date.now(), text, priority, time: now, userId: user.id };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <div className="min-h-screen bg-[#f6f3f2] flex relative">
      {/* Sidebar Navigation */}
      <aside className="w-56 bg-[#271310] text-[#e4e4cc] flex flex-col pt-2 pb-4 px-2 sticky top-0 h-screen flex-shrink-0">
        <nav className="flex-1 space-y-1">
          {(isManager ? [
            { id: 'dashboard', icon: 'dashboard', label: 'Trang chủ' },
            { id: 'roster', icon: 'calendar_view_week', label: 'Phân ca' },
            { id: 'approvals', icon: 'verified', label: 'Duyệt' },
            { id: 'tasks', icon: 'task_alt', label: 'Công việc' },
            { id: 'checklists', icon: 'checklist_rtl', label: 'Giám sát' },
            { id: 'staff', icon: 'group', label: 'Nhân viên' },
            { id: 'leaderboard', icon: 'leaderboard', label: 'Xếp hạng' },
          ] : [
            { id: 'dashboard', icon: 'dashboard', label: 'Trang chủ' },
            { id: 'tasks', icon: 'task_alt', label: 'Công việc' },
            { id: 'evidence', icon: 'photo_camera', label: 'Bằng chứng' },
            { id: 'handover', icon: 'swap_horiz', label: 'Bàn giao' },
            { id: 'leaderboard', icon: 'leaderboard', label: 'Xếp hạng' },
            { id: 'profile', icon: 'person', label: 'Cá nhân' },
          ]).map(item => (
            <button key={item.id} type="button" onClick={() => setActiveNav(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeNav === item.id ? 'bg-[#ff8f00] text-white' : 'text-[#827472] hover:bg-white/10 hover:text-white'}`}>
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        {!isManager && (
          <div className="border-t border-[#3e2723] pt-3 mt-3 px-3">
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#ff8f00]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-[#e4e4cc]">{user.name}</p>
                <p className="text-[10px] text-[#827472]">{user.points || 0} Điểm</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeNav === 'dashboard' && isManager && (<div className="px-4 py-4 space-y-5"><div><h1 className="font-bold text-2xl text-gray-900">Tong quan</h1><p className="text-sm text-gray-500">Hom nay</p></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div className="bg-[#271310] p-3 rounded-xl text-xs text-white"><p className="text-gray-400 uppercase text-[10px] font-semibold">Dang tren san</p><p className="text-lg font-bold font-mono">{activeFloorShifts.length}</p></div><div className="bg-[#271310] p-3 rounded-xl text-xs text-white"><p className="text-gray-400 uppercase text-[10px] font-semibold">Cho duyet</p><p className="text-lg font-bold font-mono text-amber-400">{pendingSwaps.length}</p></div><div className="bg-[#271310] p-3 rounded-xl text-xs text-white"><p className="text-gray-400 uppercase text-[10px] font-semibold">Checklist</p><p className="text-lg font-bold font-mono text-[#ff8f00]">{taskPercent}%</p></div><div className="bg-[#271310] p-3 rounded-xl text-xs text-white"><p className="text-gray-400 uppercase text-[10px] font-semibold">Nhan su</p><p className="text-lg font-bold font-mono">{allUsers.length}</p></div></div></div>) }

{activeNav === 'dashboard' && !isManager && (
          <div className="px-4 py-4 space-y-5">
            <div><h1 className="font-bold text-2xl text-gray-900">Dashboard</h1><p className="text-sm text-gray-500">Hôm nay, {dateStr}</p></div>
            {todayShift ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ff8f00]" />
                <div className="flex items-start justify-between mb-3">
                  <div><h2 className="font-bold text-xl text-gray-900">{shiftLabel(todayShift.type)}</h2>
                    <div className="flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-gray-400 text-base">schedule</span><span className="text-sm text-gray-600">{todayShift.startTime} - {todayShift.endTime}</span></div>{todayShift.checkInTime && (<div className="flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-emerald-500 text-base">login</span><span className="text-xs text-emerald-600 font-medium">Vao ca: {todayShift.checkInTime}</span></div>)}{todayShift.checkOutTime && (<div className="flex items-center gap-1.5 mt-1"><span className="material-symbols-outlined text-red-500 text-base">logout</span><span className="text-xs text-red-600 font-medium">Ket ca: {todayShift.checkOutTime}</span></div>)}</div>
                  <span className="bg-[#f5f0e0] text-[#8f6a00] text-xs font-semibold px-3 py-1 rounded-full">{todayShift.status === 'checked_in' ? 'Đang diễn ra' : todayShift.status === 'completed' ? 'Đã hoàn thành' : 'Sắp bắt đầu'}</span>
                  <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + (todayShift.duration === 5 ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>{todayShift.duration}h</span>
                </div>
                <div className="mt-2"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Tiến độ ca làm</span><span className="font-semibold text-gray-700">{shiftPct}%</span></div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#ff8f00] rounded-full transition-all duration-500" style={{ width: shiftPct + '%' }} /></div>{todayShift.status === "checked_in" && todayShift.checkInTime && (<div className="flex items-center gap-1.5 mt-2"><span className="material-symbols-outlined text-blue-500 text-base">timer</span><span className="text-xs text-blue-600 font-medium">Đã làm: {Math.floor(elapsed / 3600)}h {Math.floor((elapsed % 3600) / 60)}p {elapsed % 60}s</span></div>)}</div>
                <div className="mt-4 flex gap-2">
                  {todayShift.status === 'upcoming' && <button type="button" onClick={() => setIsClockInOpen(true)} className="flex-1 py-2.5 bg-[#ff8f00] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-base">login</span>Điểm danh vào ca</button>}
                  {todayShift.status === 'checked_in' && <button type="button" onClick={() => setIsClockOutOpen(true)} className="flex-1 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-base">logout</span>Kết ca (Clock Out)</button>}
                  {todayShift.status === 'completed' && <div className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2"><span className="material-symbols-outlined text-base">check_circle</span>Ca làm đã hoàn thành!</div>}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 text-center"><span className="material-symbols-outlined text-gray-300 text-4xl mb-2">event_busy</span><p className="text-sm text-gray-500">Hôm nay bạn không có ca làm</p></div>
            )}

            <div><div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-[#ff8f00] text-xl">checklist</span><h2 className="font-bold text-lg text-gray-900">Checklist Công Việc</h2></div>
              <div className="space-y-3">
                {currentShiftTasks.slice(0, 4).map(task => {
                  const s = sc(task.taskStatus);
                  return (
                    <div key={task.id} className="bg-white rounded-xl border border-gray-200 p-3.5 flex items-center gap-3 hover:shadow-sm transition-all" style={{ borderLeftWidth: '4px', borderLeftColor: s.color }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bgColor }}>
                        <span className="material-symbols-outlined text-xl" style={{ color: s.color }}>{s.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-gray-900 truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5"><span className="text-xs text-gray-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{task.scheduledTime}</span>
                          <span className="text-xs font-medium" style={{ color: s.color }}>{s.label}</span>{task.completedAt && (<span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[10px]">schedule</span>{task.completedAt}</span>)}{task.evidenceNote && (<span className="text-[10px] text-blue-500 flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[10px]">photo_camera</span>Đã chụp</span>)}{task.taskStatus === 'pending_review' && (<span className="text-[10px] text-blue-500 flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[10px]">pending</span>Chờ duyệt</span>)}</div></div>
                      {task.taskStatus !== 'completed' && task.taskStatus !== 'pending_review' && (<button type="button" onClick={() => setSubmitEvidence(task.id)} className="p-2 rounded-lg hover:bg-orange-50 cursor-pointer border border-orange-200" title="Chup anh xac nhan"><span className="material-symbols-outlined text-[#ff8f00]">photo_camera</span></button>)}
                    </div>);
                })}
              </div></div>
          </div>
        )}

        {
  activeNav === 'tasks' && (
    <div className="px-4 py-4 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-[#ff8f00] text-xl">task_alt</span>
        <h1 className="font-bold text-xl text-gray-900">Công việc theo ca</h1>
      </div>
      
      {['morning', 'mid', 'closing'].filter(st => st === currentShiftType).map(shiftType => {
        const shiftTasks = currentShiftTasks.filter(t => t.shiftType === shiftType || t.shiftType === 'all');
        if (shiftTasks.length === 0) return null;
        const completedCount = shiftTasks.filter(t => t.taskStatus === 'completed').length;
        const progress = Math.round((completedCount / shiftTasks.length) * 100);
        const shiftInfo = {
          morning: { name: 'Ca Sáng', icon: 'wb_sunny', color: '#ff8f00', bgColor: '#fff7ed', time: '06:30 - 11:30' },
          mid: { name: 'Ca Trưa', icon: 'wb_twilight', color: '#d97706', bgColor: '#fffbeb', time: '11:30 - 16:30' },
          closing: { name: 'Ca Tối', icon: 'dark_mode', color: '#374151', bgColor: '#f3f4f6', time: '17:30 - 22:30' }
        };
        const info = shiftInfo[shiftType];
        return (
          <div key={shiftType} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100" style={{ backgroundColor: info.bgColor }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ color: info.color }}>{info.icon}</span>
                  <h3 className="font-bold text-base" style={{ color: info.color }}>{info.name}</h3>
                </div>
                <span className="text-xs text-gray-500">{info.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: progress + '%', backgroundColor: info.color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: info.color }}>{completedCount}/{shiftTasks.length}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {shiftTasks.sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || '')).map(task => {
                const s = sc(task.taskStatus);
                return (
                  <div key={task.id} className="p-3 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { if (task.taskStatus !== 'completed' && task.taskStatus !== 'pending_review') setSubmitEvidence(task.id); }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bgColor }}>
                      <span className="material-symbols-outlined text-lg" style={{ color: s.color }}>{s.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>{task.scheduledTime}
                        </span>
                        <span className="text-[11px] font-medium" style={{ color: s.color }}>{s.label}</span>
                        {task.capturedAt && <span className="text-[11px] text-gray-400">📸 {task.capturedAt}</span>}
                      </div>
                    </div>
                    {task.taskStatus === 'completed' && <span className="material-symbols-outlined text-green-500">check_circle</span>}
                    {task.taskStatus !== 'completed' && task.taskStatus !== 'pending_review' && <span className="material-symbols-outlined text-orange-400">photo_camera</span>}
                    {task.taskStatus === 'pending_review' && <span className="material-symbols-outlined text-blue-400">pending</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  )
}

        {activeNav === 'evidence' && !isManager && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#ff8f00] text-xl">photo_camera</span>
              <h1 className="font-bold text-xl text-gray-900">Bằng chứng đã nộp</h1>
            </div>
            {myEvidence.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">photo_library</span>
                <p className="text-sm text-gray-500">Bạn chưa nộp bằng chứng nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myEvidence.map(ev => {
                  const evStatus = ev.status === 'approved' ? { label: 'Đã duyệt', color: '#10b981', bg: '#d1fae5' }
                    : ev.status === 'rejected' ? { label: 'Bị từ chối', color: '#dc2626', bg: '#fef2f2' }
                    : { label: 'Chờ duyệt', color: '#2563eb', bg: '#eff6ff' };
                  return (
                    <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{ev.submittedAt}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ color: evStatus.color, backgroundColor: evStatus.bg }}>{evStatus.label}</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{ev.note}</p>
                      {ev.reviewedBy && <p className="text-xs text-gray-400 mt-1">Duyệt bởi: {ev.reviewedBy}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeNav === 'handover' && !isManager && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff8f00] text-xl">edit_note</span>
                <h1 className="font-bold text-xl text-gray-900">Sổ tay ca làm</h1>
              </div>
              <button
                type="button"
                onClick={() => setShowNewNote(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#ff8f00] text-white text-xs font-bold rounded-lg hover:bg-[#e67e00] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span> Ghi chú mới
              </button>
            </div>

            <p className="text-xs text-gray-500">Ghi lại những điều quan trọng để ca sau vào để ý</p>

            {/* New note form */}
            {showNewNote && (
              <div className="bg-white rounded-xl border-2 border-[#ff8f00]/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ff8f00] uppercase">Ghi chú mới</span>
                  <button type="button" onClick={() => setShowNewNote(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <textarea
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="VD: Bean espresso sắp hết, cần đặt hàng thêm. Máy Slayer hơi yếu ở nhóm 2, cần bảo trì..."
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none focus:border-[#ff8f00] focus:ring-1 focus:ring-[#ff8f00]/30"
                  rows={4}
                />
                <div className="flex gap-2">
                  <select
                    value={newNotePriority}
                    onChange={e => setNewNotePriority(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:border-[#ff8f00]"
                  >
                    <option value="normal">📌 Bình thường</option>
                    <option value="important">⚠️ Quan trọng</option>
                    <option value="urgent">🔴 Khẩn cấp</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (newNoteText.trim()) {
                        handleAddNote(newNoteText.trim(), newNotePriority);
                        setNewNoteText('');
                        setNewNotePriority('normal');
                        setShowNewNote(false);
                      }
                    }}
                    disabled={!newNoteText.trim()}
                    className={"flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer " + (newNoteText.trim() ? 'bg-[#ff8f00] text-white hover:bg-[#e67e00]' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}
                  >
                    Lưu ghi chú
                  </button>
                </div>
              </div>
            )}

            {/* Notes list */}
            {notes.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">sticky_note_2</span>
                <p className="text-sm text-gray-500 font-medium">Chưa có ghi chú nào</p>
                <p className="text-xs text-gray-400 mt-1">Nhấn "Ghi chú mới" để bắt đầu ghi lại những điều quan trọng</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div
                    key={note.id}
                    className={"bg-white rounded-xl border p-4 transition-all hover:shadow-sm " + (
                      note.priority === 'urgent' ? 'border-red-300 bg-red-50/30' :
                      note.priority === 'important' ? 'border-amber-300 bg-amber-50/30' :
                      'border-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-semibold text-gray-700">{user.name}</span>
                        <span className={"text-[10px] px-1.5 py-0.5 rounded-full font-medium " + (
                          note.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                          note.priority === 'important' ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-500'
                        )}>
                          {note.priority === 'urgent' ? '🔴 Khẩn cấp' : note.priority === 'important' ? '⚠️ Quan trọng' : '📌 Bình thường'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{note.time}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === 'roster' && isManager && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[#ff8f00] text-xl">calendar_view_week</span><h1 className="font-bold text-xl text-gray-900">Lich phan ca</h1></div>
            <div className="space-y-3">
              {filteredShifts.length===0&&<p className="text-center text-gray-400 py-8 text-sm">Chua co ca nao</p>}
              {filteredShifts.map(s=>(<div key={s.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs relative"><div className="flex items-center justify-between pl-2"><div className="flex items-center gap-2"><img src={s.userAvatar} className="w-8 h-8 rounded-full object-cover"/><div><p className="font-bold text-xs">{s.userName}</p></div></div><span className="text-[#ff8f00] font-bold">{s.startTime}-{s.endTime}</span></div><div className="pl-2 mt-1"><p className="text-gray-500">{s.date} - {s.station}</p></div><div className="flex justify-end mt-1"><button type="button" onClick={()=>onDeleteShift?.(s.id)} className="text-rose-600 text-[11px]">Xoa</button></div></div>))}
            </div>
          </div>
        )}

        {activeNav === 'approvals' && isManager && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[#ff8f00] text-xl">verified</span><h1 className="font-bold text-xl text-gray-900">Xet duyet doi ca</h1></div>
            {swaps.length===0?<p className="text-center text-gray-400 py-8">Chua co yeu cau nao.</p>:
            <div className="space-y-3">{swaps.map(sw=>(<div key={sw.id} className="p-4 rounded-xl border border-gray-200 text-xs space-y-2"><div className="flex items-center justify-between"><span className="font-bold">{sw.fromUserName}</span><span className="text-[#ff8f00]">{sw.shiftDate}</span></div><p className="text-gray-500 italic">{sw.reason}</p>{sw.status==='pending_manager'&&<div className="flex justify-end gap-2"><button onClick={()=>onRejectSwap?.(sw.id)} className="px-3 py-1 border border-rose-300 text-rose-700 rounded text-xs">Tu choi</button><button onClick={()=>onApproveSwap?.(sw.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs">Duyet</button></div>}</div>))}</div>}
          </div>
        )}

        {activeNav === 'staff' && isManager && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-[#ff8f00] text-xl">group</span><h1 className="font-bold text-xl text-gray-900">Doi ngu nhan vien</h1></div>
            <div className="space-y-3">{allUsers.map(m=>(<div key={m.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs"><div className="flex items-center gap-3"><img src={m.avatar} className="w-10 h-10 rounded-full object-cover"/><div><p className="font-bold text-sm">{m.name}</p><p className="text-[10px] text-gray-400">{m.position} - {m.email}</p></div></div></div>))}</div>
          </div>
        )}

{activeNav === 'leaderboard' && (
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ff8f00] text-xl">leaderboard</span>
              <h1 className="font-bold text-xl text-gray-900">Xếp hạng</h1>
            </div>
            <Leaderboard allUsers={allUsers} currentUser={user} />
          </div>
        )}

        {activeNav === 'profile' && !isManager && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex flex-col items-center text-center">
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-3 border-[#ff8f00] mb-3" />
              <h1 className="font-bold text-xl text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.position}</p>
              <div className="bg-[#ff8f00] text-white px-4 py-1.5 rounded-full text-sm font-bold mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">star</span>
                {user.points || 0} Điểm
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-500">Email</span><span className="text-sm text-gray-900">{user.email}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Số điện thoại</span><span className="text-sm text-gray-900">{user.phone}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Chi nhánh</span><span className="text-sm text-gray-900 text-right max-w-[200px]">{user.branch}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Giờ làm/tháng</span><span className="text-sm text-gray-900">{user.hoursWorkedMonth}h</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Chăm chỉ</span><span className="text-sm text-gray-900">{user.punctualityScore}%</span></div>
            </div>
            <button type="button" onClick={onLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl cursor-pointer border border-red-200">
              Đăng xuất
            </button>
          </div>
        )}

      </div>

      <button type="button" onClick={() => setIsSwapOpen(true)} className="fixed bottom-8 right-8 w-14 h-14 bg-[#ff8f00] text-white rounded-full shadow-lg flex items-center justify-center z-30 cursor-pointer hover:bg-[#e67e00] transition-colors"><span className="material-symbols-outlined text-2xl">handshake</span></button>

      {isManager && <AddShiftModal allUsers={allUsers} isOpen={isAddShiftOpen} onClose={() => setIsAddShiftOpen(false)} onAddShift={onAddShift!} />}
      {isManager && <NewAnnouncementModal currentUser={user} isOpen={isNewAnnoOpen} onClose={() => setIsNewAnnoOpen(false)} onPostAnnouncement={onPostAnnouncement!} />}
      {isManager && <AddShiftModal allUsers={allUsers} isOpen={isAddShiftOpen} onClose={()=>setIsAddShiftOpen(false)} onAddShift={onAddShift!} />}
      {isManager && <NewAnnouncementModal currentUser={user} isOpen={isNewAnnoOpen} onClose={()=>setIsNewAnnoOpen(false)} onPostAnnouncement={onPostAnnouncement!} />}
      <ClockInModal shift={todayShift} user={user} isOpen={isClockInOpen} onClose={() => setIsClockInOpen(false)} onConfirmClockIn={onClockIn} onConfirmClockOut={onClockOut} />
      <ClockInModal shift={todayShift} user={user} isOpen={isClockOutOpen} onClose={() => setIsClockOutOpen(false)} onConfirmClockIn={onClockIn} onConfirmClockOut={onClockOut} isClockingOut={true} />
      <SwapShiftModal userShifts={userShifts} allUsers={allUsers} currentUserId={user.id} isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} onSubmitSwap={onSubmitSwap} />
    </div>
  );
};
