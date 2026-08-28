import React, { useState } from 'react';

interface RegisterScreenProps {
  onRegister: (name: string, phone: string, password: string, storeCode: string) => void;
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onSwitchToLogin }) => {
  const [storeCode, setStoreCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (!/^[A-Z]{6}$/.test(storeCode)) n.storeCode = 'Ma quan phai co 6 ky tu viet hoa';
    if (!name.trim()) n.name = 'Vui long nhap ho va ten';
    if (!phone.trim()) n.phone = 'Nhap so dien thoai';
    if (password.length < 6) n.password = 'Mat khau toi thieu 6 ky tu';
    if (password !== confirmPassword) n.confirmPassword = 'Mat khau khong khop';
    if (Object.keys(n).length > 0) { setErrors(n); return; }
    setErrors({});
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onRegister(name.trim(), phone.trim(), password, storeCode); }, 500);
  };

  return (
    <div className='min-h-screen bg-[#271310] flex flex-col items-center justify-center p-4 md:p-8 antialiased'>
      <main className='w-full max-w-[420px] bg-[#e4e4cc] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col items-center'>
        <header className='w-full pt-8 pb-5 px-6 flex flex-col items-center justify-center bg-[#e4e4cc]'>
          <div className='relative flex items-center justify-center bg-[#271310] rounded-full w-16 h-16 mb-3 shadow-md'>
            <span className='material-symbols-filled text-[#e4e4cc] text-4xl leading-none'>coffee</span>
            <span className='material-symbols-filled text-[#e4e4cc] absolute text-xl translate-x-3.5 translate-y-3.5 bg-[#271310] rounded-full'>settings</span>
          </div>
          <h1 className='font-[Montserrat] font-bold text-2xl text-[#271310] tracking-tight'>CoffeeShift</h1>
          <p className='font-[Inter] text-sm text-[#504442] mt-1 text-center font-normal'>Welcome to the grind.</p>
        </header>
        <section className='w-full px-6 pb-8 bg-white rounded-t-[32px] pt-6 flex-1 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]'>
          <h2 className='font-[Montserrat] font-bold text-xl text-[#271310] text-center mb-2'>Dang ky thanh vien moi</h2>
          <p className='font-[Inter] text-xs text-[#504442] text-center mb-6'>Nhap ma quan duoc cung cap boi quan ly de tham gia he thong.</p>
          <form className='space-y-4 w-full' onSubmit={handleSubmit}>
            <div className='space-y-1'>
              <label className='font-[Inter] text-xs font-semibold text-[#504442] block uppercase tracking-wider'>Ma quan</label>
              <input type='text' value={storeCode} onChange={(e) => setStoreCode(e.target.value.toUpperCase().slice(0, 6))} placeholder='NHAP MA (6 KY TU)' maxLength={6} className='w-full h-12 px-4 rounded-lg border border-[#d3c3c0] bg-white font-[Inter] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#827472] uppercase tracking-widest' />
              {errors.storeCode ? (<p className='text-xs text-red-500 font-[Inter]'>{errors.storeCode}</p>) : (<p className='text-xs text-[#827472] font-[Inter]'>Ma quan phai co 6 ky tu viet hoa.</p>)}
            </div>
            <div className='space-y-1'>
              <label className='font-[Inter] text-xs font-semibold text-[#504442] block uppercase tracking-wider'>Ho va ten</label>
              <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Nguyen Van A' className='w-full h-12 px-4 rounded-lg border border-[#d3c3c0] bg-white font-[Inter] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#827472]' />
              {errors.name && <p className='text-xs text-red-500 font-[Inter]'>{errors.name}</p>}
            </div>
            <div className='space-y-1'>
              <label className='font-[Inter] text-xs font-semibold text-[#504442] block uppercase tracking-wider'>So dien thoai (Ten dang nhap)</label>
              <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} placeholder='0901234567' className='w-full h-12 px-4 rounded-lg border border-[#d3c3c0] bg-white font-[Inter] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#827472]' />
              {errors.phone && <p className='text-xs text-red-500 font-[Inter]'>{errors.phone}</p>}
            </div>
            <div className='space-y-1'>
              <label className='font-[Inter] text-xs font-semibold text-[#504442] block uppercase tracking-wider'>Mat khau</label>
              <div className='relative'>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='********' className='w-full h-12 px-4 pr-10 rounded-lg border border-[#d3c3c0] bg-white font-[Inter] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#827472]' />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-[#827472] hover:text-[#1b1c1c] transition-colors p-1'>
                  <span className='material-symbols-outlined text-[20px]'>{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {errors.password && <p className='text-xs text-red-500 font-[Inter]'>{errors.password}</p>}
            </div>
            <div className='space-y-1'>
              <label className='font-[Inter] text-xs font-semibold text-[#504442] block uppercase tracking-wider'>Nhap lai mat khau</label>
              <div className='relative'>
                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='********' className='w-full h-12 px-4 pr-10 rounded-lg border border-[#d3c3c0] bg-white font-[Inter] text-sm text-[#1b1c1c] focus:border-[#ff8f00] focus:ring-2 focus:ring-[#ff8f00]/20 outline-none transition-all placeholder:text-[#827472]' />
                <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-[#827472] hover:text-[#1b1c1c] transition-colors p-1'>
                  <span className='material-symbols-outlined text-[20px]'>{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {errors.confirmPassword && <p className='text-xs text-red-500 font-[Inter]'>{errors.confirmPassword}</p>}
            </div>
            <button type='submit' disabled={isLoading} className='w-full h-12 bg-[#271310] hover:bg-[#3e2723] active:scale-[0.98] text-[#e4e4cc] font-[Montserrat] font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-5 cursor-pointer disabled:opacity-75'>
              {isLoading ? (<div className='w-5 h-5 border-2 border-[#e4e4cc] border-t-transparent rounded-full animate-spin'></div>) : (<span>Dang ky</span>)}
            </button>
          </form>
          <div className='flex items-center my-5'>
            <div className='flex-1 border-t border-[#d3c3c0]'></div>
            <span className='px-3 font-[Inter] text-xs text-[#827472]'>or</span>
            <div className='flex-1 border-t border-[#d3c3c0]'></div>
          </div>
          <button type='button' onClick={onSwitchToLogin} className='w-full h-12 border border-[#271310] text-[#271310] font-[Montserrat] font-semibold text-sm rounded-lg hover:bg-[#f6f3f2] active:bg-[#e5e2e1] transition-colors cursor-pointer'>
            Da co tai khoan? Dang nhap
          </button>
        </section>
      </main>
    </div>
  );
};
