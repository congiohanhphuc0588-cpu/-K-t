import React, { useState, useMemo } from 'react';
import { ExamResult } from '../types';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  Download, 
  Printer, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  Sparkles,
  BarChart,
  ArrowUpDown,
  FileSpreadsheet,
  CheckCircle,
  BookOpen
} from 'lucide-react';

interface TeacherDashboardProps {
  results: ExamResult[];
  onReviewStudentResult: (result: ExamResult) => void;
  onDeleteResult: (id?: string) => void;
  onSeedDemoData: () => void;
  onBackToExam: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  results,
  onReviewStudentResult,
  onDeleteResult,
  onSeedDemoData,
  onBackToExam,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchName, setSearchName] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'score' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Available classes in dataset
  const classList = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => set.add(r.className));
    return Array.from(set).sort();
  }, [results]);

  // Filtered & Sorted list
  const filteredResults = useMemo(() => {
    return results
      .filter((r) => {
        const matchClass = selectedClass === 'all' || r.className === selectedClass;
        const matchName = r.studentName.toLowerCase().includes(searchName.toLowerCase().trim());
        return matchClass && matchName;
      })
      .sort((a, b) => {
        if (sortField === 'score') {
          return sortOrder === 'desc' ? b.scores.total - a.scores.total : a.scores.total - b.scores.total;
        } else if (sortField === 'name') {
          return sortOrder === 'asc' 
            ? a.studentName.localeCompare(b.studentName) 
            : b.studentName.localeCompare(a.studentName);
        } else {
          // Date
          return sortOrder === 'desc'
            ? new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            : new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        }
      });
  }, [results, selectedClass, searchName, sortField, sortOrder]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (filteredResults.length === 0) {
      return {
        count: 0,
        avgScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
        distribution: { excellent: 0, good: 0, average: 0, weak: 0 },
        avgPart1: 0,
        avgPart2: 0,
        avgPart3: 0,
        avgPart4: 0,
      };
    }

    let sumTotal = 0;
    let sumP1 = 0;
    let sumP2 = 0;
    let sumP3 = 0;
    let sumP4 = 0;
    let max = -1;
    let min = 11;
    let passCount = 0;
    const dist = { excellent: 0, good: 0, average: 0, weak: 0 };

    filteredResults.forEach((r) => {
      const score = r.scores.total;
      sumTotal += score;
      sumP1 += r.scores.part1;
      sumP2 += r.scores.part2;
      sumP3 += r.scores.part3;
      sumP4 += r.scores.part4;

      if (score > max) max = score;
      if (score < min) min = score;
      if (score >= 5.0) passCount++;

      if (score >= 8.5) dist.excellent++;
      else if (score >= 7.0) dist.good++;
      else if (score >= 5.0) dist.average++;
      else dist.weak++;
    });

    const n = filteredResults.length;
    return {
      count: n,
      avgScore: sumTotal / n,
      highestScore: max,
      lowestScore: min === 11 ? 0 : min,
      passRate: (passCount / n) * 100,
      distribution: dist,
      avgPart1: sumP1 / n,
      avgPart2: sumP2 / n,
      avgPart3: sumP3 / n,
      avgPart4: sumP4 / n,
    };
  }, [filteredResults]);

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (filteredResults.length === 0) return;

    const headers = [
      'STT',
      'Họ và Tên',
      'Lớp',
      'Trường',
      'Chế độ làm bài',
      'Thời gian làm (giây)',
      'Điểm Trò 1 (Trắc nghiệm / 2.5)',
      'Điểm Trò 2 (Đúng Sai / 2.5)',
      'Điểm Trò 3 (Kéo thả / 2.5)',
      'Điểm Trò 4 (Điền khuyết / 2.5)',
      'TỔNG ĐIỂM (Hệ 10)',
      'Xếp loại',
      'Thời điểm nộp',
    ];

    const rows = filteredResults.map((r, index) => {
      let grade = 'Trung bình';
      if (r.scores.total >= 8.5) grade = 'Giỏi / Xuất sắc';
      else if (r.scores.total >= 7.0) grade = 'Khá';
      else if (r.scores.total < 5.0) grade = 'Cần ôn luyện';

      return [
        index + 1,
        `"${r.studentName}"`,
        `"${r.className}"`,
        `"${r.schoolName || ''}"`,
        `"${r.mode === 'exam' ? 'Kiểm tra 15p' : 'Luyện tập'}"`,
        r.durationSeconds,
        r.scores.part1.toFixed(2),
        r.scores.part2.toFixed(2),
        r.scores.part3.toFixed(2),
        r.scores.part4.toFixed(2),
        r.scores.total.toFixed(2),
        `"${grade}"`,
        `"${new Date(r.submittedAt).toLocaleString('vi-VN')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Diem_Dia_Li_10_Bai_2_${selectedClass}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Khu vực Giáo viên
              </span>
              <span className="text-xs text-slate-400">Địa Lí 10 • Bài 2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Bảng Theo Dõi & Đánh Giá Kết Quả Học Sinh
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Thống kê toàn diện điểm số 4 trò chơi, phân tích phổ điểm và xuất báo cáo kết quả đánh giá thường xuyên.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              disabled={filteredResults.length === 0}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
              title="Xuất bảng điểm ra file Excel (CSV tiếng Việt)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel (.CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
              title="In bảng điểm"
            >
              <Printer className="w-4 h-4" />
              <span>In bảng điểm</span>
            </button>

            <button
              onClick={onBackToExam}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Giao diện làm bài</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Học sinh đã nộp</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.count} bài</div>
            <span className="text-[11px] text-slate-400">
              Lớp chọn: {selectedClass === 'all' ? 'Tất cả các lớp' : selectedClass}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Điểm trung bình</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              {stats.avgScore.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ 10</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              Tỉ lệ đạt (≥5đ): {stats.passRate.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Điểm cao nhất</span>
            <div className="text-2xl font-black text-amber-700 mt-0.5">
              {stats.count > 0 ? stats.highestScore.toFixed(2) : '0.00'}
            </div>
            <span className="text-[11px] text-slate-400">
              Thấp nhất: {stats.count > 0 ? stats.lowestScore.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Xếp loại Giỏi/Khá</span>
            <div className="text-2xl font-black text-purple-700 mt-0.5">
              {stats.distribution.excellent + stats.distribution.good} HS
            </div>
            <span className="text-[11px] text-purple-600 font-medium">
              TB: {stats.distribution.average} | Yếu: {stats.distribution.weak}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Parts Performance Analysis */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Phân Tích Điểm Trung Bình Theo Từng Trò Chơi (Mỗi phần max 2.50đ)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-blue-800">Trò 1: Trắc nghiệm</span>
              <span className="text-sm font-black text-blue-900">{stats.avgPart1.toFixed(2)}/2.5</span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(stats.avgPart1 / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-emerald-800">Trò 2: Đúng / Sai</span>
              <span className="text-sm font-black text-emerald-900">{stats.avgPart2.toFixed(2)}/2.5</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: `${(stats.avgPart2 / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-amber-800">Trò 3: Kéo thả</span>
              <span className="text-sm font-black text-amber-900">{stats.avgPart3.toFixed(2)}/2.5</span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full"
                style={{ width: `${(stats.avgPart3 / 2.5) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-purple-800">Trò 4: Điền khuyết</span>
              <span className="text-sm font-black text-purple-900">{stats.avgPart4.toFixed(2)}/2.5</span>
            </div>
            <div className="w-full bg-purple-200/60 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(stats.avgPart4 / 2.5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          {/* Search by Name */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            />
          </div>

          {/* Filter by Class */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold bg-white text-slate-700"
            >
              <option value="all">Tất cả các lớp ({results.length})</option>
              {classList.map((cls) => (
                <option key={cls} value={cls}>
                  Lớp {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort and Actions */}
        <div className="flex items-center gap-2">
          <select
            value={`${sortField}_${sortOrder}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split('_') as [any, any];
              setSortField(f);
              setSortOrder(o);
            }}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white text-slate-700"
          >
            <option value="date_desc">Mới nhất trước</option>
            <option value="date_asc">Cũ nhất trước</option>
            <option value="score_desc">Điểm cao xuống thấp</option>
            <option value="score_asc">Điểm thấp lên cao</option>
            <option value="name_asc">Tên (A → Z)</option>
          </select>

          {results.length === 0 && (
            <button
              onClick={onSeedDemoData}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition"
            >
              + Tạo mẫu học sinh thử nghiệm
            </button>
          )}

          {results.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ kết quả đã lưu không?')) {
                  onDeleteResult();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Xóa toàn bộ kết quả"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Student Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredResults.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">Chưa có bài nộp nào phù hợp</p>
            <p className="text-xs text-slate-400 mt-1">
              Học sinh sau khi làm bài và bấm nộp sẽ tự động hiển thị tại đây.
            </p>
            <div className="mt-4">
              <button
                onClick={onSeedDemoData}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
              >
                Tải 6 học sinh mẫu để xem thử bảng điểm
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">STT</th>
                  <th className="py-3.5 px-4">Học Sinh</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4 text-center">Trò 1 (TN)</th>
                  <th className="py-3.5 px-4 text-center">Trò 2 (Đ/S)</th>
                  <th className="py-3.5 px-4 text-center">Trò 3 (Kéo thả)</th>
                  <th className="py-3.5 px-4 text-center">Trò 4 (Điền)</th>
                  <th className="py-3.5 px-4 text-center">Tổng Điểm</th>
                  <th className="py-3.5 px-4 text-center">Xếp Loại</th>
                  <th className="py-3.5 px-4 text-center">Thời Gian Nộp</th>
                  <th className="py-3.5 px-4 text-right">Chi Tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredResults.map((r, idx) => {
                  let badge = 'bg-emerald-100 text-emerald-800';
                  let label = 'Giỏi';
                  if (r.scores.total >= 9.0) {
                    badge = 'bg-teal-100 text-teal-800';
                    label = 'Xuất sắc';
                  } else if (r.scores.total >= 7.0) {
                    badge = 'bg-blue-100 text-blue-800';
                    label = 'Khá';
                  } else if (r.scores.total >= 5.0) {
                    badge = 'bg-amber-100 text-amber-800';
                    label = 'Trung bình';
                  } else {
                    badge = 'bg-rose-100 text-rose-800';
                    label = 'Cần ôn thêm';
                  }

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{r.studentName}</div>
                        {r.schoolName && <div className="text-[11px] text-slate-400">{r.schoolName}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {r.className}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-blue-700 font-semibold">
                        {r.scores.part1.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-700 font-semibold">
                        {r.scores.part2.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-amber-700 font-semibold">
                        {r.scores.part3.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-purple-700 font-semibold">
                        {r.scores.part4.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-base font-black text-slate-900 font-mono">
                          {r.scores.total.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/10đ</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badge}`}>
                          {label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs text-slate-500">
                        <div>{new Date(r.submittedAt).toLocaleDateString('vi-VN')}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(r.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ({formatDuration(r.durationSeconds)})
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onReviewStudentResult(r)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                            title="Xem chi tiết bài làm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteResult(r.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa kết quả này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
