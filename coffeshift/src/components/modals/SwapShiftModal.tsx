import React, { useState } from 'react';
import { Shift, UserProfile } from '../../types';

interface SwapShiftModalProps {
  userShifts: Shift[];
  allUsers: UserProfile[];
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSwap: (params: {
    shiftId: string;
    shiftDate: string;
    shiftTime: string;
    shiftStation: string;
    toUserId?: string;
    reason: string;
  }) => void;
}

export const SwapShiftModal: React.FC<SwapShiftModalProps> = ({
  userShifts,
  allUsers,
  currentUserId,
  isOpen,
  onClose,
  onSubmitSwap,
}) => {
  const futureShifts = userShifts.filter((s) => s.status !== 'completed');
  const [selectedShiftId, setSelectedShiftId] = useState(futureShifts[0]?.id || '');
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [swapMode, setSwapMode] = useState<'peer' | 'open'>('peer');

  if (!isOpen) return null;

  const selectedShift = userShifts.find((s) => s.id === selectedShiftId) || futureShifts[0];
  const eligiblePeers = allUsers.filter((u) => u.id !== currentUserId && u.role === 'employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShift) return;

    onSubmitSwap({
      shiftId: selectedShift.id,
      shiftDate: selectedShift.date,
      shiftTime: `${selectedShift.startTime} - ${selectedShift.endTime}`,
      shiftStation: selectedShift.station,
      toUserId: swapMode === 'peer' ? targetUserId : undefined,
      reason: reason.trim() || 'Có việc cá nhân cần hỗ trợ đổi ca.',
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
              <span className="material-symbols-outlined text-2xl">published_with_changes</span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] font-bold text-base text-[#271310]">
                Tạo yêu cầu Đổi ca làm việc
              </h3>
              <p className="text-xs text-[#827472] font-['Inter']">
                Yêu cầu sẽ được gửi tới đồng nghiệp và quản lý duyệt
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
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs font-['Inter'] text-[#504442]">
          
          {/* Mode Switcher */}
          <div className="flex bg-[#f0eded] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setSwapMode('peer')}
              className={`flex-1 py-2 rounded-md font-semibold text-xs transition-all ${
                swapMode === 'peer' ? 'bg-white text-[#271310] shadow-sm' : 'text-[#827472]'
              }`}
            >
              Đổi với người cụ thể
            </button>
            <button
              type="button"
              onClick={() => setSwapMode('open')}
              className={`flex-1 py-2 rounded-md font-semibold text-xs transition-all ${
                swapMode === 'open' ? 'bg-white text-[#271310] shadow-sm' : 'text-[#827472]'
              }`}
            >
              Đăng lên Chợ ca trống
            </button>
          </div>

          {/* Select Shift to swap */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1.5">
              Chọn ca làm việc muốn nhượng / đổi:
            </label>
            {futureShifts.length === 0 ? (
              <p className="p-3 bg-amber-50 rounded-lg text-amber-800 border border-amber-200">
                Bạn hiện không có ca làm việc tương lai nào để đổi.
              </p>
            ) : (
              <select
                value={selectedShiftId}
                onChange={(e) => setSelectedShiftId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
              >
                {futureShifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    📅 {s.date} | {s.startTime} - {s.endTime} ({s.type === 'morning' ? 'Ca Sáng' : s.type === 'mid' ? 'Ca Giữa' : 'Ca Tối'}) - {s.station}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Select Peer */}
          {swapMode === 'peer' && (
            <div>
              <label className="block font-semibold text-[#271310] mb-1.5">
                Đồng nghiệp muốn đổi ca cùng:
              </label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required={swapMode === 'peer'}
                className="w-full h-11 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
              >
                <option value="">-- Chọn đồng nghiệp barista --</option>
                {eligiblePeers.map((peer) => (
                  <option key={peer.id} value={peer.id}>
                    ☕ {peer.name} ({peer.position})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block font-semibold text-[#271310] mb-1.5">
              Lý do đổi ca:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Trùng lịch thi trường đại học, có lịch khám sức khỏe, tham gia hội thảo cà phê..."
              required
              className="w-full p-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none resize-none"
            />
          </div>

          <div className="bg-[#fcf9f8] p-3 rounded-lg border border-[#e5e2e1] text-[11px] text-[#827472] flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-[#ff8f00] mt-0.5">info</span>
            <span>Sau khi gửi, đồng nghiệp sẽ nhận thông báo xác nhận. Khi hai bên đồng thuận, Quản lý cửa hàng sẽ phê duyệt tự động trên hệ thống.</span>
          </div>

          {/* Buttons */}
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
              disabled={futureShifts.length === 0}
              className="flex-1 py-2.5 bg-[#ff8f00] hover:bg-[#e67e00] disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              Gửi yêu cầu đổi ca
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
