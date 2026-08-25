import React, { useState } from 'react';
import { Shift, UserProfile, ShiftType, StationType } from '../../types';

interface AddShiftModalProps {
  allUsers: UserProfile[];
  isOpen: boolean;
  onClose: () => void;
  onAddShift: (newShift: Omit<Shift, 'id'>) => void;
}

export const AddShiftModal: React.FC<AddShiftModalProps> = ({
  allUsers,
  isOpen,
  onClose,
  onAddShift,
}) => {
  const employeeUsers = allUsers.filter((u) => u.role === 'employee');
  const today = new Date().toISOString().split('T')[0];

  const [userId, setUserId] = useState(employeeUsers[0]?.id || '');
  const [date, setDate] = useState(today);
  const [shiftPreset, setShiftPreset] = useState<ShiftType>('morning');
  const [startTime, setStartTime] = useState('06:30');
  const [endTime, setEndTime] = useState('14:30');
  const [station, setStation] = useState<StationType>('Espresso Bar 1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handlePresetChange = (type: ShiftType) => {
    setShiftPreset(type);
    if (type === 'morning') {
      setStartTime('06:30');
      setEndTime('14:30');
    } else if (type === 'mid') {
      setStartTime('11:00');
      setEndTime('19:00');
    } else if (type === 'closing') {
      setStartTime('14:30');
      setEndTime('22:30');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = allUsers.find((u) => u.id === userId) || employeeUsers[0];
    if (!selectedUser) return;

    onAddShift({
      userId: selectedUser.id,
      userName: selectedUser.name,
      userAvatar: selectedUser.avatar,
      userPosition: selectedUser.position.split('&')[0].trim(),
      role: selectedUser.role,
      date,
      startTime,
      endTime,
      type: shiftPreset,
      station,
      status: 'upcoming',
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#d3c3c0] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e2e1]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#ff8f00]/15 text-[#8f4e00] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">calendar_add_on</span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] font-bold text-base text-[#271310]">
                Phân ca làm việc mới
              </h3>
              <p className="text-xs text-[#827472] font-['Inter']">
                Lên lịch ca và điều phối trạm pha chế
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-[#827472] hover:text-[#271310] text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs font-['Inter'] text-[#504442]">
          
          {/* Select Barista */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Nhân viên barista:
            </label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'manager' ? 'Quản lý' : u.position})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Ngày làm việc:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
            />
          </div>

          {/* Shift Type Presets */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Loại ca làm việc:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetChange('morning')}
                className={`py-2 px-2 rounded-lg text-center font-semibold text-xs border transition-all ${
                  shiftPreset === 'morning'
                    ? 'bg-[#ff8f00]/15 border-[#ff8f00] text-[#8f4e00]'
                    : 'border-[#d3c3c0] text-[#504442] hover:bg-gray-50'
                }`}
              >
                ☀️ Ca Sáng<br/>
                <span className="text-[10px] font-normal text-[#827472]">06:30 - 14:30</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('mid')}
                className={`py-2 px-2 rounded-lg text-center font-semibold text-xs border transition-all ${
                  shiftPreset === 'mid'
                    ? 'bg-[#ff8f00]/15 border-[#ff8f00] text-[#8f4e00]'
                    : 'border-[#d3c3c0] text-[#504442] hover:bg-gray-50'
                }`}
              >
                ☕ Ca Giữa<br/>
                <span className="text-[10px] font-normal text-[#827472]">11:00 - 19:00</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('closing')}
                className={`py-2 px-2 rounded-lg text-center font-semibold text-xs border transition-all ${
                  shiftPreset === 'closing'
                    ? 'bg-[#ff8f00]/15 border-[#ff8f00] text-[#8f4e00]'
                    : 'border-[#d3c3c0] text-[#504442] hover:bg-gray-50'
                }`}
              >
                🌙 Ca Tối<br/>
                <span className="text-[10px] font-normal text-[#827472]">14:30 - 22:30</span>
              </button>
            </div>
          </div>

          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#271310] mb-1">Giờ bắt đầu:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#271310] mb-1">Giờ kết thúc:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
              />
            </div>
          </div>

          {/* Station Selection */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Trạm phân công (Station):
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value as StationType)}
              className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
            >
              <option value="Espresso Bar 1">Espresso Bar 1 (Slayer EP / Dial-in)</option>
              <option value="Espresso Bar 2">Espresso Bar 2 (La Marzocco / Milk Bar)</option>
              <option value="Pour Over & Cold Brew">Pour Over V60 & Cold Brew Nitro</option>
              <option value="POS & Cashier">Thu ngân & Chăm sóc khách</option>
              <option value="Kitchen & Bakery">Bếp bánh & Sơ chế nguyên liệu</option>
              <option value="Floor & Service">Tiếp thực & Vệ sinh sảnh</option>
              <option value="Shift Supervisor">Giám sát & Điều phối ca</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Ghi chú nhiệm vụ đặc biệt (Tùy chọn):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Kiểm kê hạt mộc, ủ Cold Brew, backflush máy pha..."
              className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-[#e5e2e1]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#d3c3c0] text-[#504442] font-semibold text-xs rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#ff8f00] hover:bg-[#e67e00] text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              Tạo & Lưu ca
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
