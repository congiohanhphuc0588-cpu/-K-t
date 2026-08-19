import React, { useState } from 'react';
import { StudentInfo, ExamMode } from '../types';
import { User, School, Sparkles, CheckCircle2, Clock, HelpCircle, ArrowRight, Layers, Shuffle, PenTool } from 'lucide-react';

interface StudentLoginProps {
  onStart: (student: StudentInfo, mode: ExamMode) => void;
}

const COMMON_CLASSES = ['10A1', '10A2', '10A3', '10A4', '10A5', '10A6', '10A7', '10A8', '10A9', '10A10', '10A11', '10A12'];

export const StudentLogin: React.FC<StudentLoginProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('10A1');
  const [customClass, setCustomClass] = useState('');
  const [school, setSchool] = useState('');
  const [mode, setMode] = useState<ExamMode>('exam');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = (customClass ? customClass : className).trim();

    if (!finalName) {
      setError('Vui lòng nhập đầy đủ Họ và tên học sinh!');
      return;
    }
    if (!finalClass) {
      setError('Vui lòng chọn hoặc nhập tên Lớp!');
      return;
    }

    setError('');
    onStart(
      {
        name: finalName,
        className: finalClass,
        school: school.trim() || 'Trường THPT',
      },
      mode
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Intro Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Hệ thống Kiểm tra - Đánh giá Địa Lí 10
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          BÀI 2: MỘT SỐ PHƯƠNG PHÁP BIỂU HIỆN TRÊN BẢN ĐỒ
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Bộ câu hỏi & trò chơi tương tác đánh giá thường xuyên kiến thức các phương pháp kí hiệu, đường chuyển động, chấm điểm, bản đồ - biểu đồ và khoanh vùng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Login Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Thông Tin Học Sinh</h2>
              <p className="text-xs text-slate-500">Điền thông tin để bắt đầu làm bài và lưu kết quả</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Họ và tên */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Họ và Tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium transition"
                autoFocus
              />
            </div>

            {/* Lớp */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Lớp <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {COMMON_CLASSES.slice(0, 6).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setClassName(cls);
                      setCustomClass('');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      className === cls && !customClass
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customClass}
                  onChange={(e) => setCustomClass(e.target.value)}
                  placeholder="Hoặc nhập lớp khác (VD: 10D1, 10 Lý...)"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition"
                />
              </div>
            </div>

            {/* Trường THPT */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Trường THPT (Tùy chọn)</span>
                <span className="text-xs text-slate-400 font-normal">Tùy chọn</span>
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Ví dụ: THPT Chuyên / THPT Chu Văn An"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition"
                />
              </div>
            </div>

            {/* Chế độ làm bài */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Chọn chế độ làm bài:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setMode('exam')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    mode === 'exam'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    <Clock className={`w-5 h-5 ${mode === 'exam' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Kiểm Tra 15 Phút</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bấm giờ 15 phút, nộp bài tính điểm thang 10 & lưu cho giáo viên theo dõi.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setMode('practice')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    mode === 'practice'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    <CheckCircle2 className={`w-5 h-5 ${mode === 'practice' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Luyện Tập Tự Do</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Không giới hạn thời gian, có thể làm thử và xem giải thích chi tiết.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            >
              <span>Vào Làm Bài Kiểm Tra</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right: Structure Breakdown of the 4 Formats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Cấu trúc bài kiểm tra (4 Trò chơi)
            </h3>

            <div className="space-y-3.5">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Trò 1: Trắc nghiệm nhiều lựa chọn</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    8 câu hỏi 4 phương án (A, B, C, D) kiểm tra nhận biết và thông hiểu các phương pháp.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Trò 2: Trắc nghiệm Đúng / Sai</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    3 câu hỏi lớn chuẩn định dạng mới của Bộ GD&ĐT với 12 nhận định logic cần phán đoán.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Trò 3: Kéo thả nội dung & Phân loại</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kéo thả ghép cặp phương pháp và phân loại 10 tình huống thực tế vào đúng 5 giỏ phương pháp.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Trò 4: Điền khuyết kiến thức</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hoàn thành 5 câu định nghĩa/đặc trưng cốt lõi bằng ngân hàng từ khóa hoặc gõ trực tiếp.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Thang điểm: <strong>10.0 điểm</strong> (Mỗi trò 2.5đ)</span>
              <span className="text-emerald-400 font-semibold">Tự động chấm & lưu trữ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
