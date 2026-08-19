import React, { useState, useEffect } from 'react';
import { StudentInfo, ExamMode } from '../types';
import { BookOpen, Clock, Award, ShieldCheck, GraduationCap, UserCheck, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';

interface HeaderProps {
  student: StudentInfo | null;
  mode: ExamMode;
  timeLeft: number; // in seconds
  activeTab: number; // 1, 2, 3, 4
  onSelectTab: (tab: number) => void;
  isTeacherView: boolean;
  onToggleTeacherView: () => void;
  onResetExam: () => void;
  isSubmitted: boolean;
  scores?: {
    part1: number;
    part2: number;
    part3: number;
    part4: number;
    total: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  student,
  mode,
  timeLeft,
  activeTab,
  onSelectTab,
  isTeacherView,
  onToggleTeacherView,
  onResetExam,
  isSubmitted,
  scores,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);

  useEffect(() => {
    setSoundOn(getSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 1, title: 'Trò 1: Trắc nghiệm', badge: '8 câu' },
    { id: 2, title: 'Trò 2: Đúng / Sai', badge: '3 câu lớn' },
    { id: 3, title: 'Trò 3: Kéo thả', badge: '10 thẻ' },
    { id: 4, title: 'Trò 4: Điền khuyết', badge: '5 ô' },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Địa Lí 10 • GDPT 2018
              </span>
              <span className="text-xs text-slate-400">Bài 2: Một số phương pháp biểu hiện trên bản đồ</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
              Kiểm Tra - Đánh Giá Thường Xuyên
            </h1>
          </div>
        </div>

        {/* Student Info & Controls */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {student && !isTeacherView && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-slate-200">{student.name}</p>
                <p className="text-xs text-blue-400 font-medium">Lớp: {student.className}</p>
              </div>
            </div>
          )}

          {/* Timer if exam mode and not submitted */}
          {student && mode === 'exam' && !isSubmitted && !isTeacherView && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm border ${
              timeLeft < 180 
                ? 'bg-rose-950/70 border-rose-600 text-rose-300 animate-pulse' 
                : 'bg-slate-800 border-amber-500/40 text-amber-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          {/* Live Score if submitted */}
          {isSubmitted && scores && !isTeacherView && (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500 px-3 py-1.5 rounded-lg text-emerald-300 font-bold text-sm">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Tổng điểm: {scores.total.toFixed(2)} / 10</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundOn 
                ? 'bg-slate-800 hover:bg-slate-700 text-blue-400 border-slate-700' 
                : 'bg-slate-800/50 text-slate-500 border-slate-800'
            }`}
            title={soundOn ? 'Âm thanh: ĐANG BẬT (nhấn để tắt)' : 'Âm thanh: ĐÃ TẮT (nhấn để bật)'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Teacher Dashboard Switch */}
          <button
            onClick={onToggleTeacherView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isTeacherView
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Dành cho Giáo viên: Xem bảng tổng hợp kết quả học sinh"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isTeacherView ? 'Quay lại làm bài' : 'Dành cho Giáo Viên'}</span>
          </button>

          {student && !isTeacherView && (
            <button
              onClick={onResetExam}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Đổi thông tin hoặc làm lại từ đầu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation for 4 Activities (Only show when student is logged in and not in teacher view) */}
      {student && !isTeacherView && (
        <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-2 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                  }`}
                >
                  <span>{tab.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
