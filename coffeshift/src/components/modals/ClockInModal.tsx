import React, { useState } from 'react';
import { Shift, UserProfile } from '../../types';

interface ClockInModalProps {
  shift?: Shift;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClockIn: (shiftId: string, station: string) => void;
  onConfirmClockOut: (shiftId: string) => void;
  isClockingOut?: boolean;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({
  shift,
  user,
  isOpen,
  onClose,
  onConfirmClockIn,
  onConfirmClockOut,
  isClockingOut = false,
}) => {
  const [station, setStation] = useState(shift?.station || 'Espresso Bar 1');
  const [uniformChecked, setUniformChecked] = useState(true);
  const [hygieneChecked, setHygieneChecked] = useState(true);
  const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#d3c3c0] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e2e1]">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isClockingOut ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <span className="material-symbols-outlined text-2xl">
                {isClockingOut ? 'timer_off' : 'verified_user'}
              </span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] font-bold text-base text-[#271310]">
                {isClockingOut ? 'Xác nhận Kết ca (Clock Out)' : 'Điểm danh vào ca (Clock In)'}
              </h3>
              <p className="text-xs text-[#827472] font-['Inter']">
                {user.branch}
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

        {/* Content */}
        <div className="py-4 space-y-4 text-xs font-['Inter'] text-[#504442]">
          
          {/* Location Verification Badge */}
          <div className="bg-[#f6f3f2] p-3 rounded-xl border border-emerald-300/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">my_location</span>
              <div>
                <p className="font-semibold text-[#1b1c1c] text-xs">Vị trí GPS: Tại cửa hàng</p>
                <p className="text-[11px] text-[#827472]">Khoảng cách: 12m (Trong bán kính cho phép)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              HỢP LỆ
            </span>
          </div>

          {/* Time & Shift Details */}
          <div className="bg-[#fcf9f8] p-3.5 rounded-xl border border-[#e5e2e1] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#827472]">Nhân sự:</span>
              <span className="font-bold text-[#271310]">{user.name} ({user.position.split('&')[0]})</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#827472]">Thời gian hiện tại:</span>
              <span className="font-mono font-bold text-[#ff8f00] text-sm">{currentTime}</span>
            </div>
            {shift && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#827472]">Khung ca chuẩn:</span>
                <span className="font-semibold text-[#271310]">{shift.startTime} - {shift.endTime}</span>
              </div>
            )}
          </div>

          {!isClockingOut ? (
            <>
              {/* Station Selection */}
              <div>
                <label className="block font-semibold text-[#271310] text-xs mb-1.5">
                  Vị trí phụ trách hôm nay:
                </label>
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
                >
                  <option value="Espresso Bar 1">Espresso Bar 1 (Máy Slayer EP / Mahlkönig)</option>
                  <option value="Espresso Bar 2">Espresso Bar 2 (La Marzocco / Milk Steaming)</option>
                  <option value="Pour Over & Cold Brew">Trạm pha thủ công V60 & Cold Brew Nitro</option>
                  <option value="POS & Cashier">Thu ngân & Tiếp đón khách hàng</option>
                  <option value="Kitchen & Bakery">Bếp bánh & Chuẩn bị nguyên liệu</option>
                  <option value="Floor & Service">Phục vụ sàn & Tiếp thực</option>
                  <option value="Shift Supervisor">Điều phối & Giám sát ca</option>
                </select>
              </div>

              {/* Pre-shift check */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={uniformChecked}
                    onChange={(e) => setUniformChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff8f00] focus:ring-[#ff8f00]"
                  />
                  <span>Đã trang bị tạp dề sạch, bảng tên và giày chống trượt</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hygieneChecked}
                    onChange={(e) => setHygieneChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff8f00] focus:ring-[#ff8f00]"
                  />
                  <span>Đã rửa tay sát khuẩn 6 bước theo tiêu chuẩn HACCP</span>
                </label>
              </div>
            </>
          ) : (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
              <p className="font-semibold">⚠️ Lưu ý trước khi rời ca:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                <li>Đảm bảo đã hoàn thành bảng kiểm closing checklist.</li>
                <li>Bàn giao số lượng hạt, sữa tồn và két tiền cho ca tiếp theo.</li>
                <li>Tắt vòi hơi nước và lau khô khay nhỏ giọt máy pha.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 pt-2 border-t border-[#e5e2e1]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#d3c3c0] text-[#504442] font-semibold text-xs rounded-lg hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          
          {isClockingOut ? (
            <button
              type="button"
              onClick={() => {
                if (shift) onConfirmClockOut(shift.id);
                onClose();
              }}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              Xác nhận Ra ca
            </button>
          ) : (
            <button
              type="button"
              disabled={!uniformChecked || !hygieneChecked}
              onClick={() => {
                if (shift) onConfirmClockIn(shift.id, station);
                onClose();
              }}
              className="flex-1 py-2.5 bg-[#ff8f00] hover:bg-[#e67e00] disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              Vào ca ngay
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
