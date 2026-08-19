import React, { useState } from 'react';
import { FillBlankItem, ExamMode } from '../types';
import { Sparkles, HelpCircle, CheckCircle2, XCircle, ArrowLeft, Send, PenTool, Lightbulb } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/audio';

interface Part4FillBlanksProps {
  items: FillBlankItem[];
  answers: Record<string, string>; // itemId -> entered text
  onChangeAnswer: (itemId: string, val: string) => void;
  mode: ExamMode;
  isSubmitted: boolean;
  onPrevPart: () => void;
  onSubmitExam: () => void;
}

export const Part4FillBlanks: React.FC<Part4FillBlanksProps> = ({
  items,
  answers,
  onChangeAnswer,
  mode,
  isSubmitted,
  onPrevPart,
  onSubmitExam,
}) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(items[0]?.id || null);
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  const toggleHint = (id: string) => {
    setShowHint(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Normalize string for checking
  const normalize = (str: string) => {
    return (str || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  };

  const checkIsCorrect = (item: FillBlankItem, userVal: string) => {
    const norm = normalize(userVal);
    if (!norm) return false;
    const allAcceptables = [item.correctAnswer, ...(item.acceptableAnswers || [])].map(normalize);
    return allAcceptables.includes(norm);
  };

  const answeredCount = Object.values(answers).filter((v: string) => (v || '').trim().length > 0).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Title & Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 text-xs font-bold uppercase">
              Trò 4 (2.5 Điểm)
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Điền Khuyết Từ Khóa Địa Lí Cốt Lõi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gõ trực tiếp vào chỗ trống hoặc nhấp chọn từ trong Ngân hàng từ khóa bên dưới.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Tiến độ Trò 4</div>
            <div className="text-sm font-bold text-purple-600">
              {answeredCount} / {items.length} ô
            </div>
          </div>
          <div className="w-20 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4 mb-6">
        {items.map((item, idx) => {
          const userVal = answers[item.id] || '';
          const isCorrect = checkIsCorrect(item, userVal);
          const isActive = activeItemId === item.id;

          let borderStyle = 'border-slate-200 bg-white';
          if (isSubmitted) {
            borderStyle = isCorrect ? 'border-emerald-300 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/40';
          } else if (isActive) {
            borderStyle = 'border-purple-500 bg-purple-50/20 ring-2 ring-purple-200';
          }

          return (
            <div
              key={item.id}
              onClick={() => !isSubmitted && setActiveItemId(item.id)}
              className={`p-5 rounded-2xl border-2 transition shadow-sm ${borderStyle}`}
            >
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs">
                <span className="font-bold text-purple-700 uppercase">Câu {idx + 1}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHint(item.id);
                  }}
                  className="flex items-center gap-1 text-slate-500 hover:text-purple-700 font-medium"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{showHint[item.id] ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
                </button>
              </div>

              {/* Cloze sentence */}
              <div className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                <span>{item.sentenceBefore}</span>
                <span className="inline-block mx-1.5 align-middle">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userVal}
                    onFocus={() => setActiveItemId(item.id)}
                    onChange={(e) => onChangeAnswer(item.id, e.target.value)}
                    placeholder="... (điền vào đây)"
                    className={`px-3 py-1.5 rounded-lg border-2 text-sm sm:text-base font-bold text-center transition min-w-[140px] max-w-[220px] ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                          : 'bg-rose-100 border-rose-500 text-rose-900 line-through'
                        : 'bg-purple-50 border-purple-400 focus:bg-white focus:border-purple-600 text-purple-900'
                    }`}
                  />
                </span>
                <span>{item.sentenceAfter}</span>
              </div>

              {/* Word Bank Quick Picker for this question */}
              {!isSubmitted && item.wordBank && item.wordBank.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Từ khóa gợi ý:</span>
                  {item.wordBank.map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChangeAnswer(item.id, word);
                        if (mode === 'practice') {
                          if (checkIsCorrect(item, word)) playCorrectSound();
                          else playIncorrectSound();
                        } else {
                          playClickSound();
                        }
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        normalize(userVal) === normalize(word)
                          ? 'bg-purple-600 text-white border-purple-600 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-purple-100 hover:text-purple-900'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              )}

              {/* Hint Box */}
              {showHint[item.id] && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Gợi ý:</span> {item.hint}
                </div>
              )}

              {/* Correct answer display when submitted */}
              {isSubmitted && !isCorrect && (
                <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đáp án chuẩn: &quot;{item.correctAnswer}&quot;</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation & Final Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={onPrevPart}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trò 3</span>
        </button>

        {!isSubmitted && (
          <button
            onClick={onSubmitExam}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <Send className="w-5 h-5" />
            <span>NỘP BÀI KIỂM TRA & XEM ĐIỂM</span>
          </button>
        )}
      </div>
    </div>
  );
};
