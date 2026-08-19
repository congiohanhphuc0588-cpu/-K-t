import React from 'react';
import { TrueFalseQuestion, ExamMode } from '../types';
import { Check, X, Sparkles, HelpCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/audio';

interface Part2TrueFalseProps {
  questions: TrueFalseQuestion[];
  answers: Record<string, Record<string, boolean | null>>; // questionId -> statementId -> boolean | null
  onSelectTF: (questionId: string, statementId: string, value: boolean) => void;
  mode: ExamMode;
  isSubmitted: boolean;
  onNextPart: () => void;
  onPrevPart: () => void;
}

export const Part2TrueFalse: React.FC<Part2TrueFalseProps> = ({
  questions,
  answers,
  onSelectTF,
  mode,
  isSubmitted,
  onNextPart,
  onPrevPart,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = React.useState(0);
  const [showExplanation, setShowExplanation] = React.useState<Record<string, boolean>>({});

  const currentQ = questions[activeQuestionIdx];
  const qAnswers = answers[currentQ.id] || {};

  // Count total answered statements
  let totalStatements = 0;
  let totalAnswered = 0;
  questions.forEach((q) => {
    q.statements.forEach((st) => {
      totalStatements++;
      if (answers[q.id]?.[st.id] !== undefined && answers[q.id]?.[st.id] !== null) {
        totalAnswered++;
      }
    });
  });

  const toggleExplanation = (stId: string) => {
    setShowExplanation((prev) => ({ ...prev, [stId]: !prev[stId] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Title & Progress Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
              Trò 2 (2.5 Điểm)
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Trắc Nghiệm Khách Quan Đúng / Sai
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Định dạng mới: Mỗi câu gồm 1 ngữ cảnh và 4 mệnh đề a, b, c, d. Hãy chọn Đúng hoặc Sai cho từng mệnh đề.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Tiến độ Trò 2</div>
            <div className="text-sm font-bold text-emerald-600">
              {totalAnswered} / {totalStatements} ý
            </div>
          </div>
          <div className="w-20 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(totalAnswered / totalStatements) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs for Câu 1, Câu 2, Câu 3 */}
      <div className="flex gap-2 mb-6">
        {questions.map((q, idx) => {
          const isCurrent = idx === activeQuestionIdx;
          const answeredInQ = Object.values(answers[q.id] || {}).filter((v) => v !== null && v !== undefined).length;
          return (
            <button
              key={q.id}
              onClick={() => setActiveQuestionIdx(idx)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 ${
                isCurrent
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Câu {idx + 1}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                isCurrent ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {answeredInQ}/4 ý
              </span>
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
          {currentQ.title}
        </h3>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 italic mb-6 leading-relaxed">
          &quot;{currentQ.passage}&quot;
        </div>

        {/* 4 Sub-statements */}
        <div className="space-y-4">
          {currentQ.statements.map((st) => {
            const userChoice = qAnswers[st.id]; // true, false, or undefined
            const isCorrect = userChoice === st.isCorrect;

            let statusBorder = 'border-slate-200';
            if (isSubmitted) {
              statusBorder = isCorrect ? 'border-emerald-300 bg-emerald-50/40' : 'border-rose-300 bg-rose-50/40';
            }

            return (
              <div
                key={st.id}
                className={`p-4 rounded-xl border-2 transition ${statusBorder} bg-white shadow-xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed sm:pr-4 flex-1">
                    {st.text}
                  </div>

                  {/* Buttons for ĐÚNG / SAI */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => {
                        onSelectTF(currentQ.id, st.id, true);
                        if (mode === 'practice') {
                          if (st.isCorrect === true) playCorrectSound();
                          else playIncorrectSound();
                        } else {
                          playClickSound();
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 flex items-center gap-1.5 transition ${
                        userChoice === true
                          ? isSubmitted
                            ? st.isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : isSubmitted && st.isCorrect
                          ? 'border-emerald-500 text-emerald-700 bg-emerald-50 font-bold'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>ĐÚNG</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => {
                        onSelectTF(currentQ.id, st.id, false);
                        if (mode === 'practice') {
                          if (st.isCorrect === false) playCorrectSound();
                          else playIncorrectSound();
                        } else {
                          playClickSound();
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 flex items-center gap-1.5 transition ${
                        userChoice === false
                          ? isSubmitted
                            ? !st.isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : isSubmitted && !st.isCorrect
                          ? 'border-emerald-500 text-emerald-700 bg-emerald-50 font-bold'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-rose-400 hover:text-rose-700'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>SAI</span>
                    </button>
                  </div>
                </div>

                {/* Explanation in Practice Mode or Submitted */}
                {(mode === 'practice' || isSubmitted) && (
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                    {showExplanation[st.id] || isSubmitted ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
                        <span className="font-bold">
                          Đáp án đúng: {st.isCorrect ? 'ĐÚNG' : 'SAI'} —{' '}
                        </span>
                        <span>{st.explanation}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleExplanation(st.id)}
                        className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Xem giải thích ý này</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrevPart}
          className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trò 1</span>
        </button>

        <div className="flex gap-2">
          {activeQuestionIdx < questions.length - 1 ? (
            <button
              onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
            >
              <span>Câu tiếp theo ({activeQuestionIdx + 2}/{questions.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onNextPart}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 transition"
            >
              <span>Chuyển sang Trò 3 (Kéo thả)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
