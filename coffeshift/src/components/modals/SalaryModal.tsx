import React from 'react';
import { UserProfile, Shift } from '../../types';

interface SalaryModalProps {
  user: UserProfile;
  shifts: Shift[];
  isOpen: boolean;
  onClose: () => void;
}

export const SalaryModal: React.FC<SalaryModalProps> = ({ user, shifts, isOpen, onClose }) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const userShifts = shifts.filter(s => s.userId === user.id);
  const completedShifts = userShifts.filter(s => s.status === 'completed');
  const thisMonthShifts = userShifts.filter(s => {
    const d = new Date(s.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Calculate this month's earnings
  const hourlyRate = user.hourlyRate;
  const hoursWorked = user.hoursWorkedMonth;
  const estimatedSalary = hourlyRate * hoursWorked;
  const tax = Math.round(estimatedSalary * 0.1);
  const insurance = Math.round(estimatedSalary * 0.05);
  const netSalary = estimatedSalary - tax - insurance;

  // Today's shift
  const todayShift = userShifts.find(s => s.date === todayStr);
  const todayHours = todayShift?.duration || 0;
  const todayEarning = todayHours * hourlyRate;

  // QR URL (mock - in real app this would be a deep link)
  const qrUrl = `https://coffeeshift.app/salary/${user.id}?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}&bgcolor=271310&color=ff8f00&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-[90%] max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#271310] to-[#3e2723] p-5 rounded-t-2xl text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Bảng lương tháng</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#ff8f00]" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-white/60">{user.position}</p>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="p-5 space-y-4">
          {/* Net Salary */}
          <div className="bg-[#fff7ed] rounded-xl p-4 text-center border border-[#ff8f00]/20">
            <p className="text-xs text-[#827472] uppercase tracking-wide">Lương thực nhận (dự kiến)</p>
            <p className="text-3xl font-bold text-[#ff8f00] font-['Montserrat'] mt-1">
              {netSalary.toLocaleString('vi-VN')}đ
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-[#827472]">Lương cơ bản</span>
              <span className="text-sm font-semibold text-[#271310]">{estimatedSalary.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-[#827472]">Tỷ lệ lương/giờ</span>
              <span className="text-sm font-semibold text-[#271310]">{hourlyRate.toLocaleString('vi-VN')}đ/h</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-[#827472]">Giờ làm tháng này</span>
              <span className="text-sm font-semibold text-[#271310]">{hoursWorked}h</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-[#827472]">Ca đã hoàn thành</span>
              <span className="text-sm font-semibold text-[#271310]">{completedShifts.length} ca</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-red-500">Thuế TNCN (10%)</span>
              <span className="text-sm font-semibold text-red-500">-{tax.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-red-500">BHXH (5%)</span>
              <span className="text-sm font-semibold text-red-500">-{insurance.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Today's shift */}
          {todayShift && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-bold text-[#271310] mb-2">Ca hôm nay</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#827472]">{todayShift.startTime} - {todayShift.endTime}</p>
                  <p className="text-xs text-[#827472]">{todayShift.station}</p>
                </div>
                <span className="text-sm font-bold text-[#ff8f00]">+{todayEarning.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#827472] mb-2">Quét để xem chi tiết lương</p>
            <div className="inline-block bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
              <img src={qrImageUrl} alt="Salary QR" className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
