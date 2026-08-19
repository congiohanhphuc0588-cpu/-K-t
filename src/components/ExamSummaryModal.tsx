import React, { useEffect } from 'react';
import { ExamResult } from '../types';
import confetti from 'canvas-confetti';
import { playVictorySound, playCorrectSound } from '../utils/audio';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  Eye, 
  Printer, 
  ShieldCheck,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';

interface ExamSummaryModalProps {
  result: ExamResult;
  onReviewDetails: () => void;
  onRetry: () => void;
  onOpenTeacherView: () => void;
  onClose: () => void;
}

export const ExamSummaryModal: React.FC<ExamSummaryModalProps> = ({
  result,
  onReviewDetails,
  onRetry,
  onOpenTeacherView,
  onClose,
}) => {
  const { studentName, className, scores, durationSeconds, mode } = result;

  useEffect(() => {
    if (scores.total >= 7.0) {
      playVictorySound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } else {
      playCorrectSound();
    }
  }, [scores.total]);

  // Qualitative Feedback
  let gradeText = 'Xuất Sắc';
  let gradeColor = 'text-emerald-600 bg-emerald-50 border-emerald-300';
  let comment = 'Chúc mừng em! Em đã nắm rất vững và vận dụng xuất sắc các phương pháp biểu hiện trên bản đồ.';

  if (scores.total < 5.0) {
    gradeText = 'Cần Ôn Luyện Thêm';
    gradeColor = 'text-rose-600 bg-rose-50 border-rose-300';
    comment = 'Em cần đọc lại kĩ nội dung Bài 2 Địa lí 10 (đặc biệt là phân biệt phương pháp chấm điểm và bản đồ - biểu đồ).';
  } else if (scores.total < 6.5) {
    gradeText = 'Đạt Yêu Cầu (Trung Bình)';
    gradeColor = 'text-amber-600 bg-amber-50 border-amber-300';
    comment = 'Em đã nắm được các khái niệm cơ bản. Hãy chú ý hơn ở phần nhận định đúng/sai và phân loại tình huống.';
  } else if (scores.total < 8.0) {
    gradeText = 'Khá';
    gradeColor = 'text-blue-600 bg-blue-50 border-blue-300';
    comment = 'Bài làm tốt! Em hiểu rõ các phương pháp biểu hiện trên bản đồ, cần rèn luyện thêm một vài chi tiết nhỏ.';
  } else if (scores.total < 9.0) {
    gradeText = 'Giỏi';
    gradeColor = 'text-teal-600 bg-teal-50 border-teal-300';
    comment = 'Kết quả rất tốt! Em có tư duy địa lí nhanh nhạy và chính xác.';
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} phút ${s} giây`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="text-center pb-6 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-lg mb-3">
            <Award className="w-9 h-9" />
          </div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            KẾT QUẢ ĐÁNH GIÁ THƯỜNG XUYÊN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {studentName} — Lớp {className}
          </h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Thời gian làm: {formatTime(durationSeconds)}
            </span>
            <span>•</span>
            <span className="capitalize">{mode === 'exam' ? 'Bài kiểm tra 15p' : 'Luyện tập'}</span>
          </p>
        </div>

        {/* Big Total Score & Evaluation */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 text-center relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                TỔNG ĐIỂM HỆ 10
              </span>
              <div className="text-5xl font-black text-blue-700 tracking-tight mt-1">
                {scores.total.toFixed(2)}
                <span className="text-2xl font-bold text-slate-400 ml-1">/ 10</span>
              </div>
            </div>

            <div className="h-12 w-px bg-slate-200 hidden sm:block" />

            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                XẾP LOẠI HỌC TẬP
              </span>
              <div className="mt-1">
                <span className={`inline-block px-3.5 py-1 rounded-full text-sm font-black border ${gradeColor}`}>
                  {gradeText}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs sm:text-sm text-slate-700 font-medium">
            &ldquo;{comment}&rdquo;
          </div>
        </div>

        {/* 4 Parts Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-center">
            <span className="text-[11px] font-bold text-blue-700 block">Trò 1: Trắc nghiệm</span>
            <span className="text-base font-extrabold text-blue-900">{scores.part1.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 block">/ 2.50 đ</span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Trò 2: Đúng / Sai</span>
            <span className="text-base font-extrabold text-emerald-900">{scores.part2.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 block">/ 2.50 đ</span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-center">
            <span className="text-[11px] font-bold text-amber-700 block">Trò 3: Kéo thả</span>
            <span className="text-base font-extrabold text-amber-900">{scores.part3.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 block">/ 2.50 đ</span>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-center">
            <span className="text-[11px] font-bold text-purple-700 block">Trò 4: Điền khuyết</span>
            <span className="text-base font-extrabold text-purple-900">{scores.part4.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 block">/ 2.50 đ</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onReviewDetails}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Eye className="w-4 h-4" />
              <span>Xem lại bài làm chi tiết</span>
            </button>

            <button
              onClick={onRetry}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
              title="In phiếu điểm"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTeacherView}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bảng điểm Giáo viên</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
