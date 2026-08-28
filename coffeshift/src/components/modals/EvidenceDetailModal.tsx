import React from 'react';
import { TaskEvidence } from '../../types';

interface Props {
  evidence: TaskEvidence | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const EvidenceDetailModal: React.FC<Props> = ({ evidence, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-gray-600 text-xl">arrow_back</span>
          </button>
          <h2 className="font-bold text-lg text-gray-900">Chi Tiết Bằng Chứng</h2>
        </div>

        {/* Evidence Image */}
        <div className="px-4 py-3">
          <img src={evidence.imageUrl} alt="Bằng chứng" className="w-full h-64 object-cover rounded-xl" />
        </div>

        {/* Info Card */}
        <div className="px-4 pb-3">
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            {/* Employee Info */}
            <div className="flex items-center gap-3">
              <img src={evidence.userAvatar} alt={evidence.userName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <div>
                <p className="font-bold text-sm text-gray-900">{evidence.userName}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Hôm nay, {evidence.submittedAt}
                </p>
              </div>
            </div>

            {/* Task */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-1">Nhiệm vụ</p>
              <p className="text-sm font-medium text-gray-800">{evidence.note ? evidence.note.split('.')[0] : 'Hoàn thành nhiệm vụ'}</p>
            </div>

            {/* Notes */}
            {evidence.note && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-1">Ghi chú của nhân viên</p>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600 italic">"{evidence.note}"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 flex gap-3">
          <button
            type="button"
            onClick={() => { onReject(evidence.id); onClose(); }}
            className="flex-1 py-3 border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">close</span>
            Từ chối
          </button>
          <button
            type="button"
            onClick={() => { onApprove(evidence.id); onClose(); }}
            className="flex-1 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">check</span>
            Duyệt
          </button>
        </div>
      </div>
    </div>
  );
};
