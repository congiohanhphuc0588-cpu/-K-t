import React, { useState } from 'react';
import { DragCategory, DragItem, MatchingPair, ExamMode } from '../types';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/audio';
import { 
  MapPin, 
  MoveRight, 
  Dot, 
  BarChart3, 
  Scan, 
  GripVertical, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Sparkles,
  Link,
  Layers
} from 'lucide-react';

interface Part3DragDropProps {
  categories: DragCategory[];
  items: DragItem[];
  matchingPairs: MatchingPair[];
  userClassification: Record<string, string[]>; // categoryId -> itemIds[]
  userMatching: Record<string, string>; // methodId -> targetDescription
  onUpdateClassification: (newClassification: Record<string, string[]>) => void;
  onUpdateMatching: (newMatching: Record<string, string>) => void;
  mode: ExamMode;
  isSubmitted: boolean;
  onNextPart: () => void;
  onPrevPart: () => void;
}

export const Part3DragDrop: React.FC<Part3DragDropProps> = ({
  categories,
  items,
  matchingPairs,
  userClassification,
  userMatching,
  onUpdateClassification,
  onUpdateMatching,
  mode,
  isSubmitted,
  onNextPart,
  onPrevPart,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'classify' | 'match'>('classify');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Map icon name to Lucide icon component
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      case 'MoveRight': return <MoveRight className="w-4 h-4" />;
      case 'Dot': return <Dot className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4" />;
      case 'Scan': return <Scan className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  // Find which items are unassigned
  const assignedItemIds = new Set<string>();
  Object.values(userClassification).forEach((ids: string[]) => {
    (ids || []).forEach(id => assignedItemIds.add(id));
  });
  const unassignedItems = items.filter(item => !assignedItemIds.has(item.id));

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (isSubmitted) return;
    e.dataTransfer.setData('text/plain', itemId);
    setDraggedItemId(itemId);
  };

  // Handle Drop into Category
  const handleDropToCategory = (e: React.DragEvent, targetCatId: string) => {
    e.preventDefault();
    if (isSubmitted) return;
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    assignItemToCategory(itemId, targetCatId);
    setDraggedItemId(null);
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Helper to assign an item to a category
  const assignItemToCategory = (itemId: string, catId: string) => {
    const updated: Record<string, string[]> = {};
    // Clone and remove from any previous category
    categories.forEach(cat => {
      updated[cat.id] = (userClassification[cat.id] || []).filter(id => id !== itemId);
    });
    // Add to target category
    if (catId) {
      updated[catId] = [...(updated[catId] || []), itemId];
    }
    onUpdateClassification(updated);
    setSelectedItemId(null);

    const itemObj = items.find(i => i.id === itemId);
    if (mode === 'practice' && itemObj) {
      if (itemObj.category === catId) playCorrectSound();
      else playIncorrectSound();
    } else {
      playClickSound();
    }
  };

  // Helper to remove item back to pool
  const removeItemFromCategory = (itemId: string) => {
    if (isSubmitted) return;
    const updated: Record<string, string[]> = {};
    categories.forEach(cat => {
      updated[cat.id] = (userClassification[cat.id] || []).filter(id => id !== itemId);
    });
    onUpdateClassification(updated);
    playClickSound();
  };

  // Reset classification
  const handleResetClassification = () => {
    if (isSubmitted) return;
    const empty: Record<string, string[]> = {};
    categories.forEach(c => (empty[c.id] = []));
    onUpdateClassification(empty);
    setSelectedItemId(null);
    playClickSound();
  };

  // Matching helper
  const handleSelectMatching = (pairId: string, desc: string) => {
    if (isSubmitted) return;
    onUpdateMatching({
      ...userMatching,
      [pairId]: desc,
    });

    const targetPair = matchingPairs.find(p => p.id === pairId);
    if (mode === 'practice' && targetPair && desc) {
      if (targetPair.targetDescription === desc) playCorrectSound();
      else playIncorrectSound();
    } else if (desc) {
      playClickSound();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase">
              Trò 3 (2.5 Điểm)
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Kéo Thả Nội Dung & Phân Loại Phương Pháp
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kéo thả hoặc chạm/chọn để đưa 10 đối tượng địa lí vào đúng giỏ phương pháp và ghép cặp định nghĩa.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('classify')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'classify'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Phân loại 10 tình huống ({assignedItemIds.size}/10)
          </button>
          <button
            onClick={() => setActiveSubTab('match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'match'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Ghép cặp khái niệm ({Object.keys(userMatching).length}/5)
          </button>
        </div>
      </div>

      {activeSubTab === 'classify' ? (
        <div>
          {/* Instructions Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Hướng dẫn:</strong> Kéo thẻ từ kho bên dưới thả vào giỏ, hoặc <strong>nhấp vào thẻ</strong> rồi chọn giỏ tương ứng.
              </span>
            </div>
            {!isSubmitted && assignedItemIds.size > 0 && (
              <button
                onClick={handleResetClassification}
                className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-bold ml-2 underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xếp lại</span>
              </button>
            )}
          </div>

          {/* Unassigned Items Pool */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Kho thẻ hiện tượng thực tế</span>
                <span className="text-xs font-semibold text-slate-500">
                  (Còn {unassignedItems.length} thẻ chưa xếp)
                </span>
              </h3>
              {selectedItemId && (
                <span className="text-xs text-blue-600 font-semibold animate-pulse">
                  Đang chọn 1 thẻ — Hãy nhấp vào 1 trong các giỏ bên dưới!
                </span>
              )}
            </div>

            {unassignedItems.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-sm font-medium">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                Đã xếp toàn bộ 10 thẻ vào các phương pháp! Bạn có thể kiểm tra hoặc nhấn vào thẻ trong giỏ để đổi.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {unassignedItems.map(item => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable={!isSubmitted}
                      onDragStart={e => handleDragStart(e, item.id)}
                      onClick={() => {
                        if (!isSubmitted) {
                          setSelectedItemId(isSelected ? null : item.id);
                        }
                      }}
                      className={`p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition text-xs sm:text-sm font-medium flex items-center justify-between gap-2 select-none ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md ring-2 ring-blue-300'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{item.content}</span>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 shrink-0">
                        Chạm
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5 Categories Buckets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {categories.map(cat => {
              const catItems = (userClassification[cat.id] || [])
                .map(id => items.find(i => i.id === id))
                .filter(Boolean) as DragItem[];

              return (
                <div
                  key={cat.id}
                  onDrop={e => handleDropToCategory(e, cat.id)}
                  onDragOver={handleDragOver}
                  onClick={() => {
                    if (selectedItemId && !isSubmitted) {
                      assignItemToCategory(selectedItemId, cat.id);
                    }
                  }}
                  className={`rounded-2xl border-2 p-4 transition flex flex-col justify-between min-h-[220px] ${
                    selectedItemId
                      ? 'border-dashed border-blue-400 bg-blue-50/30 hover:bg-blue-100/50 cursor-pointer'
                      : cat.color
                  }`}
                >
                  <div>
                    {/* Category Title */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-white rounded-lg shadow-xs">
                          {getCategoryIcon(cat.iconName)}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm leading-tight">{cat.title}</h4>
                          <p className="text-[11px] opacity-75">{cat.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                        {catItems.length}
                      </span>
                    </div>

                    {/* Dropped items list */}
                    <div className="space-y-2 mt-3">
                      {catItems.map(item => {
                        const isCorrect = item.category === cat.id;
                        let itemStyle = 'bg-white border-slate-200 text-slate-800';
                        if (isSubmitted) {
                          itemStyle = isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                            : 'bg-rose-50 border-rose-400 text-rose-900 font-semibold';
                        }

                        return (
                          <div
                            key={item.id}
                            onClick={e => {
                              e.stopPropagation();
                              removeItemFromCategory(item.id);
                            }}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-xs group transition cursor-pointer ${itemStyle}`}
                            title={isSubmitted ? '' : 'Nhấp để trả về kho thẻ'}
                          >
                            <span className="leading-snug">{item.content}</span>
                            {isSubmitted ? (
                              isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              )
                            ) : (
                              <span className="text-[10px] text-slate-400 group-hover:text-rose-500 font-bold shrink-0">
                                ✕
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {catItems.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-300/80 rounded-xl">
                          Thả hoặc nhấp chọn thẻ vào đây
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Practice Explanation */}
                  {(mode === 'practice' || isSubmitted) && catItems.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/50 text-[11px] opacity-80">
                      Đặc trưng: {cat.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sub-tab 2: Ghép cặp khái niệm & ví dụ */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md mb-6">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-amber-600" />
            Ghép Phương pháp bản đồ với Khái niệm / Bản chất tương ứng
          </h3>

          <div className="space-y-4">
            {matchingPairs.map(pair => {
              const currentVal = userMatching[pair.id] || '';
              const isCorrect = currentVal === pair.targetDescription;

              return (
                <div
                  key={pair.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="md:w-1/3">
                    <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                      {pair.method}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Ví dụ: {pair.example}</p>
                  </div>

                  <div className="md:w-2/3">
                    <select
                      disabled={isSubmitted}
                      value={currentVal}
                      onChange={e => handleSelectMatching(pair.id, e.target.value)}
                      className={`w-full p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                            : 'bg-rose-50 border-rose-400 text-rose-900 font-bold'
                          : 'bg-white border-slate-300 focus:ring-2 focus:ring-amber-500'
                      }`}
                    >
                      <option value="">-- Chọn khái niệm tương ứng --</option>
                      {matchingPairs.map(p => (
                        <option key={p.id} value={p.targetDescription}>
                          {p.targetDescription}
                        </option>
                      ))}
                    </select>

                    {isSubmitted && !isCorrect && (
                      <p className="text-xs text-emerald-700 font-semibold mt-1.5">
                        ✓ Đúng: {pair.targetDescription}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onPrevPart}
          className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trò 2</span>
        </button>

        <button
          onClick={onNextPart}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-purple-500/20 transition"
        >
          <span>Chuyển sang Trò 4 (Điền khuyết)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
