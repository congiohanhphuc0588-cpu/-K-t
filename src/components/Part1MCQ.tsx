import React from 'react';
import { MCQQuestion, ExamMode } from '../types';
import { CheckCircle2, HelpCircle, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/audio';

interface Part1MCQProps {
  questions: MCQQuestion[];
  answers: Record<string, string>;
  onSelectAnswer: (questionId: string, optionKey: string) => void;
  mode: ExamMode;
  isSubmitted: boolean;
  onNextPart: () => void;
}

export const Part1MCQ: React.FC<Part1MCQProps> = ({
  questions,
  answers,
  onSelectAnswer,
  mode,
  isSubmitted,
  onNextPart,
}) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [showExplanation, setShowExplanation] = React.useState<Record<string, boolean>>({});

  const currentQ = questions[currentIdx];
  const selectedOpt = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;

  const toggleExplanation = (qId: string) => {
    setShowExplanation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Title & Progress Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase">
              Trò 1 (2.5 Điểm)
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Trắc Nghiệm Khách Quan Nhiều Lựa Chọn
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chọn 1 đáp án đúng nhất (A, B, C hoặc D) cho mỗi câu hỏi dưới đây.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">Tiến độ Trò 1</div>
            <div className="text-sm font-bold text-blue-600">
              {answeredCount} / {questions.length} câu
            </div>
          </div>
          <div className="w-20 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Navigation Numbers */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-slate-500 mr-2">Câu hỏi:</span>
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = idx === currentIdx;
          const isCorrect = isSubmitted && answers[q.id] === q.correctAnswer;
          const isWrong = isSubmitted && isAnswered && answers[q.id] !== q.correctAnswer;

          let btnClass = 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100';
          if (isCurrent) {
            btnClass = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 font-bold';
          } else if (isSubmitted) {
            if (isCorrect) btnClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
            else if (isWrong) btnClass = 'bg-rose-500 text-white border-rose-600 font-bold';
            else btnClass = 'bg-slate-200 text-slate-500 border-slate-300';
          } else if (isAnswered) {
            btnClass = 'bg-blue-50 text-blue-700 border-blue-300 font-semibold';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition flex items-center justify-center ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            Câu {currentIdx + 1} / {questions.length}
          </span>
          {currentQ.context && (
            <span className="text-xs text-slate-500 italic bg-slate-100 px-2 py-0.5 rounded">
              {currentQ.context}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isChosen = selectedOpt === opt.key;
            const isCorrectOption = currentQ.correctAnswer === opt.key;
            
            let cardStyle = 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-slate-800';
            let badgeStyle = 'bg-white border-slate-300 text-slate-600 font-bold';

            if (isSubmitted) {
              if (isCorrectOption) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                badgeStyle = 'bg-emerald-600 border-emerald-600 text-white';
              } else if (isChosen && !isCorrectOption) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                badgeStyle = 'bg-rose-600 border-rose-600 text-white';
              }
            } else if (isChosen) {
              cardStyle = 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold shadow-sm';
              badgeStyle = 'bg-blue-600 border-blue-600 text-white';
            }

            return (
              <div
                key={opt.key}
                onClick={() => {
                  if (!isSubmitted) {
                    onSelectAnswer(currentQ.id, opt.key);
                    if (mode === 'practice') {
                      if (opt.key === currentQ.correctAnswer) {
                        playCorrectSound();
                      } else {
                        playIncorrectSound();
                      }
                    } else {
                      playClickSound();
                    }
                  }
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3.5 ${cardStyle}`}
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 transition ${badgeStyle}`}>
                  {opt.key}
                </div>
                <div className="text-sm sm:text-base pt-0.5 leading-relaxed">
                  {opt.text}
                </div>
                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Practice Mode Explanation / Hint */}
        {(mode === 'practice' || isSubmitted) && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            {showExplanation[currentQ.id] || isSubmitted ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Đáp án đúng: {currentQ.correctAnswer} — Giải thích chi tiết:
                </div>
                <p className="text-amber-800/90 leading-relaxed">{currentQ.explanation}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => toggleExplanation(currentQ.id)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Xem gợi ý & giải thích kiến thức</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination & Next Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition ${
            currentIdx === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Câu trước</span>
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition"
          >
            <span>Câu tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onNextPart}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition"
          >
            <span>Chuyển sang Trò 2 (Đúng / Sai)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
