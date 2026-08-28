import React, { useState, useEffect } from 'react';
import { Shift, UserProfile } from '../../types';

interface ClockInModalProps {
  shift?: Shift;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClockIn: (shiftId: string, station: string, location?: { lat: number; lng: number; address: string }) => void;
  onConfirmClockOut: (shiftId: string) => void;
  isClockingOut?: boolean;
}

const SHOP_LAT = 10.7769;
const SHOP_LNG = 106.7009;
const ALLOWED_RADIUS = 500;

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLam = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLam / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch("https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lng + "&format=json&accept-language=vi");
    const data = await res.json();
    return data.display_name || (lat.toFixed(5) + ", " + lng.toFixed(5));
  } catch {
    return lat.toFixed(5) + ", " + lng.toFixed(5);
  }
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
  const [gpsState, setGpsState] = useState("loading" as "loading" | "success" | "error" | "denied");
  const [gpsData, setGpsData] = useState(null as { lat: number; lng: number; address: string; distance: number } | null);

  useEffect(() => {
    if (!isOpen || isClockingOut) return;
    setGpsState("loading");
    setGpsData(null);
    if (!navigator.geolocation) { setGpsState("error"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const dist = getDistance(lat, lng, SHOP_LAT, SHOP_LNG);
        const address = await reverseGeocode(lat, lng);
        setGpsData({ lat, lng, address, distance: Math.round(dist) });
        setGpsState("success");
      },
      (err) => { setGpsState(err.code === 1 ? "denied" : "error"); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [isOpen, isClockingOut]);

  const isInRange = gpsData && gpsData.distance <= ALLOWED_RADIUS;

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
          
          {!isClockingOut && (
            <div className={"p-3 rounded-xl border flex items-center justify-between " + (gpsState === "success" && gpsData && gpsData.distance <= ALLOWED_RADIUS ? "bg-[#f0faf4] border-emerald-300/60" : gpsState === "success" ? "bg-red-50 border-red-300/60" : gpsState === "loading" ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200")}>
              <div className="flex items-center gap-2">
                <span className={"material-symbols-outlined text-lg " + (gpsState === "success" && gpsData && gpsData.distance <= ALLOWED_RADIUS ? "text-emerald-600" : gpsState === "success" ? "text-red-600" : gpsState === "loading" ? "text-blue-500 animate-spin" : "text-red-400")}>
                  {gpsState === "loading" ? "sync" : gpsState === "denied" ? "location_off" : gpsState === "error" ? "error" : "my_location"}
                </span>
                <div>
                  {gpsState === "loading" && <p className="font-semibold text-blue-700 text-xs">Đang xác định vị trí GPS...</p>}
                  {gpsState === "denied" && <p className="font-semibold text-red-700 text-xs">Quyền truy cập vị trí bị từ chối</p>}
                  {gpsState === "error" && <p className="font-semibold text-red-700 text-xs">Không thể xác định vị trí</p>}
                  {gpsState === "success" && gpsData && (
                    <>
                      <p className="font-semibold text-[#1b1c1c] text-xs">
                        {gpsData.distance <= ALLOWED_RADIUS ? "Vị trí GPS: Tại cửa hàng" : "Vị trí GPS: Ngoài cửa hàng"}
                      </p>
                      <p className="text-[11px] text-[#827472]">
                        {"Khoảng cách: " + gpsData.distance + "m " + (gpsData.distance <= ALLOWED_RADIUS ? "(Trong bán kính cho phép)" : "(Ngoài bán kính " + ALLOWED_RADIUS + "m)")}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {gpsState === "success" && gpsData && (
                <span className={"px-2 py-0.5 rounded-full font-bold text-[10px] " + (gpsData.distance <= ALLOWED_RADIUS ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")}>
                  {gpsData.distance <= ALLOWED_RADIUS ? "HỢP LỆ" : "KHÔNG HỢP LỆ"}
                </span>
              )}
            </div>
          )}

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
            {gpsState === "success" && gpsData && (
              <div className="flex justify-between items-start text-xs">
                <span className="text-[#827472] flex-shrink-0">Địa chỉ:</span>
                <span className="font-medium text-[#271310] text-right ml-2 leading-tight max-w-[200px]">{gpsData.address}</span>
              </div>
            )}
            {shift && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#827472]">Khung ca chuẩn:</span>
                <span className="font-semibold text-[#271310]">{shift.startTime} - {shift.endTime}</span>
              </div>
            )}
          </div>

          {!isClockingOut ? (
            <>
              
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
                if (shift) { const loc = gpsData ? { lat: gpsData.lat, lng: gpsData.lng, address: gpsData.address } : undefined; onConfirmClockIn(shift.id, station, loc); }
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
