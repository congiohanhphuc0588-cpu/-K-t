import React, { useState } from 'react';
import { ExamResult } from '../types';
import { playClickSound } from '../utils/audio';
import { 
  mcqQuestions, 
  trueFalseQuestions, 
  dragCategories, 
  dragItems, 
  matchingPairs, 
  fillBlankItems 
} from '../data/quizData';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Award, 
  User, 
  Clock, 
  HelpCircle, 
  Check, 
  Layers, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ReviewModalProps {
  result: ExamResult;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const { studentName, className, scores, durationSeconds, detailedResults, submittedAt } = result;

  const normalize = (str: string) => (str || '').toLowerCase().trim().replace(/\s+/g, ' ');

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} phút ${s} giây`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-bold uppercase">
                Chi Tiết Bài Làm
              </span>
              <span className="text-xs text-slate-400">
                {new Date(submittedAt).toLocaleString('vi-VN')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              {studentName} — Lớp {className}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-1">
              <span>Thời gian làm: <strong>{formatDuration(durationSeconds)}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-bold text-sm">
                Tổng điểm: {scores.total.toFixed(2)} / 10
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab(1)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Trò 1: Trắc nghiệm</span>
            <span className="text-[11px] opacity-80">({scores.part1.toFixed(2)}/2.5đ)</span>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 2 ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Trò 2: Đúng / Sai</span>
            <span className="text-[11px] opacity-80">({scores.part2.toFixed(2)}/2.5đ)</span>
          </button>

          <button
            onClick={() => setActiveTab(3)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 3 ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Trò 3: Kéo thả</span>
            <span className="text-[11px] opacity-80">({scores.part3.toFixed(2)}/2.5đ)</span>
          </button>

          <button
            onClick={() => setActiveTab(4)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 4 ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Trò 4: Điền khuyết</span>
            <span className="text-[11px] opacity-80">({scores.part4.toFixed(2)}/2.5đ)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: MCQ */}
          {activeTab === 1 && (
            <div className="space-y-4">
              {mcqQuestions.map((q, idx) => {
                const userChoice = detailedResults?.part1?.[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border-2 transition ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                      <span className="font-bold text-slate-600">Câu {idx + 1}</span>
                      {isCorrect ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> ĐÚNG (+0.31đ)
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> SAI (0đ)
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                      {q.question}
                    </p>

                    <div className="space-y-2 mb-3">
                      {q.options.map((opt) => {
                        const isSelected = userChoice === opt.key;
                        const isTarget = q.correctAnswer === opt.key;

                        let style = 'border-slate-200 bg-white text-slate-700';
                        if (isTarget) {
                          style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isSelected && !isTarget) {
                          style = 'border-rose-400 bg-rose-50 text-rose-900 font-medium line-through';
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 ${style}`}
                          >
                            <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                            {isSelected && (
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded ml-auto">
                                Đã chọn
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: TRUE / FALSE */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {trueFalseQuestions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <h4 className="text-base font-bold text-slate-900 mb-1">{q.title}</h4>
                  <p className="text-xs text-slate-600 italic mb-4 bg-slate-50 p-2.5 rounded-lg">
                    &quot;{q.passage}&quot;
                  </p>

                  <div className="space-y-3">
                    {q.statements.map((st) => {
                      const userVal = detailedResults?.part2?.[q.id]?.[st.id];
                      const isCorrect = userVal === st.isCorrect;

                      return (
                        <div
                          key={st.id}
                          className={`p-3.5 rounded-xl border-2 text-xs sm:text-sm ${
                            isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="font-medium text-slate-800">{st.text}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                                userVal === true ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                ĐÚNG
                              </span>
                              <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                                userVal === false ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                SAI
                              </span>
                              {isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-1" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-600 ml-1" />
                              )}
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                            <strong>Đáp án đúng: {st.isCorrect ? 'ĐÚNG' : 'SAI'}</strong> — {st.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DRAG & DROP */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Kết quả phân loại 10 thẻ tình huống vào 5 phương pháp bản đồ:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dragCategories.map((cat) => {
                    const assignedIds = detailedResults?.part3?.classification?.[cat.id] || [];
                    return (
                      <div key={cat.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="font-bold text-xs text-slate-800 uppercase pb-2 border-b border-slate-200 flex justify-between">
                          <span>{cat.title}</span>
                          <span>{assignedIds.length} thẻ</span>
                        </div>
                        <div className="space-y-1.5 mt-2.5">
                          {assignedIds.map((itemId) => {
                            const item = dragItems.find((i) => i.id === itemId);
                            if (!item) return null;
                            const isCorrect = item.category === cat.id;

                            return (
                              <div
                                key={item.id}
                                className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                                  isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                                }`}
                              >
                                <span>{item.content}</span>
                                {isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                          {assignedIds.length === 0 && (
                            <p className="text-xs text-slate-400 italic">Không có thẻ nào</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Kết quả ghép cặp định nghĩa:
                </h4>
                <div className="space-y-2">
                  {matchingPairs.map((pair) => {
                    const userVal = detailedResults?.part3?.matching?.[pair.id];
                    const isCorrect = userVal === pair.targetDescription;

                    return (
                      <div
                        key={pair.id}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                        }`}
                      >
                        <span className="font-bold text-slate-800">{pair.method}</span>
                        <div className="text-xs text-slate-600 flex-1 sm:px-4">
                          {userVal || '<Chưa ghép>'}
                        </div>
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> ĐÚNG
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold text-xs flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Chuẩn: {pair.targetDescription}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILL IN BLANKS */}
          {activeTab === 4 && (
            <div className="space-y-4">
              {fillBlankItems.map((item, idx) => {
                const userVal = detailedResults?.part4?.[item.id] || '';
                const norm = normalize(userVal);
                const allAcceptables = [item.correctAnswer, ...(item.acceptableAnswers || [])].map(normalize);
                const isCorrect = allAcceptables.includes(norm);

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border-2 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                      <span className="font-bold text-slate-600">Câu {idx + 1}</span>
                      {isCorrect ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> ĐÚNG (+0.50đ)
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> SAI (0đ)
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                      <span>{item.sentenceBefore}</span>
                      <strong className={`mx-1.5 px-2 py-0.5 rounded ${
                        isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900 line-through'
                      }`}>
                        {userVal || '(bỏ trống)'}
                      </strong>
                      <span>{item.sentenceAfter}</span>
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                      <strong className="text-emerald-700">Đáp án chuẩn: &quot;{item.correctAnswer}&quot;</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
