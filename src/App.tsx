import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StudentInfo, 
  ExamMode, 
  ExamResult, 
  DetailedUserAnswers 
} from './types';
import { 
  mcqQuestions, 
  trueFalseQuestions, 
  dragCategories, 
  dragItems, 
  matchingPairs, 
  fillBlankItems 
} from './data/quizData';
import { fetchAllResults, saveExamResult, deleteExamResult } from './services/api';
import { Header } from './components/Header';
import { StudentLogin } from './components/StudentLogin';
import { Part1MCQ } from './components/Part1MCQ';
import { Part2TrueFalse } from './components/Part2TrueFalse';
import { Part3DragDrop } from './components/Part3DragDrop';
import { Part4FillBlanks } from './components/Part4FillBlanks';
import { ExamSummaryModal } from './components/ExamSummaryModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ReviewModal } from './components/ReviewModal';

const EXAM_DURATION = 15 * 60; // 15 minutes (900s)

export default function App() {
  // App & Student State
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [mode, setMode] = useState<ExamMode>('exam');
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isTeacherView, setIsTeacherView] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [reviewingResult, setReviewingResult] = useState<ExamResult | null>(null);
  const [resultsList, setResultsList] = useState<ExamResult[]>([]);

  // User Interactive Answers State
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean | null>>>({});
  const [dragClassification, setDragClassification] = useState<Record<string, string[]>>({});
  const [dragMatching, setDragMatching] = useState<Record<string, string>>({});
  const [fillBlankAnswers, setFillBlankAnswers] = useState<Record<string, string>>({});

  const timerRef = useRef<any>(null);

  // Load results on mount
  useEffect(() => {
    fetchAllResults().then((data) => {
      if (Array.isArray(data)) {
        setResultsList(data);
      }
    });
  }, []);

  // Timer effect for Exam mode
  useEffect(() => {
    if (student && mode === 'exam' && !isSubmitted && !isTeacherView) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [student, mode, isSubmitted, isTeacherView]);

  // Start exam from login
  const handleStartExam = (info: StudentInfo, selectedMode: ExamMode) => {
    setStudent(info);
    setMode(selectedMode);
    setTimeLeft(EXAM_DURATION);
    setActiveTab(1);
    setIsSubmitted(false);
    setCurrentResult(null);
    setShowSummaryModal(false);
    // Reset answers
    setMcqAnswers({});
    setTfAnswers({});
    const emptyCats: Record<string, string[]> = {};
    dragCategories.forEach((c) => (emptyCats[c.id] = []));
    setDragClassification(emptyCats);
    setDragMatching({});
    setFillBlankAnswers({});
  };

  // Reset exam completely
  const handleResetExam = () => {
    if (isSubmitted || window.confirm('Bạn có muốn thoát và bắt đầu lại không?')) {
      setStudent(null);
      setIsSubmitted(false);
      setCurrentResult(null);
      setShowSummaryModal(false);
      setActiveTab(1);
    }
  };

  // Calculate Scores
  const calculateScores = useCallback(() => {
    // 1. Part 1 MCQ (Max 2.5)
    let p1Correct = 0;
    mcqQuestions.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctAnswer) p1Correct++;
    });
    const part1Score = (p1Correct / mcqQuestions.length) * 2.5;

    // 2. Part 2 True/False (Max 2.5)
    let p2TotalStatements = 0;
    let p2CorrectStatements = 0;
    trueFalseQuestions.forEach((q) => {
      q.statements.forEach((st) => {
        p2TotalStatements++;
        if (tfAnswers[q.id]?.[st.id] === st.isCorrect) {
          p2CorrectStatements++;
        }
      });
    });
    const part2Score = (p2CorrectStatements / p2TotalStatements) * 2.5;

    // 3. Part 3 Drag & Drop (Max 2.5)
    // 3.1 Classification: 1.5 points for 10 items
    let classificationCorrect = 0;
    Object.entries(dragClassification).forEach(([catId, itemIds]) => {
      ((itemIds as string[]) || []).forEach((itemId: string) => {
        const item = dragItems.find((i) => i.id === itemId);
        if (item && item.category === catId) {
          classificationCorrect++;
        }
      });
    });
    const classScore = (classificationCorrect / dragItems.length) * 1.5;

    // 3.2 Matching: 1.0 point for 5 pairs
    let matchingCorrect = 0;
    matchingPairs.forEach((pair) => {
      if (dragMatching[pair.id] === pair.targetDescription) {
        matchingCorrect++;
      }
    });
    const matchScore = (matchingCorrect / matchingPairs.length) * 1.0;
    const part3Score = classScore + matchScore;

    // 4. Part 4 Fill in Blanks (Max 2.5)
    const normalize = (str: string) => (str || '').toLowerCase().trim().replace(/\s+/g, ' ');
    let p4Correct = 0;
    fillBlankItems.forEach((item) => {
      const userVal = normalize(fillBlankAnswers[item.id]);
      const allAcceptables = [item.correctAnswer, ...(item.acceptableAnswers || [])].map(normalize);
      if (allAcceptables.includes(userVal)) {
        p4Correct++;
      }
    });
    const part4Score = (p4Correct / fillBlankItems.length) * 2.5;

    const total = Math.min(10.0, Math.round((part1Score + part2Score + part3Score + part4Score) * 100) / 100);

    return {
      part1: Math.round(part1Score * 100) / 100,
      part2: Math.round(part2Score * 100) / 100,
      part3: Math.round(part3Score * 100) / 100,
      part4: Math.round(part4Score * 100) / 100,
      total,
    };
  }, [mcqAnswers, tfAnswers, dragClassification, dragMatching, fillBlankAnswers]);

  // Handle final submission
  const handleSubmitExam = async () => {
    if (!student) return;

    const scores = calculateScores();
    const duration = EXAM_DURATION - timeLeft;

    const detailed: DetailedUserAnswers = {
      part1: mcqAnswers,
      part2: tfAnswers,
      part3: {
        matching: dragMatching,
        classification: dragClassification,
      },
      part4: fillBlankAnswers,
    };

    const newResult: Omit<ExamResult, 'id'> = {
      studentName: student.name,
      className: student.className,
      schoolName: student.school || '',
      mode,
      durationSeconds: Math.max(15, duration),
      scores,
      detailedResults: detailed,
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitted(true);
    const saved = await saveExamResult(newResult);
    if (saved) {
      setCurrentResult(saved);
      setResultsList((prev) => [saved, ...prev]);
    }
    setShowSummaryModal(true);
  };

  // Answer handlers
  const handleSelectMCQ = (qId: string, optKey: string) => {
    setMcqAnswers((prev) => ({ ...prev, [qId]: optKey }));
  };

  const handleSelectTF = (qId: string, stId: string, val: boolean) => {
    setTfAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [stId]: val,
      },
    }));
  };

  const handleUpdateClassification = (newClassification: Record<string, string[]>) => {
    setDragClassification(newClassification);
  };

  const handleUpdateMatching = (newMatching: Record<string, string>) => {
    setDragMatching(newMatching);
  };

  const handleChangeFillBlank = (itemId: string, val: string) => {
    setFillBlankAnswers((prev) => ({ ...prev, [itemId]: val }));
  };

  // Teacher actions
  const handleDeleteResult = async (id?: string) => {
    const ok = await deleteExamResult(id);
    if (ok) {
      if (id) {
        setResultsList((prev) => prev.filter((r) => r.id !== id));
      } else {
        setResultsList([]);
      }
    }
  };

  const handleSeedDemoData = async () => {
    const demoStudents = [
      { name: 'Nguyễn Trần Hải Đăng', class: '10A1', scores: { part1: 2.5, part2: 2.5, part3: 2.35, part4: 2.5, total: 9.85 }, dur: 420 },
      { name: 'Lê Phương Thảo', class: '10A1', scores: { part1: 2.19, part2: 2.29, part3: 2.5, part4: 2.0, total: 8.98 }, dur: 510 },
      { name: 'Hoàng Minh Quân', class: '10A2', scores: { part1: 2.19, part2: 1.88, part3: 2.05, part4: 1.5, total: 7.62 }, dur: 630 },
      { name: 'Trần Thu Trang', class: '10A2', scores: { part1: 1.88, part2: 2.08, part3: 1.9, part4: 2.0, total: 7.86 }, dur: 580 },
      { name: 'Vũ Đức Nam', class: '10A3', scores: { part1: 1.56, part2: 1.46, part3: 1.6, part4: 1.5, total: 6.12 }, dur: 720 },
      { name: 'Phạm Quốc Tuấn', class: '10A3', scores: { part1: 1.25, part2: 1.04, part3: 1.2, part4: 1.0, total: 4.49 }, dur: 890 },
    ];

    for (const d of demoStudents) {
      await saveExamResult({
        studentName: d.name,
        className: d.class,
        schoolName: 'THPT Chuyên',
        mode: 'exam',
        durationSeconds: d.dur,
        scores: d.scores,
        detailedResults: {
          part1: { 'mcq-1': 'A', 'mcq-2': 'B', 'mcq-3': 'C', 'mcq-4': 'C' },
          part2: {},
          part3: { matching: {}, classification: {} },
          part4: {},
        },
        submittedAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      });
    }

    const refreshed = await fetchAllResults();
    setResultsList(refreshed);
  };

  const calculatedScores = calculateScores();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-200">
      {/* Top App Header */}
      <Header
        student={student}
        mode={mode}
        timeLeft={timeLeft}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isTeacherView={isTeacherView}
        onToggleTeacherView={() => setIsTeacherView((prev) => !prev)}
        onResetExam={handleResetExam}
        isSubmitted={isSubmitted}
        scores={calculatedScores}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {isTeacherView ? (
          <TeacherDashboard
            results={resultsList}
            onReviewStudentResult={(r) => setReviewingResult(r)}
            onDeleteResult={handleDeleteResult}
            onSeedDemoData={handleSeedDemoData}
            onBackToExam={() => setIsTeacherView(false)}
          />
        ) : !student ? (
          <StudentLogin onStart={handleStartExam} />
        ) : (
          <div>
            {/* Active Tab View */}
            {activeTab === 1 && (
              <Part1MCQ
                questions={mcqQuestions}
                answers={mcqAnswers}
                onSelectAnswer={handleSelectMCQ}
                mode={mode}
                isSubmitted={isSubmitted}
                onNextPart={() => setActiveTab(2)}
              />
            )}

            {activeTab === 2 && (
              <Part2TrueFalse
                questions={trueFalseQuestions}
                answers={tfAnswers}
                onSelectTF={handleSelectTF}
                mode={mode}
                isSubmitted={isSubmitted}
                onPrevPart={() => setActiveTab(1)}
                onNextPart={() => setActiveTab(3)}
              />
            )}

            {activeTab === 3 && (
              <Part3DragDrop
                categories={dragCategories}
                items={dragItems}
                matchingPairs={matchingPairs}
                userClassification={dragClassification}
                userMatching={dragMatching}
                onUpdateClassification={handleUpdateClassification}
                onUpdateMatching={handleUpdateMatching}
                mode={mode}
                isSubmitted={isSubmitted}
                onPrevPart={() => setActiveTab(2)}
                onNextPart={() => setActiveTab(4)}
              />
            )}

            {activeTab === 4 && (
              <Part4FillBlanks
                items={fillBlankItems}
                answers={fillBlankAnswers}
                onChangeAnswer={handleChangeFillBlank}
                mode={mode}
                isSubmitted={isSubmitted}
                onPrevPart={() => setActiveTab(3)}
                onSubmitExam={handleSubmitExam}
              />
            )}
          </div>
        )}
      </main>

      {/* Student Exam Result Summary Modal */}
      {showSummaryModal && currentResult && (
        <ExamSummaryModal
          result={currentResult}
          onReviewDetails={() => {
            setShowSummaryModal(false);
            setReviewingResult(currentResult);
          }}
          onRetry={() => {
            setShowSummaryModal(false);
            if (student) {
              handleStartExam(student, mode);
            }
          }}
          onOpenTeacherView={() => {
            setShowSummaryModal(false);
            setIsTeacherView(true);
          }}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {/* Detail Question Review Modal (for teacher or student) */}
      {reviewingResult && (
        <ReviewModal
          result={reviewingResult}
          onClose={() => setReviewingResult(null)}
        />
      )}
    </div>
  );
}
