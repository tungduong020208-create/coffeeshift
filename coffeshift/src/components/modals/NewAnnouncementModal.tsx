import React, { useState } from 'react';
import { StoreAnnouncement, UserProfile } from '../../types';

interface NewAnnouncementModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPostAnnouncement: (announcement: Omit<StoreAnnouncement, 'id' | 'timestamp'>) => void;
}

export const NewAnnouncementModal: React.FC<NewAnnouncementModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onPostAnnouncement,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [badge, setBadge] = useState('Thông báo chung');
  const [isPinned, setIsPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onPostAnnouncement({
      authorName: currentUser.name,
      authorRole: currentUser.position || 'Store Manager',
      authorAvatar: currentUser.avatar,
      title: title.trim(),
      content: content.trim(),
      badge,
      isPinned,
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
              <span className="material-symbols-outlined text-2xl">campaign</span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] font-bold text-base text-[#271310]">
                Đăng thông báo cửa hàng
              </h3>
              <p className="text-xs text-[#827472] font-['Inter']">
                Gửi thông điệp tức thì đến tất cả nhân viên
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
          
          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Phân loại nhãn:
            </label>
            <div className="flex flex-wrap gap-2">
              {['Sản phẩm mới', 'Vận hành & Kỹ thuật', 'An toàn VSTP', 'Đào tạo & Workshop', 'Thông báo chung'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setBadge(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    badge === tag
                      ? 'bg-[#ff8f00] text-white border-[#ff8f00]'
                      : 'bg-gray-50 border-[#d3c3c0] text-[#504442] hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Tiêu đề thông báo:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: ☕ Hạt mới về: Ethiopia Guji & Panama Geisha"
              required
              className="w-full h-10 px-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#271310] mb-1">
              Nội dung chi tiết:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mô tả chi tiết nội dung cần phổ biến cho các ca làm việc..."
              required
              className="w-full p-3 rounded-lg border border-[#d3c3c0] bg-white text-xs text-[#1b1c1c] focus:border-[#ff8f00] outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded text-[#ff8f00] focus:ring-[#ff8f00]"
            />
            <span className="font-semibold text-[#271310]">Ghim lên đầu bảng tin (Pinned Announcement)</span>
          </label>

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
              Đăng ngay
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
