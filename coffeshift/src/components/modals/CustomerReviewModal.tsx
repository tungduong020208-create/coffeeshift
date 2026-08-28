import React, { useState } from 'react';
import { UserProfile } from '../../types';

interface CustomerReviewModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerReviewModal: React.FC<CustomerReviewModalProps> = ({ user, isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const stars = [1, 2, 3, 4, 5];
  const starLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
      onClose();
    }, 2000);
  };

  const qrUrl = `https://coffeeshift.app/review/${user.id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=271310&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-[90%] max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#271310] to-[#3e2723] p-5 rounded-t-2xl text-white text-center">
          <span className="material-symbols-outlined text-[#ff8f00] text-3xl">rate_review</span>
          <h2 className="font-bold text-lg mt-2">Đánh giá nhân viên</h2>
          <p className="text-xs text-white/60 mt-1">Hãy cho chúng tôi biết trải nghiệm của bạn</p>
        </div>

        <div className="p-5">
          {submitted ? (
            /* Thank You */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
              </div>
              <h3 className="font-bold text-lg text-[#271310]">Cảm ơn bạn!</h3>
              <p className="text-sm text-[#827472] mt-1">Đánh giá của bạn đã được gửi thành công</p>
            </div>
          ) : (
            <>
              {/* Employee Info */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#ff8f00]" />
                <div>
                  <p className="font-bold text-[#271310]">{user.name}</p>
                  <p className="text-xs text-[#827472]">{user.position}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[#ff8f00] text-sm">star</span>
                    <span className="text-xs text-[#827472]">{user.punctualityScore}% đúng giờ</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="text-center mb-5">
                <p className="text-sm font-semibold text-[#271310] mb-3">Bạn đánh giá bao nhiêu sao?</p>
                <div className="flex justify-center gap-2">
                  {stars.map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <span className={`material-symbols-outlined text-4xl ${
                        star <= (hoveredStar || rating) ? 'text-[#ff8f00]' : 'text-gray-200'
                      }`}>
                        {star <= (hoveredStar || rating) ? 'star' : 'star_border'}
                      </span>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-[#ff8f00] font-medium mt-2">{starLabels[rating]}</p>
                )}
              </div>

              {/* Quick Tags */}
              <div className="mb-4">
                <p className="text-xs text-[#827472] mb-2">Nhanh gọn:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Pha ngon', 'Thân thiện', 'Nhanh nhẹn', 'Sạch sẽ', 'Chuyên nghiệp'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setComment(prev => prev ? `${prev}, ${tag}` : tag)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-[#fff7ed] text-xs text-[#827472] hover:text-[#ff8f00] rounded-full transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-5">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Nhận xét thêm (không bắt buộc)..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm text-[#271310] placeholder-gray-300 resize-none focus:outline-none focus:border-[#ff8f00] focus:ring-1 focus:ring-[#ff8f00]/30"
                  rows={3}
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  rating > 0
                    ? 'bg-[#ff8f00] hover:bg-[#e67e00] text-white shadow-sm active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Gửi đánh giá
              </button>
            </>
          )}
        </div>

        {/* QR for customer scanning */}
        {!submitted && (
          <div className="px-5 pb-5 text-center">
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-[#827472] mb-2">Hoặc quét QR để đánh giá</p>
              <div className="inline-block bg-white p-1.5 rounded-lg border border-gray-200">
                <img src={qrImageUrl} alt="Review QR" className="w-20 h-20" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
