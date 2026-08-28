import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { UserProfile, AppNotification } from '../types';

interface NavigationHeaderProps {
  currentUser: UserProfile;
  notifications: AppNotification[];
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  allUsers: UserProfile[];
      onClearNotifications: () => void;
  onMarkNotificationRead: (id: string) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentUser,
  notifications,
  onLogout,
  onSwitchUser,
  allUsers,
      onMarkNotificationRead,
}) => {
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full bg-[#271310] border-b border-[#3e2723] text-[#e4e4cc] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Montserrat'] font-bold text-lg text-[#fcf9f8] tracking-tight leading-tight">
                CoffeeShift
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#3e2723] text-[#ff8f00] border border-[#ff8f00]/30">
                {currentUser.role === 'manager' ? 'Manager Portal' : 'Nhân viên App'}
              </span>
            </div>
            <p className="text-[11px] text-[#e4e4cc]/70 hidden md:block leading-none mt-0.5">
              {currentUser.branch}
            </p>
          </div>
        </div>

        {/* Center Live Clock */}
        <div className="hidden lg:flex items-center gap-2 bg-[#1b1210] px-3 py-1.5 rounded-full border border-[#3e2723] text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono font-medium text-[#fcf9f8]">
            {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-[#827472]">|</span>
          <span className="text-[#e4e4cc]/80 text-[11px]">
            {time.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="px-2 py-1.5 rounded-lg bg-[#3e2723] hover:bg-[#504442] text-[#e4e4cc] text-xs flex items-center gap-1.5 border border-[#827472]/30 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-[#ff8f00]"
              />
              <span className="font-medium hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>

            {/* User switch dropdown */}
            {showUserMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#fcf9f8] text-[#1b1c1c] rounded-xl shadow-2xl border border-[#d3c3c0] p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-[#e5e2e1]">
                  <p className="text-xs font-semibold text-[#827472] uppercase">Đổi tài khoản Demo</p>
                </div>
                <div className="space-y-1 py-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSwitchUser(u.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left rounded-lg text-xs flex items-center justify-between transition-colors ${
                        u.id === currentUser.id
                          ? 'bg-[#e4e4cc] text-[#271310] font-bold'
                          : 'hover:bg-[#f0eded] text-[#504442]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate">
                          <p className="font-semibold truncate">{u.name}</p>
                          <p className="text-[10px] text-[#827472] capitalize">{u.role === 'manager' ? 'Quản lý cửa hàng' : u.position.split('&')[0]}</p>
                        </div>
                      </div>
                      {u.id === currentUser.id && (
                        <span className="material-symbols-outlined text-[#ff8f00] text-sm">check</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#e5e2e1] pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg bg-[#3e2723] hover:bg-[#504442] text-[#e4e4cc] transition-colors cursor-pointer"
              aria-label="Thông báo"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff8f00] text-[#271310] text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifs && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white text-[#1b1c1c] rounded-xl shadow-2xl border border-[#d3c3c0] p-3 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#e5e2e1]">
                  <span className="font-['Montserrat'] font-bold text-xs text-[#271310]">
                    Thông báo ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => notifications.forEach((n) => onMarkNotificationRead(n.id))}
                      className="text-[11px] text-[#ff8f00] hover:underline font-medium"
                    >
                      Đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#f0eded] max-h-72 overflow-y-auto mt-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-[#827472] py-4">Chưa có thông báo nào</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className={`py-2.5 px-1.5 text-xs transition-colors cursor-pointer rounded-lg ${
                          notif.read ? 'opacity-70 hover:bg-gray-50' : 'bg-[#fcf9f8] font-medium hover:bg-[#f6f3f2]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`material-symbols-outlined text-base mt-0.5 ${
                            notif.type === 'shift' ? 'text-[#ff8f00]' : notif.type === 'approval' ? 'text-emerald-600' : 'text-blue-600'
                          }`}>
                            {notif.type === 'shift' ? 'schedule' : notif.type === 'approval' ? 'verified' : 'campaign'}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-[#271310] text-[12px]">{notif.title}</p>
                              <span className="text-[10px] text-[#827472]">{notif.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-[#504442] mt-0.5 leading-snug">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 rounded-lg bg-[#3e2723] hover:bg-rose-900/50 text-[#e4e4cc] hover:text-rose-300 transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
