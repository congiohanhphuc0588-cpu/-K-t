export interface StudentInfo {
  name: string;
  className: string;
  school?: string;
}

export type ExamMode = 'exam' | 'practice'; // 'exam' (tính giờ, nộp điểm) | 'practice' (luyện tập, xem gợi ý ngay)

// Part 1: MCQ
export interface MCQQuestion {
  id: string;
  question: string;
  context?: string;
  image?: string;
  options: {
    key: string; // 'A' | 'B' | 'C' | 'D'
    text: string;
  }[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
}

// Part 2: True/False (New BGD Format)
export interface TrueFalseStatement {
  id: string;
  text: string;
  isCorrect: boolean; // true = Đúng, false = Sai
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  title: string;
  passage: string;
  statements: TrueFalseStatement[];
}

// Part 3: Drag & Drop
export interface DragItem {
  id: string;
  content: string;
  category: string; // e.g. 'phuong_phap_ki_hieu', 'duong_chuyen_dong', 'cham_diem', 'ban_do_bieu_do', 'khoanh_vung'
  hint?: string;
}

export interface DragCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  color: string;
}

export interface MatchingPair {
  id: string;
  method: string;
  targetDescription: string;
  example: string;
}

// Part 4: Fill in the Blanks
export interface FillBlankItem {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  correctAnswer: string; // từ khóa đúng
  acceptableAnswers?: string[]; // các đáp án tương đương
  hint: string;
  wordBank: string[];
}

// Full Exam Submission Result
export interface DetailedUserAnswers {
  part1: Record<string, string>; // questionId -> selectedOption
  part2: Record<string, Record<string, boolean | null>>; // questionId -> statementId -> true/false/null
  part3: {
    matching: Record<string, string>; // methodId -> targetDescriptionId
    classification: Record<string, string[]>; // categoryId -> itemIds[]
  };
  part4: Record<string, string>; // itemId -> enteredText
}

export interface ExamResult {
  id: string;
  studentName: string;
  className: string;
  schoolName?: string;
  mode: ExamMode;
  durationSeconds: number;
  scores: {
    part1: number;
    part2: number;
    part3: number;
    part4: number;
    total: number;
  };
  detailedResults: DetailedUserAnswers;
  submittedAt: string;
}
