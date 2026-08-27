import React, { useState, useEffect } from 'react';
import { UserProfile, Shift, TaskItem, ShiftSwapRequest, StoreAnnouncement, AppNotification, UserRole, TaskEvidence, ShiftHandover } from './types';
import { INITIAL_USERS, INITIAL_SHIFTS, INITIAL_TASKS, INITIAL_SWAPS, INITIAL_ANNOUNCEMENTS, INITIAL_NOTIFICATIONS, INITIAL_EVIDENCE, INITIAL_HANDOVERS } from './data/mockData';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { NavigationHeader } from './components/NavigationHeader';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';

export default function App() {
  // State management with localStorage persistence
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('coffeeshift_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('coffeeshift_current_user_id') || null;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('coffeeshift_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('coffeeshift_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>(() => {
    const saved = localStorage.getItem('coffeeshift_swaps');
    return saved ? JSON.parse(saved) : INITIAL_SWAPS;
  });

  const [announcements, setAnnouncements] = useState<StoreAnnouncement[]>(() => {
    const saved = localStorage.getItem('coffeeshift_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('coffeeshift_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [evidence, setEvidence] = useState<TaskEvidence[]>(() => {
    const saved = localStorage.getItem('coffeeshift_evidence');
    return saved ? JSON.parse(saved) : INITIAL_EVIDENCE;
  });

  const [handovers, setHandovers] = useState<ShiftHandover[]>(() => {
    const saved = localStorage.getItem('coffeeshift_handovers');
    return saved ? JSON.parse(saved) : INITIAL_HANDOVERS;
  });

  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('coffeeshift_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('coffeeshift_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('coffeeshift_current_user_id');
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_swaps', JSON.stringify(swaps));
  }, [swaps]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_evidence', JSON.stringify(evidence));
  }, [evidence]);

  useEffect(() => {
    localStorage.setItem('coffeeshift_handovers', JSON.stringify(handovers));
  }, [handovers]);

const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  // Handle Login
  const handleLogin = (role: UserRole, email: string) => {
    const userMatch = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || users.find((u) => u.role === role);
    if (userMatch) {
      setCurrentUserId(userMatch.id);
      showToast(`Chào mừng ${userMatch.name} quay trở lại CoffeeShift! ☕`);
    } else {
      const fallbackUser = users.find((u) => u.role === role) || users[0];
      setCurrentUserId(fallbackUser.id);
      showToast(`Đăng nhập thành công với vai trò ${role === 'manager' ? 'Quản lý' : 'Nhân viên'}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    showToast('Đã đăng xuất khỏi phiên làm việc.');
  };

  const handleSwitchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      showToast(`Đã chuyển sang tài khoản ${target.name} (${target.role === 'manager' ? 'Quản lý' : 'Nhân viên'})`);
    }
  };

  // Clock In handler (on-time = +5 points)
  const handleClockIn = (shiftId: string, station: string, location?: { lat: number; lng: number; address: string }) => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? { ...s, status: 'checked_in', checkInTime: now, station: station as any }
          : s
      )
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Đã vào ca làm việc',
      message: `Bạn đã điểm danh thành công lúc ${now} tại trạm ${station}. Chúc một ngày làm việc tuyệt vời!`,
      type: 'shift',
      timestamp: now,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    // On-time bonus: +5
    const curShift = shifts.find(s => s.id === shiftId);
    let pts = 5, ptMsg = 'Điểm danh đúng giờ! +5 điểm thi đua';
    if (curShift?.startTime) {
      const [cH, cM] = now.split(':').map(Number);
      const [sH, sM] = curShift.startTime.split(':').map(Number);
      if (cH * 60 + cM > sH * 60 + sM + 10) { pts = -5; ptMsg = 'Điểm danh trễ! -5 điểm'; }
    }
    if (currentUser) setUsers(p => p.map(u => u.id === currentUser.id ? { ...u, points: (u.points||0) + pts } : u));
    showToast(`✓ Đã Clock In vào ca lúc ${now} tại ${station}! ☕ ${ptMsg}`);
  };

  // Clock Out handler
  const handleClockOut = (shiftId: string) => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? { ...s, status: 'completed', checkOutTime: now }
          : s
      )
    );

    let workedHours = 8.0;
    const currentShift = shifts.find(s => s.id === shiftId);
    if (currentShift && currentShift.checkInTime) {
      const inParts = currentShift.checkInTime.split(":");
      const outParts = now.split(":");
      const mins = (parseInt(outParts[0]) * 60 + parseInt(outParts[1])) - (parseInt(inParts[0]) * 60 + parseInt(inParts[1]));
      workedHours = Math.max(0.5, Math.round(mins / 6 * 10) / 10);
    }
    if (currentUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, hoursWorkedMonth: +(u.hoursWorkedMonth + workedHours).toFixed(1) }
            : u
        )
      );
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Đã hoàn thành ca làm',
      message: `Bạn đã xác nhận rời ca lúc ${now}. ${workedHours} giờ làm việc đã được cộng vào bảng lương tháng.`,
      type: 'shift',
      timestamp: now,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`✓ Kết ca thành công lúc ${now}. Cảm ơn bạn vì một ca làm xuất sắc! ✨`);
  };

  // Toggle Break handler
  const handleToggleBreak = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;
        if (s.status === 'checked_in') {
          showToast('Đang trong thời gian nghỉ giải lao 15 phút ☕');
          return { ...s, status: 'on_break', breakStartTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
        } else if (s.status === 'on_break') {
          showToast('Đã quay trở lại ca làm việc! 💪');
          return { ...s, status: 'checked_in' };
        }
        return s;
      })
    );
  };

  // Task check toggle
  const handleToggleTask = (taskId: string) => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextState = !t.completed;
        return {
          ...t,
          completed: nextState,
          completedBy: nextState ? (currentUser?.name || 'Nhân viên') : undefined,
          completedAt: nextState ? now : undefined,
        };
      })
    );
  };

  // Add custom Task
  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'completed'>) => {
    const item: TaskItem = {
      id: `task-${Date.now()}`,
      completed: false,
      ...newTask,
    };
    setTasks((prev) => [item, ...prev]);
    showToast('✓ Đã thêm nhiệm vụ mới vào bảng kiểm tra ca!');
  };

  // Shift swap creation
  const handleSubmitSwap = (params: {
    shiftId: string;
    shiftDate: string;
    shiftTime: string;
    shiftStation: string;
    toUserId?: string;
    reason: string;
  }) => {
    if (!currentUser) return;
    const targetPeer = users.find((u) => u.id === params.toUserId);

    const newSwap: ShiftSwapRequest = {
      id: `swap-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserAvatar: currentUser.avatar,
      toUserId: targetPeer?.id,
      toUserName: targetPeer?.name,
      toUserAvatar: targetPeer?.avatar,
      shiftId: params.shiftId,
      shiftDate: params.shiftDate,
      shiftTime: params.shiftTime,
      shiftStation: params.shiftStation,
      reason: params.reason,
      status: 'pending_manager',
      createdAt: 'Vừa xong',
    };

    setSwaps((prev) => [newSwap, ...prev]);

    // Mark shift as swap_requested
    setShifts((prev) =>
      prev.map((s) => (s.id === params.shiftId ? { ...s, status: 'swap_requested' } : s))
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Đã gửi yêu cầu đổi ca',
      message: `Yêu cầu đổi ca ngày ${params.shiftDate} đã được chuyển tới Quản lý xét duyệt.`,
      type: 'approval',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('✓ Đã gửi yêu cầu đổi ca thành công! Quản lý sẽ sớm phê duyệt.');
  };

  // Accept swap from marketplace
  const handleAcceptSwap = (swapId: string) => {
    if (!currentUser) return;
    setSwaps((prev) =>
      prev.map((sw) =>
        sw.id === swapId
          ? {
              ...sw,
              toUserId: currentUser.id,
              toUserName: currentUser.name,
              toUserAvatar: currentUser.avatar,
              status: 'pending_manager',
            }
          : sw
      )
    );
    showToast('✓ Đã xác nhận nhận ca đổi! Đang chờ Quản lý phê duyệt.');
  };

  // Manager approves swap
  const handleApproveSwap = (swapId: string) => {
    const swap = swaps.find((s) => s.id === swapId);
    if (!swap) return;

    setSwaps((prev) =>
      prev.map((s) => (s.id === swapId ? { ...s, status: 'approved' } : s))
    );

    // If a peer was assigned, reassign the shift to the peer
    if (swap.toUserId) {
      const targetUser = users.find((u) => u.id === swap.toUserId);
      if (targetUser) {
        setShifts((prev) =>
          prev.map((sh) =>
            sh.id === swap.shiftId
              ? {
                  ...sh,
                  userId: targetUser.id,
                  userName: targetUser.name,
                  userAvatar: targetUser.avatar,
                  userPosition: targetUser.position.split('&')[0],
                  status: 'upcoming',
                  notes: `Đổi ca từ ${swap.fromUserName}. Lý do: ${swap.reason}`,
                }
              : sh
          )
        );
      }
    } else {
      // Revert shift status
      setShifts((prev) =>
        prev.map((sh) => (sh.id === swap.shiftId ? { ...sh, status: 'upcoming' } : sh))
      );
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Đổi ca đã được phê duyệt',
      message: `Quản lý đã phê duyệt đơn đổi ca ngày ${swap.shiftDate} của ${swap.fromUserName}.`,
      type: 'approval',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('✓ Đã phê duyệt đơn đổi ca và cập nhật lịch làm việc!');
  };

  // Manager rejects swap
  const handleRejectSwap = (swapId: string) => {
    const swap = swaps.find((s) => s.id === swapId);
    setSwaps((prev) =>
      prev.map((s) => (s.id === swapId ? { ...s, status: 'rejected' } : s))
    );
    if (swap) {
      setShifts((prev) =>
        prev.map((sh) => (sh.id === swap.shiftId ? { ...sh, status: 'upcoming' } : sh))
      );
    }
    showToast('Đã từ chối đơn đổi ca.');
  };

  // Manager adds shift
  const handleAddShift = (newShiftData: Omit<Shift, 'id'>) => {
    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      ...newShiftData,
    };
    setShifts((prev) => [newShift, ...prev]);
    showToast(`✓ Đã phân ca ${newShift.startTime}-${newShift.endTime} cho ${newShift.userName}!`);
  };

  // Manager deletes shift
  const handleDeleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    showToast('Đã xóa ca làm việc khỏi lịch tuần.');
  };

  // Post announcement
  const handlePostAnnouncement = (anno: Omit<StoreAnnouncement, 'id' | 'timestamp'>) => {
    const newAnno: StoreAnnouncement = {
      id: `anno-${Date.now()}`,
      timestamp: 'Vừa xong',
      ...anno,
    };
    setAnnouncements((prev) => [newAnno, ...prev]);
    showToast('✓ Đã đăng thông báo mới lên bảng tin toàn tiệm!');
  };

  // Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Đã xóa bài thông báo.');
  };

  // Notifications
  const handleMarkNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Submit evidence for a task
  const handleSubmitEvidence = (taskId: string, url: string, note: string) => {
    if (!currentUser) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newEv: TaskEvidence = {
      id: `ev-${Date.now()}`,
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      imageUrl: url,
      note,
      submittedAt: now,
      status: 'pending_review',
    };
    setEvidence(prev => [newEv, ...prev]);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, taskStatus: 'pending_review', evidenceUrl: url, evidenceNote: note, capturedAt: now } : t));
    showToast('✓ Đã nộp bằng chứng! Đang chờ quản lý duyệt.');
  };

  // Manager approves evidence
  const handleApproveEvidence = (evId: string) => {
    if (!currentUser) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setEvidence(prev => prev.map(e => e.id === evId ? { ...e, status: 'approved', reviewedBy: currentUser.name, reviewedAt: now } : e));
    const ev = evidence.find(e => e.id === evId);
    if (ev) {
      setTasks(prev => prev.map(t => t.id === ev.taskId ? { ...t, taskStatus: 'completed', completed: true, completedBy: ev.userName, completedAt: now } : t));
      // Points only from on-time check-in
    }
    showToast('✓ Đã duyệt bằng chứng! Đã duyệt bằng chứng.');
  };

  // Manager rejects evidence
  const handleRejectEvidence = (evId: string) => {
    const ev = evidence.find(e => e.id === evId);
    setEvidence(prev => prev.map(e => e.id === evId ? { ...e, status: 'rejected' } : e));
    if (ev) {
      setTasks(prev => prev.map(t => t.id === ev.taskId ? { ...t, taskStatus: 'in_progress' } : t));
    }
    showToast('Đã từ chối bằng chứng. Nhân viên cần nộp lại.');
  };

  // Confirm handover
  const handleConfirmHandover = (hoId: string) => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setHandovers(prev => prev.map(h => h.id === hoId ? { ...h, status: 'confirmed', confirmedBy: currentUser?.name, confirmedAt: now } : h));
    showToast('✓ Đã xác nhận bàn giao ca thành công!');
  };

  // If not logged in, render the exact pixel-perfect Login screen
  const handleRegister = (name: string, phone: string, password: string, storeCode: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      role: 'employee' as UserRole,
      phone,
      email: `${phone}@coffeeshift.com`,
      position: 'Nhan vien moi',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff8f00&color=fff&bold=true`,
      hourlyRate: 45000,
      hoursWorkedMonth: 0,
      punctualityScore: 100,
      branch: 'CoffeeShift',
      certifications: [],
      points: 0,
      storeCode,
      password,
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Dang ky thanh cong! Chao mung ${name} den voi CoffeeShift!`);
    setCurrentScreen('login');
  };

  if (!currentUser) {
    if (currentScreen === 'register') {
      return <RegisterScreen onRegister={handleRegister} onSwitchToLogin={() => setCurrentScreen('login')} />;
    }
    return <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setCurrentScreen('register')} />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] flex flex-col antialiased">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#271310] text-[#fcf9f8] px-4 py-2.5 rounded-full shadow-2xl border border-[#ff8f00]/50 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-[#ff8f00]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

            {/* Main Body Content Container */}
      <main className="flex-1 flex justify-center p-3 sm:p-5 md:p-8">
        
        <div className="w-full max-w-7xl mx-auto">
            <EmployeeDashboard
                user={currentUser}
                shifts={shifts}
                tasks={tasks}
                swaps={swaps}
                announcements={announcements}
                allUsers={users}
                evidence={evidence}
                handovers={handovers}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onToggleBreak={handleToggleBreak}
                onSubmitSwap={handleSubmitSwap}
                onAcceptSwap={handleAcceptSwap}
                onLogout={handleLogout}
                onAddShift={handleAddShift}
                onDeleteShift={handleDeleteShift}
                onApproveSwap={handleApproveSwap}
                onRejectSwap={handleRejectSwap}
                onPostAnnouncement={handlePostAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
          </div>

      </main>

      {/* Footer */}
      

    </div>
  );
}
