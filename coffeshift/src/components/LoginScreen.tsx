import React, { useState } from 'react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'employee') {
      setEmail('barista@coffeeshift.com');
    } else {
      setEmail('manager@coffeeshift.com');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role, email);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#271310] flex flex-col items-center justify-center p-4 md:p-8 antialiased">
      {/* Main Login Container - Faithfully matching HTML & design spec */}
      <main className="w-full max-w-[420px] bg-[#e4e4cc] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col items-center transition-all duration-300">
        
        {/* Header / Logo Area */}
        <header className="w-full pt-8 pb-5 px-6 flex flex-col items-center justify-center bg-[#e4e4cc]">
          <div className="mb-3 shadow-md">
            <Logo size={64} />
          </div>
          
          <h1 className="font-['Montserrat'] font-bold text-2xl text-[#271310] tracking-tight">
            CoffeeShift
          </h1>
          <p className="font-['Inter'] text-sm text-[#504442] mt-1 text-center font-normal">
            Welcome back to the grind.
          </p>
        </header>

        {/* Form Area with rounded top corners */}
        <section className="w-full px-6 pb-8 bg-white rounded-t-[32px] pt-6 flex-1 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          
          {/* Role Toggle */}
          <div className="flex bg-[#e5e2e1] rounded-lg p-1 mb-5 w-full">
            <button
              type="button"
              onClick={() => handleRoleChange('employee')}
              className={`flex-1 py-2 font-['Inter'] text-xs font-semibold rounded-md transition-all text-center ${
                role === 'employee'
                  ? 'bg-white text-[#271310] shadow-sm font-bold'
                  : 'text-[#504442] hover:text-[#271310]'
              }`}
            >
              Employee
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('manager')}
              className={`flex-1 py-2 font-['Inter'] text-xs font-semibold rounded-md transition-all text-center ${
                role === 'manager'
                  ? 'bg-white text-[#271310] shadow-sm font-bold'
                  : 'text-[#504442] hover:text-[#271310]'
              }`}
            >
              Manager
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-4 w-full" onSubmit={handleSubmit}>
            {/* Email/Username Input */}
            <div className="space-y-1">
              <label 
                className="font-['Inter'] text-xs font-medium text-[#504442] block" 
                htmlFor="username"
              >
                Email or Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#827472] text-[20px]">
                  person
                </span>
                <input
                  id="username"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="barista@coffeeshift.com"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#d3c3c0] bg-white font-['Inter'] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#d3c3c0]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label 
                  className="font-['Inter'] text-xs font-medium text-[#504442] block" 
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-['Inter'] text-xs font-medium text-[#8f4e00] hover:text-[#ff8f00] transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#827472] text-[20px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-10 pr-10 rounded-lg border border-[#d3c3c0] bg-white font-['Inter'] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#d3c3c0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#827472] hover:text-[#1b1c1c] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#ff8f00] hover:bg-[#e67e00] active:scale-[0.98] text-white font-['Montserrat'] font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-5 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>


        </section>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-[#d3c3c0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">Khôi phục mật khẩu</h3>
              <button 
                onClick={() => {
                  setShowForgotModal(false);
                  setResetSuccess(false);
                }}
                className="text-[#827472] hover:text-[#271310] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {resetSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h4 className="font-['Montserrat'] font-bold text-base text-[#271310]">Đã gửi hướng dẫn!</h4>
                <p className="text-xs text-[#504442] mt-2 font-['Inter']">
                  Liên kết đặt lại mật khẩu đã được gửi tới <strong>{resetEmail || email}</strong>. Vui lòng kiểm tra hòm thư.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSuccess(false);
                  }}
                  className="mt-5 w-full py-2.5 bg-[#ff8f00] text-white font-semibold text-xs rounded-lg hover:bg-[#e67e00]"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetSuccess(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-[#504442] font-['Inter']">
                  Nhập email tài khoản nhân viên hoặc quản lý CoffeeShift của bạn để nhận mã xác thực đặt lại mật khẩu.
                </p>
                <div>
                  <label className="text-xs font-semibold text-[#504442] block mb-1">Email của bạn</label>
                  <input
                    type="email"
                    required
                    value={resetEmail || email}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="barista@coffeeshift.com"
                    className="w-full h-11 px-3 rounded-lg border border-[#d3c3c0] text-sm text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 border border-[#d3c3c0] text-[#504442] font-semibold text-xs rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#ff8f00] text-white font-semibold text-xs rounded-lg hover:bg-[#e67e00]"
                  >
                    Gửi liên kết
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Contact Manager Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-[#d3c3c0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Montserrat'] font-bold text-lg text-[#271310]">Liên hệ quản lý</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-[#827472] hover:text-[#271310] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-['Inter'] text-xs text-[#504442]">
              <p>
                Tài khoản CoffeeShift được cấp bởi Quản lý cửa hàng (Store Manager). Vui lòng liên hệ trực tiếp để được tạo tài khoản và phân ca:
              </p>
              
              <div className="bg-[#f6f3f2] p-3 rounded-xl space-y-2 border border-[#e5e2e1]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff8f00] text-base">storefront</span>
                  <span className="font-semibold text-[#1b1c1c]">CoffeeShift Flagship Store</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="material-symbols-outlined text-[#827472] text-base">person</span>
                  <span>Quản lý: <strong>Nguyễn Phương</strong> (General Manager)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="material-symbols-outlined text-[#827472] text-base">call</span>
                  <span>Hotline nội bộ: <strong>0903 999 888</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="material-symbols-outlined text-[#827472] text-base">mail</span>
                  <span>Email: <strong>manager@coffeeshift.com</strong></span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="w-full py-2.5 bg-[#271310] text-[#e4e4cc] font-semibold text-xs rounded-lg hover:bg-[#3e2723]"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
