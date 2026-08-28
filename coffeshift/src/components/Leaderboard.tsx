import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LeaderboardProps {
  allUsers: UserProfile[];
  currentUser: UserProfile;
}

type TimeFilter = 'week' | 'month' | 'all';

export const Leaderboard: React.FC<LeaderboardProps> = ({ allUsers, currentUser }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  // Filter employees only (no managers)
  const employees = allUsers.filter(u => u.role === 'employee');
  
  // Sort by points descending
  const sorted = [...employees].sort((a, b) => (b.points || 0) - (a.points || 0));
  
  const maxPoints = sorted[0]?.points || 1;

  const medals = ['🥇', '🥈', '🥉'];
  
  const getBarWidth = (points: number) => {
    return Math.max(5, (points / maxPoints) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Time Filter Tabs */}
      <div className="flex gap-2">
        {([
          { id: 'week' as TimeFilter, label: 'Tuần này', icon: 'date_range' },
          { id: 'month' as TimeFilter, label: 'Tháng này', icon: 'calendar_month' },
          { id: 'all' as TimeFilter, label: 'Tất cả', icon: 'all_inclusive' },
        ]).map(filter => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setTimeFilter(filter.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              timeFilter === filter.id
                ? 'bg-[#ff8f00] text-white shadow-sm'
                : 'bg-[#f3f0ee] text-[#827472] hover:bg-[#e8e4e2]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Current User Card */}
      <div className="bg-gradient-to-r from-[#271310] to-[#3e2723] rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#ff8f00]" />
          <div className="flex-1">
            <p className="text-xs text-[#e4e4cc]/60">Xếp hạng của bạn</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-['Montserrat']">#{sorted.findIndex(u => u.id === currentUser.id) + 1}</span>
              <span className="text-sm text-[#e4e4cc]/80">trong {employees.length} nhân viên</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#ff8f00]">{currentUser.points || 0}</p>
            <p className="text-[10px] text-[#e4e4cc]/60 uppercase">điểm</p>
          </div>
        </div>
      </div>

      {/* How to Earn */}
      <div className="bg-white rounded-xl border border-[#e5e2e1] p-3">
        <div className="flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[#ff8f00] text-base">login</span>
          <p className="text-xs text-[#827472]">
            Điểm danh đúng giờ: <strong className="text-[#271310]">+5 điểm</strong>
            <span className="mx-2">•</span>
            Đi trễ: <strong className="text-red-500">-5 điểm</strong>
          </p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {sorted.map((emp, index) => {
          const isCurrentUser = emp.id === currentUser.id;
          const points = emp.points || 0;
          
          return (
            <div
              key={emp.id}
              className={`rounded-xl border transition-all ${
                isCurrentUser
                  ? 'bg-[#fff7ed] border-[#ff8f00]/30 shadow-sm'
                  : 'bg-white border-[#e5e2e1]'
              }`}
            >
              <div className="p-3 flex items-center gap-3">
                {/* Rank */}
                <div className="w-8 text-center">
                  {index < 3 ? (
                    <span className="text-xl">{medals[index]}</span>
                  ) : (
                    <span className="text-sm font-bold text-[#827472]">#{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <img src={emp.avatar} alt={emp.name} className={`w-10 h-10 rounded-full object-cover ${
                  isCurrentUser ? 'ring-2 ring-[#ff8f00]' : ''
                }`} />

                {/* Name & Position */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isCurrentUser ? 'text-[#ff8f00]' : 'text-[#271310]'
                  }`}>
                    {emp.name}
                    {isCurrentUser && <span className="text-[10px] ml-1">(Bạn)</span>}
                  </p>
                  <p className="text-[10px] text-[#827472] truncate">{emp.position}</p>
                  
                  {/* Points Bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${getBarWidth(points)}%`,
                          backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#ff8f00'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-lg font-bold text-[#ff8f00]">{points}</p>
                  <p className="text-[9px] text-[#827472] uppercase">điểm</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl border border-[#e5e2e1] p-4">
        <h3 className="text-xs font-bold text-[#271310] mb-3 uppercase tracking-wide">Thống kê</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-[#ff8f00]">{employees.length}</p>
            <p className="text-[10px] text-[#827472]">Nhân viên</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#ff8f00]">
              {Math.round(employees.reduce((sum, e) => sum + (e.points || 0), 0) / employees.length) || 0}
            </p>
            <p className="text-[10px] text-[#827472]">Điểm TB</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#ff8f00]">{maxPoints}</p>
            <p className="text-[10px] text-[#827472]">Cao nhất</p>
          </div>
        </div>
      </div>
    </div>
  );
};
