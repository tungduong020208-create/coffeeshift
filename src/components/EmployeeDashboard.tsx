import React, { useState, useEffect } from 'react';
import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, TaskStatus, TASK_STATUS_CONFIG } from '../types';
import { ClockInModal } from './modals/ClockInModal';
import { SwapShiftModal } from './modals/SwapShiftModal';

type NavTab = 'dashboard' | 'tasks' | 'evidence' | 'handover' | 'profile';

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
}

export const EmployeeDashboard: React.FC<Props> = ({
  user, shifts, tasks, swaps, announcements, allUsers, evidence = [], handovers = [],
  onToggleTask, onSubmitEvidence, onApproveEvidence, onRejectEvidence, onConfirmHandover,
  onAddTask, onClockIn, onClockOut, onToggleBreak, onSubmitSwap, onAcceptSwap, onLogout
}) => {
  const [activeNav, setActiveNav] = useState<NavTab>('dashboard');
  const [isClockInOpen, setIsClockInOpen] = useState(false);
  const [isClockOutOpen, setIsClockOutOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
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

  const myEvidence = evidence.filter((e: any) => e.userId === user.id);
  const myHandovers = handovers.filter((h: any) => h.fromUserId === user.id || h.toUserId === user.id);

  const handleSubmitEvidence = (taskId: string) => {
    onSubmitEvidence(taskId, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300', evidenceNote);
    setSubmitEvidence(null);
    setEvidenceNote('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
      <div className="bg-[#271310] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2"><span className="material-symbols-outlined text-[#ff8f00] text-xl">coffee</span><span className="font-bold text-lg">CoffeeShift</span></div>
        <div className="flex items-center gap-3">
          <div className="bg-[#ff8f00] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">star</span><span>{user.points || 0} Điểm</span></div>
          <button type="button" onClick={onLogout} className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"><span className="material-symbols-outlined text-white text-xl">qr_code_scanner</span></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {activeNav === 'dashboard' && (
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

        {activeNav === 'evidence' && (
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

        {activeNav === 'handover' && (
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#ff8f00] text-xl">swap_horiz</span>
              <h1 className="font-bold text-xl text-gray-900">Sổ bàn giao ca</h1>
            </div>
            {myHandovers.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">inventory_2</span>
                <p className="text-sm text-gray-500">Chưa có phiếu bàn giao ca nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myHandovers.map(ho => (
                  <div key={ho.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{ho.fromUserName} to {ho.toUserName}</p>
                        <p className="text-xs text-gray-400">{ho.date}</p>
                      </div>
                      <span className={ho.status === 'confirmed' ? "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700" : "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700"}>
                        {ho.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-gray-700 uppercase">Nguyen lieu</p>
                      {ho.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{ing.name}</span>
                          <span className={ing.status === 'enough' ? "text-emerald-600" : ing.status === 'low' ? "text-amber-600" : "text-red-600"}>
                            {ing.status === 'enough' ? 'Du' : ing.status === 'low' ? 'Thap' : 'Het'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-gray-700 uppercase">May moc</p>
                      {ho.machines.map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{m.name}</span>
                          <span className={m.status === 'working' ? "text-emerald-600" : m.status === 'needs_cleaning' ? "text-amber-600" : "text-red-600"}>
                            {m.status === 'working' ? 'Hoạt động' : m.status === 'needs_cleaning' ? 'Cần vệ sinh' : 'Hỏng'}
                          </span>
                        </div>
                      ))}
                    </div>
                    {ho.notes && <p className="text-xs text-gray-500 italic border-t pt-2 mt-2">Ghi chú: {ho.notes}</p>}
                    {ho.status === 'pending' && (
                      <button type="button" onClick={() => onConfirmHandover(ho.id)} className="w-full mt-3 py-2 bg-[#ff8f00] text-white text-sm font-bold rounded-xl cursor-pointer">
                        Xác nhận bàn giao
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === 'profile' && (
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
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Chứng chỉ</p>
              <div className="flex flex-wrap gap-1.5">
                {user.certifications.map((cert, i) => (
                  <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{cert}</span>
                ))}
              </div>
            </div>
            <button type="button" onClick={onLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl cursor-pointer border border-red-200">
              Đăng xuất
            </button>
          </div>
        )}

      </div>

      <button type="button" onClick={() => setIsSwapOpen(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-[#ff8f00] text-white rounded-full shadow-lg flex items-center justify-center z-30 cursor-pointer"><span className="material-symbols-outlined text-2xl">handshake</span></button>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex justify-around items-center z-40 max-w-md mx-auto">
        {([{"id":"dashboard","icon":"dashboard","label":"Trang chủ"},{"id":"tasks","icon":"task_alt","label":"Công việc"},{"id":"evidence","icon":"photo_camera","label":"Bằng chứng"},{"id":"handover","icon":"swap_horiz","label":"Bàn giao"},{"id":"profile","icon":"person","label":"Cá nhân"}]).map(item => (
          <button key={item.id} type="button" onClick={() => setActiveNav(item.id)} className={"flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl cursor-pointer " + (activeNav === item.id ? "bg-[#ff8f00] text-white" : "text-gray-400")}>
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[9px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>

      <ClockInModal shift={todayShift} user={user} isOpen={isClockInOpen} onClose={() => setIsClockInOpen(false)} onConfirmClockIn={onClockIn} onConfirmClockOut={onClockOut} />
      <ClockInModal shift={todayShift} user={user} isOpen={isClockOutOpen} onClose={() => setIsClockOutOpen(false)} onConfirmClockIn={onClockIn} onConfirmClockOut={onClockOut} isClockingOut={true} />
      <SwapShiftModal userShifts={userShifts} allUsers={allUsers} currentUserId={user.id} isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} onSubmitSwap={onSubmitSwap} />
    </div>
  );
};
