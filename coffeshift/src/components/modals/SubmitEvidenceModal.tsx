import React, { useState, useRef } from 'react';
import { TaskItem, TASK_STATUS_CONFIG } from '../../types';

interface Props {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, url: string, note: string) => void;
}

export const SubmitEvidenceModal: React.FC<Props> = ({ task, isOpen, onClose, onSubmit }) => {
  const [note, setNote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !task) return null;

  const status = TASK_STATUS_CONFIG[task.taskStatus || 'not_started'];

  const handleSubmit = () => {
    const url = imageUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600';
    onSubmit(task.id, url, note);
    setNote('');
    setImageUrl('');
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImageUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-gray-600 text-xl">arrow_back</span>
          </button>
          <h2 className="font-bold text-lg text-gray-900">Submit Evidence</h2>
          <button type="button" className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-gray-600 text-xl">more_vert</span>
          </button>
        </div>

        {/* Task Info Card */}
        <div className="mx-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm text-gray-900">{task.title}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: status.color, backgroundColor: status.bgColor }}>
              {task.taskStatus === 'in_progress' || task.taskStatus === 'not_started' ? 'Đang thực hiện' : status.label}
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{task.description}</p>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Upload Section */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Tải ảnh bằng chứng</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFileSelect} />
            
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-red-500 text-sm">close</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-orange-200 bg-orange-50/30 rounded-xl py-8 flex flex-col items-center gap-2 hover:bg-orange-50/60 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-500 text-2xl">add_a_photo</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Chụp ảnh hoặc chọn từ thư viện</p>
                <p className="text-xs text-gray-400">Định dạng JPG, PNG (Tối đa 5MB)</p>
              </button>
            )}
          </div>

          {/* Notes Section */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">Ghi chú bổ sung</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Nhập thêm thông tin tình trạng thiết bị (nếu có)..."
              className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#ff8f00] focus:ring-1 focus:ring-[#ff8f00]/30"
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 bg-[#ff8f00] text-white font-bold text-sm rounded-xl hover:bg-[#e67e00] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-base">send</span>
            Gửi báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};
