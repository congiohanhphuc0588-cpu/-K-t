import { ExamResult } from '../types';

const LOCAL_STORAGE_KEY = 'dia_li_10_results_cache';

export async function fetchAllResults(): Promise<ExamResult[]> {
  try {
    const res = await fetch('/api/results');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Also save to local storage as fallback
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch (error) {
    console.warn('Could not fetch from server, using localStorage cache:', error);
  }

  // Fallback to local storage
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  return [];
}

export async function saveExamResult(resultPayload: Omit<ExamResult, 'id'>): Promise<ExamResult | null> {
  let createdEntry: ExamResult | null = null;
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resultPayload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.entry) {
        createdEntry = data.entry;
      }
    }
  } catch (error) {
    console.warn('Server save failed, saving to local backup:', error);
  }

  // If server failed or offline, fallback to local creation
  if (!createdEntry) {
    createdEntry = {
      ...resultPayload,
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      submittedAt: new Date().toISOString(),
    };
  }

  // Always update local cache
  try {
    const current = localStorage.getItem(LOCAL_STORAGE_KEY);
    const list: ExamResult[] = current ? JSON.parse(current) : [];
    list.unshift(createdEntry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error writing to localStorage cache:', e);
  }

  return createdEntry;
}

export async function deleteExamResult(id?: string): Promise<boolean> {
  try {
    const url = id ? `/api/results?id=${encodeURIComponent(id)}` : '/api/results';
    const res = await fetch(url, { method: 'DELETE' });
    if (res.ok) {
      // update local
      const current = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (current) {
        let list: ExamResult[] = JSON.parse(current);
        if (id) {
          list = list.filter((r) => r.id !== id);
        } else {
          list = [];
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      }
      return true;
    }
  } catch (error) {
    console.error('Error deleting result:', error);
  }
  return false;
}
