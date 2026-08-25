import React, { useState } from 'react';
import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, TaskEvidence, ShiftHandover } from '../types';
import { AddShiftModal } from './modals/AddShiftModal';
import { NewAnnouncementModal } from './modals/NewAnnouncementModal';

interface ManagerDashboardProps {
  manager: UserProfile;
  shifts: Shift[];
  tasks: TaskItem[];
  swaps: ShiftSwapRequest[];
  announcements: StoreAnnouncement[];
  allUsers: UserProfile[];
  onAddShift: (newShift: Omit<Shift, 'id'>) => void;
  onDeleteShift: (shiftId: string) => void;
  onApproveSwap: (swapId: string) => void;
  onRejectSwap: (swapId: string) => void;
  onToggleTask: (taskId: string) => void;
  evidence: TaskEvidence[];
  handovers: ShiftHandover[];
  onPostAnnouncement: (announcement: Omit<StoreAnnouncement, 'id' | 'timestamp'>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onSubmitEvidence: (taskId: string, url: string, note: string) => void;
  onApproveEvidence: (id: string) => void;
  onRejectEvidence: (id: string) => void;
  onConfirmHandover: (id: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  manager,
  shifts,
  tasks,
  swaps,
  announcements,
  allUsers,
  onAddShift,
  onDeleteShift,
  onApproveSwap,
  onRejectSwap,
  onToggleTask,
  evidence = [],
  handovers = [],
  onPostAnnouncement,
  onDeleteAnnouncement,
  onSubmitEvidence,
  onApproveEvidence,
  onRejectEvidence,
  onConfirmHandover,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster' | 'approvals' | 'evidence' | 'checklists' | 'staff' | 'announcements'>('overview');
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isNewAnnoOpen, setIsNewAnnoOpen] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingSwaps = swaps.filter((s) => s.status === 'pending_manager');
  const activeFloorShifts = shifts.filter((s) => s.date === todayStr && s.status === 'checked_in');

  // Group unique dates in shifts
  const uniqueDates = Array.from(new Set(shifts.map((s) => s.date))).sort();

  const filteredShifts = shifts.filter((s) => {
    if (selectedDayFilter === 'all') return true;
    return s.date === selectedDayFilter;
  });

  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskPercent = Math.round((completedTasks / (tasks.length || 1)) * 100);
  const pendingEvidence = evidence.filter((e) => e.status === 'pending_review');
  const employees = allUsers.filter((u) => u.role === 'employee');
  const leaderboard = [...employees].sort((a, b) => (b.points || 0) - (a.points || 0));

  // 3-shift tracking
  const todayShifts = shifts.filter((s) => s.date === todayStr);
  const morningShift = todayShifts.filter((s) => s.type === 'morning');
  const midShift = todayShifts.filter((s) => s.type === 'mid');
  const closingShift = todayShifts.filter((s) => s.type === 'closing');

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Manager Pulse Hero Banner */}
      <section className="bg-gradient-to-br from-[#271310] via-[#3e2723] to-[#271310] text-[#fcf9f8] rounded-2xl p-5 md:p-6 shadow-xl border border-[#5b403c]/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={manager.avatar}
              alt={manager.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#ff8f00] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Montserrat'] font-bold text-xl md:text-2xl text-[#fcf9f8]">
                  Quản lý: {manager.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#ff8f00] text-[#271310] text-[10px] font-extrabold uppercase tracking-wide">
                  General Manager
                </span>
              </div>
              <p className="text-xs text-[#e4e4cc]/80 mt-0.5">
                {manager.branch} • Trung tâm điều phối & phân ca tự động
              </p>
            </div>
          </div>

          {/* Action Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddShiftOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-[#ff8f00] hover:bg-[#e67e00] text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ Phân ca mới</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewAnnoOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-[#3e2723] hover:bg-[#504442] text-[#e4e4cc] font-semibold text-xs flex items-center gap-1.5 border border-[#827472]/40 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">campaign</span>
              <span>Đăng thông báo</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Pulse Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-[#1b1210]/80 p-3.5 rounded-xl border border-[#5b403c]/40 text-xs">
            <p className="text-[#827472] uppercase text-[10px] font-semibold">Đang trên sàn (Live)</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-lg font-bold text-white font-mono">{activeFloorShifts.length} Barista</p>
            </div>
          </div>

          <div className="bg-[#1b1210]/80 p-3.5 rounded-xl border border-[#5b403c]/40 text-xs">
            <p className="text-[#827472] uppercase text-[10px] font-semibold">Đơn chờ duyệt</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <p className="text-lg font-bold text-amber-400 font-mono">{pendingSwaps.length} yêu cầu</p>
            </div>
          </div>

          <div className="bg-[#1b1210]/80 p-3.5 rounded-xl border border-[#5b403c]/40 text-xs">
            <p className="text-[#827472] uppercase text-[10px] font-semibold">Tiến độ Checklist</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-bold text-[#ff8f00] font-mono">{taskPercent}%</p>
              <span className="text-[10px] text-[#827472]">({completedTasks}/{tasks.length})</span>
            </div>
          </div>

          <div className="bg-[#1b1210]/80 p-3.5 rounded-xl border border-[#5b403c]/40 text-xs">
            <p className="text-[#827472] uppercase text-[10px] font-semibold">Tổng nhân sự</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-bold text-white font-mono">{allUsers.length} thành viên</p>
            </div>
          </div>
        </div>

      </section>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#d3c3c0] pb-2 text-xs font-semibold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">monitoring</span>
          <span>Tong quan</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'roster'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">calendar_view_week</span>
          <span>Lịch phân ca tuần ({shifts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer relative ${
            activeTab === 'approvals'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">verified</span>
          <span>Xét duyệt đổi ca</span>
          {pendingSwaps.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#ff8f00] text-[#271310] text-[10px] font-bold">
              {pendingSwaps.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('checklists')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'checklists'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">checklist_rtl</span>
          <span>Giám sát Checklist ({taskPercent}%)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">group</span>
          <span>Đội ngũ Barista ({allUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer relative ${
            activeTab === 'evidence'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">photo_camera</span>
          <span>Duyet bang chung</span>
          {pendingEvidence.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#ff8f00] text-[#271310] text-[10px] font-bold">
              {pendingEvidence.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#271310] text-[#e4e4cc] shadow-sm'
              : 'bg-white text-[#504442] hover:bg-[#f6f3f2] border border-[#e5e2e1]'
          }`}
        >
          <span className="material-symbols-outlined text-base">campaign</span>
          <span>Bảng tin thông báo ({announcements.length})</span>
        </button>
      </div>


      {/* Tab 0: Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 3-Shift Tracker */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1]">
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310] mb-4">Theo dõi 3 Ca làm việc</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Ca Sáng', icon: 'wb_sunny', shifts: morningShift, color: '#ff8f00' },
                { label: 'Ca Trưa', icon: 'wb_twilight', shifts: midShift, color: '#d97706' },
                { label: 'Ca Tối', icon: 'dark_mode', shifts: closingShift, color: '#271310' },
              ].map((sh) => {
                const checkedIn = sh.shifts.filter(s => s.status === 'checked_in').length;
                const total = sh.shifts.length;
                return (
                  <div key={sh.label} className="p-4 rounded-xl border border-[#d3c3c0] bg-[#fcf9f8] text-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl" style={{ color: sh.color }}>{sh.icon}</span>
                      <span className="font-bold text-sm text-[#271310]">{sh.label}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#827472]">Nhân viên:</span>
                      <span className="font-mono font-bold text-[#271310]">{checkedIn}/{total} đang làm</span>
                    </div>
                    <div className="w-full h-2 bg-[#f0eded] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: total > 0 ? Math.round(checkedIn/total*100)+'%' : '0%', backgroundColor: sh.color }} />
                    </div>
                    <div className="space-y-1.5">
                      {sh.shifts.map(s => (
                        <div key={s.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#e5e2e1]">
                          <img src={s.userAvatar} alt={s.userName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="flex-1 text-[#271310] font-medium">{s.userName}</span>
                          <span className={s.status === 'checked_in' ? 'text-emerald-600 font-bold' : s.status === 'completed' ? 'text-gray-500' : 'text-blue-600'}>
                            {s.status === 'checked_in' ? 'Đang làm' : s.status === 'completed' ? 'Đã xong' : 'Sắp tới'}
                          </span>
                        </div>
                      ))}
                      {sh.shifts.length === 0 && <p className="text-[#827472] text-center py-2">Chưa phân ca</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1]">
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310] mb-1">Bảng xếp hạng thi đua</h3>
            <p className="text-xs text-[#827472] mb-4">Xếp hạng theo điểm thi đua - Cập nhật thực tế</p>
            <div className="space-y-3">
              {leaderboard.map((emp, i) => (
                <div key={emp.id} className={`flex items-center gap-3 p-3 rounded-xl border ${i === 0 ? 'bg-amber-50/60 border-amber-300' : 'bg-[#fcf9f8] border-[#e5e2e1]'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-gray-400 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-[#e5e2e1] text-[#827472]'}`}>
                    {i < 3 ? ['🥇','🥈','🥉'][i] : '#'+(i+1)}
                  </span>
                  <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[#271310]">{emp.name}</p>
                    <p className="text-[10px] text-[#827472]">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-[#ff8f00]">{emp.points || 0}</p>
                    <p className="text-[9px] text-[#827472] uppercase">điểm</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Evidence Review */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1] space-y-5">
          <div className="pb-3 border-b border-[#e5e2e1]">
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">
              Duyệt bằng chứng hoàn thành công việc
            </h3>
            <p className="text-xs text-[#827472]">Xet duyet 1-click - Phe duyet de tich điểm thi dua cho nhan vien</p>
          </div>
          {evidence.length === 0 ? (
            <p className="text-center text-xs text-[#827472] py-8">Chưa có bằng chứng nào được nộp.</p>
          ) : (
            <div className="space-y-3">
              {evidence.map(ev => (
                <div key={ev.id} className={`p-4 rounded-xl border text-xs space-y-3 ${ev.status === 'pending_review' ? 'bg-amber-50/40 border-amber-300' : 'bg-[#fcf9f8] border-[#e5e2e1]'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={ev.userAvatar} alt={ev.userName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm text-[#271310]">{ev.userName}</p>
                        <p className="text-[10px] text-[#827472]">Nộp lúc: {ev.submittedAt}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${ev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : ev.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800 animate-pulse'}`}>
                      {ev.status === 'approved' ? '✓ Đã duyệt' : ev.status === 'rejected' ? '✕ Từ chối' : '⏳ Cho duyet'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#e5e2e1]">
                    <p className="text-[#504442] italic">"{ev.note}"</p>
                  </div>
                  {ev.status === 'pending_review' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e5e2e1]">
                      <button type="button" onClick={() => onRejectEvidence(ev.id)} className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer">
                        Từ chối
                      </button>
                      <button type="button" onClick={() => onApproveEvidence(ev.id)} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer">
                        ✓ Duyet & +10 điểm
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Weekly Roster Manager */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e2e1]">
            <div>
              <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">
                Bảng phân ca làm việc toàn bộ nhân sự
              </h3>
              <p className="text-xs text-[#827472]">Theo dõi độ phủ ca và điều phối các trạm pha chế</p>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#827472] font-semibold">Lọc ngày:</span>
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
              >
                <option value="all">Tất cả các ngày</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d === todayStr ? `⭐ Hôm nay (${d})` : d}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsAddShiftOpen(true)}
                className="px-3 h-9 bg-[#ff8f00] hover:bg-[#e67e00] text-white font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Thêm ca</span>
              </button>
            </div>
          </div>

          {/* Roster Table / Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShifts.map((shift) => (
              <div
                key={shift.id}
                className="p-4 rounded-xl border border-[#d3c3c0] bg-[#fcf9f8] text-xs space-y-3 relative hover:shadow-md transition-all"
              >
                {/* Accent border */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  shift.status === 'checked_in'
                    ? 'bg-emerald-600'
                    : shift.type === 'morning'
                    ? 'bg-[#ff8f00]'
                    : shift.type === 'mid'
                    ? 'bg-amber-600'
                    : 'bg-[#271310]'
                }`} />

                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-2">
                    <img src={shift.userAvatar} alt={shift.userName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-xs text-[#271310]">{shift.userName}</p>
                      <p className="text-[10px] text-[#827472]">{shift.userPosition}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    shift.status === 'checked_in'
                      ? 'bg-emerald-100 text-emerald-800'
                      : shift.status === 'completed'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {shift.status === 'checked_in' ? 'Đang làm' : shift.status === 'completed' ? 'Đã xong' : 'Sắp tới'}
                  </span>
                </div>

                <div className="pl-2 space-y-1 bg-white p-2.5 rounded-lg border border-[#e5e2e1]">
                  <div className="flex justify-between items-center font-semibold text-[#1b1c1c]">
                    <span>📅 {shift.date}</span>
                    <span className="text-[#ff8f00]">{shift.startTime} - {shift.endTime}</span>
                  </div>
                  <p className="text-[#504442]">Trạm: <strong>{shift.station}</strong></p>
                  <span className={"text-xs font-bold " + (shift.duration === 5 ? "text-blue-600" : "text-emerald-600")}>Ca {shift.duration}h</span>
                  {shift.notes && (
                    <p className="text-[10px] text-[#827472] italic truncate">📝 {shift.notes}</p>
                  )}
                </div>

                <div className="flex justify-end pl-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onDeleteShift(shift.id)}
                    className="text-rose-600 hover:text-rose-800 text-[11px] font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Xóa ca</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Approvals Hub */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1] space-y-5">
          <div className="pb-3 border-b border-[#e5e2e1]">
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">
              Trung tâm phê duyệt yêu cầu (Shift Swaps & Leave Requests)
            </h3>
            <p className="text-xs text-[#827472]">
              Xét duyệt các yêu cầu đổi ca, nghỉ phép và ca phát sinh từ nhân viên
            </p>
          </div>

          <div className="space-y-4">
            {swaps.length === 0 ? (
              <p className="text-center text-xs text-[#827472] py-8">Chưa có yêu cầu đổi ca nào.</p>
            ) : (
              swaps.map((sw) => (
                <div
                  key={sw.id}
                  className={`p-4 rounded-xl border text-xs space-y-3 ${
                    sw.status === 'pending_manager'
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-[#fcf9f8] border-[#e5e2e1]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={sw.fromUserAvatar} alt={sw.fromUserName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm text-[#271310]">
                          {sw.fromUserName} 
                          {sw.toUserName ? ` ➔ Đổi với ${sw.toUserName}` : ' (Đăng nhượng ca trống)'}
                        </p>
                        <p className="text-[10px] text-[#827472]">Tạo lúc: {sw.createdAt}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase self-start sm:self-auto ${
                      sw.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : sw.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {sw.status === 'approved' ? '✓ Đã duyệt' : sw.status === 'rejected' ? '✕ Đã từ chối' : '⏳ Chờ Quản lý duyệt'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#e5e2e1] space-y-1">
                    <div className="flex justify-between items-center font-semibold text-[#1b1c1c]">
                      <span>📅 Ca làm việc: {sw.shiftDate}</span>
                      <span className="text-[#ff8f00]">{sw.shiftTime}</span>
                    </div>
                    <p className="text-[#827472]">Vị trí trạm: <strong className="text-[#504442]">{sw.shiftStation}</strong></p>
                    <p className="text-[#504442] italic mt-1 bg-[#fcf9f8] p-2 rounded">
                      "Lý do: {sw.reason}"
                    </p>
                  </div>

                  {sw.status === 'pending_manager' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#e5e2e1]">
                      <button
                        type="button"
                        onClick={() => onRejectSwap(sw.id)}
                        className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Từ chối
                      </button>
                      <button
                        type="button"
                        onClick={() => onApproveSwap(sw.id)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
                      >
                        ✓ Phê duyệt đổi ca
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Operational Checklists & Quality Monitor */}
      {activeTab === 'checklists' && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e2e1]">
            <div>
              <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">
                Giám sát Quy chuẩn Vận hành & Tiêu chuẩn Chiết xuất
              </h3>
              <p className="text-xs text-[#827472]">Theo dõi tiến độ hoàn thành các quy trình mở/đóng ca</p>
            </div>

            <div className="text-right">
              <span className="font-mono font-bold text-lg text-[#ff8f00]">{taskPercent}%</span>
              <p className="text-[10px] text-[#827472]">Tiến độ toàn tiệm hôm nay</p>
            </div>
          </div>

          <div className="w-full h-2.5 bg-[#f0eded] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff8f00] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${taskPercent}%` }}
            ></div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  task.completed
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-[#fcf9f8] border-[#e5e2e1] hover:border-[#ff8f00]'
                }`}
              >
                <button
                  type="button"
                  className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-[#827472] hover:border-[#ff8f00]'
                  }`}
                >
                  {task.completed && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </button>

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#271310]">{task.title}</span>
                    {task.isUrgent && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-bold">
                        QUAN TRỌNG
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-[11px] text-[#504442] mt-0.5">{task.description}</p>
                  )}
                  {task.completed && task.completedBy && (
                    <p className="text-[10px] text-emerald-700 mt-1">
                      ✓ Đã xác nhận: {task.completedBy} ({task.completedAt})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Staff Directory */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1] space-y-5">
          <div className="pb-3 border-b border-[#e5e2e1]">
            <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">
              Danh bạ nhân viên Barista & Nhân sự chi nhánh
            </h3>
            <p className="text-xs text-[#827472]">Hồ sơ chứng chỉ, năng lực và mức lương theo giờ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allUsers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-[#d3c3c0] bg-[#fcf9f8] text-xs space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-[#ff8f00]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#271310]">{member.name}</h4>
                      <p className="text-[11px] font-semibold text-[#8f4e00]">{member.position}</p>
                      <p className="text-[10px] text-[#827472]">{member.email}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#e4e4cc] text-[#271310] text-[10px] font-bold uppercase">
                    {member.role}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-[#e5e2e1] text-center font-mono">
                  <div>
                    <p className="text-[9px] text-[#827472] uppercase font-sans">Lương/giờ</p>
                    <p className="font-bold text-[#ff8f00] text-xs">{member.hourlyRate.toLocaleString()} đ</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#827472] uppercase font-sans">Giờ tháng</p>
                    <p className="font-bold text-[#271310] text-xs">{member.hoursWorkedMonth}h</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#827472] uppercase font-sans">Đúng giờ</p>
                    <p className="font-bold text-emerald-600 text-xs">{member.punctualityScore}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#827472]">Hotline: <strong>{member.phone}</strong></span>
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    className="px-2.5 py-1 rounded-lg bg-[#271310] text-[#e4e4cc] hover:bg-[#3e2723] text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">call</span>
                    <span>Gọi</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Announcements Board */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-[#e5e2e1] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e2e1]">
            <div>
              <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">
                Bảng tin & Thông báo cửa hàng
              </h3>
              <p className="text-xs text-[#827472]">Phát thông điệp hướng dẫn tới toàn bộ nhân sự</p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewAnnoOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-[#ff8f00] hover:bg-[#e67e00] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_comment</span>
              <span>Đăng thông báo mới</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {announcements.map((anno) => (
              <div
                key={anno.id}
                className={`p-4 rounded-xl border text-xs space-y-2 relative ${
                  anno.isPinned ? 'bg-[#e4e4cc]/40 border-[#ff8f00]' : 'bg-[#fcf9f8] border-[#e5e2e1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#ff8f00]/15 text-[#8f4e00] font-bold text-[10px]">
                      {anno.badge || 'Thông báo'}
                    </span>
                    {anno.isPinned && (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">push_pin</span>
                        <span>Đã ghim</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#827472]">{anno.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteAnnouncement(anno.id)}
                      className="text-rose-600 hover:text-rose-800 text-[11px]"
                      title="Xóa bài đăng"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-[#271310]">{anno.title}</h4>
                <p className="text-[#504442] text-xs leading-relaxed">{anno.content}</p>

                <div className="flex items-center gap-2 pt-2 border-t border-[#d3c3c0]/50 text-[10px] text-[#827472]">
                  <img src={anno.authorAvatar} alt={anno.authorName} className="w-5 h-5 rounded-full object-cover" />
                  <span>Đăng bởi <strong>{anno.authorName}</strong> ({anno.authorRole})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddShiftModal
        allUsers={allUsers}
        isOpen={isAddShiftOpen}
        onClose={() => setIsAddShiftOpen(false)}
        onAddShift={onAddShift}
      />

      <NewAnnouncementModal
        currentUser={manager}
        isOpen={isNewAnnoOpen}
        onClose={() => setIsNewAnnoOpen(false)}
        onPostAnnouncement={onPostAnnouncement}
      />

    </div>
  );
};
