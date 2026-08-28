import React, { useState, useRef } from 'react';
import { TaskItem } from '../../types';

interface Props {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, url: string, note: string) => void;
}

export const SubmitEvidenceModal: React.FC<Props> = ({ task, isOpen, onClose, onSubmit }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [incidentTags, setIncidentTags] = useState<string[]>([]);
  const [incidentNote, setIncidentNote] = useState('');
  const [incidentImageUrl, setIncidentImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const incidentFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !task) return null;

  const toggleIncidentTag = (tag: string) => {
    setIncidentTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    const url = imageUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600';
    onSubmit(task.id, url, incidentTags.join(', '));
    setImageUrl(''); setIncidentTags([]); setIncidentNote(''); setIncidentImageUrl('');
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'evidence') setImageUrl(ev.target?.result as string);
        else setIncidentImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer"><span className="material-symbols-outlined text-gray-600 text-xl">arrow_back</span></button>
          <h2 className="font-bold text-lg text-[#ff8f00]">Gửi Báo Cáo</h2>
          <div className="w-8" />
        </div>
        <div className="p-4 space-y-4">
          <div className="border-l-4 border-[#ff8f00] bg-[#fff8f0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 bg-[#ff8f00] rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-white text-sm">check_circle</span></span>
              <h3 className="font-bold text-base text-gray-900">Bằng Chứng Công Việc</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3 ml-8">Chụp hoặc tải ảnh xác nhận bạn đã hoàn thành các nhiệm vụ trong ca.</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={e => handleFileSelect(e, "evidence")} />
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="Evidence" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow cursor-pointer"><span className="material-symbols-outlined text-red-500 text-sm">close</span></button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-orange-200 bg-white rounded-xl py-6 flex flex-col items-center gap-2 hover:bg-orange-50/50 cursor-pointer">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-[#ff8f00] text-xl">add_a_photo</span></div>
                <p className="text-sm font-medium text-gray-600">Chạm để chụp hoặc chọn ảnh</p>
              </button>
            )}
          </div>
          <div className="border-l-4 border-orange-400 bg-[#fff8f0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-white text-sm">warning</span></span>
              <h3 className="font-bold text-base text-gray-900">Báo Cáo Sự Cố Ca Trước</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3 ml-8">Ghi nhận các vấn đề gặp phải khi nhận ca để quản lý nắm bắt.</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Vệ sinh kém", "Lỗi máy móc", "Thiếu nguyên liệu", "Khác"].map(tag => (
                <button key={tag} type="button" onClick={() => toggleIncidentTag(tag)} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer " + (incidentTags.includes(tag) ? "bg-orange-100 border-orange-400 text-orange-700" : "bg-white border-gray-200 text-gray-600")}>
                  {tag}
                </button>
              ))}
            </div>
            <label className="text-sm font-semibold text-gray-900 mb-1 block">Chi tiết sự cố</label>
            <textarea value={incidentNote} onChange={e => setIncidentNote(e.target.value)} placeholder="Mô tả cụ thể vấn đề..." className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-[#ff8f00] mb-3" rows={2} />
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Dinh kem hinh anh (Tuy chon)</label>
            <input ref={incidentFileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={e => handleFileSelect(e, "incident")} />
            {incidentImageUrl ? (
              <div className="relative inline-block">
                <img src={incidentImageUrl} alt="Incident" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                <button type="button" onClick={() => setIncidentImageUrl("")} className="absolute -top-1.5 -right-1.5 p-1 bg-white rounded-full shadow cursor-pointer"><span className="material-symbols-outlined text-red-500 text-xs">close</span></button>
              </div>
            ) : (
              <button type="button" onClick={() => incidentFileInputRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 cursor-pointer"><span className="material-symbols-outlined text-gray-400 text-xl">add_photo_alternate</span></button>
            )}
          </div>
        </div>
        <div className="px-4 pb-4">
          <button type="button" onClick={handleSubmit} className="w-full py-3.5 bg-[#ff8f00] text-white font-bold text-sm rounded-xl hover:bg-[#e67e00] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]">
            <span className="material-symbols-outlined text-base">send</span>
            Gửi Báo Cáo cho Quan Ly
          </button>
        </div>
      </div>
    </div>
  );
};