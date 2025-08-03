import React, { useState, useRef, useEffect } from 'react';
import { X, MoreVertical, Trash2, Printer, Edit, BookOpen, List, Plus, Check, MessageCircle, Calendar, ChevronDown, ChevronUp, Repeat, PlusCircle, PlusCircleIcon, Folder, FolderPlus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale/tr';
import axios from 'axios';
import type { CategoryType, PriorityType, RepeatType } from '../../types/calendar';
import { api } from '../../services/auth';
import { updateTaskFromDetail } from '../../services/dailyTasks';

interface Subtask {
  text: string;
  done?: boolean;
}

interface Note {
  text: string;
}


export interface TaskDetailType {
  id: number; 
  title: string;
  description?: string;
  date?: string;
  time?: string;
  duration_minutes?: number;
  is_completed?: boolean;
  calendar_event_id?: string;
  learning_goal_id?: number;
  category?: CategoryType;
  tags?: string[];
  repeat?: RepeatType;
  customRepeat?: string;
  priority?: PriorityType;
  subtasks?: { text: string; done: boolean }[];
  notes?: { text: string }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDetailType; // ← Add this
  onSave: (updatedTask: TaskDetailType, shouldClose?: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
  onUpdated?: () => void; 
}

const priorities = [
  { value: 'low', label: 'Düşük', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30', textColor: 'text-emerald-500' },
  { value: 'medium', label: 'Orta', color: 'bg-amber-500', hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/30', textColor: 'text-amber-500' },
  { value: 'high', label: 'Yüksek', color: 'bg-rose-500', hoverColor: 'hover:bg-rose-100 dark:hover:bg-rose-900/30', textColor: 'text-rose-500' },
] as const;
const initialCategories = ['Ders','Sınav','Proje','Ödev','Laboratuvar','Dil','Okuma'];

const TaskDetailModal: React.FC<Props> = ({ task, onClose, onSave, onDelete, isOpen, onUpdated }) => {
  const [form, setForm] = useState<TaskDetailType>({ ...task, subtasks: task.subtasks ?? [], notes: task.notes ?? [], tags: task.tags ?? [] });
  const [showMenu, setShowMenu] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const categoryRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const [newCategory, setNewCategory] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setShowCategorySelect(false);
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (field: keyof TaskDetailType, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const addSubtask = () => { if (newSubtask.trim()) { handleChange('subtasks', [...(form.subtasks ?? []), { text: newSubtask.trim(), done: false }]); setNewSubtask(''); } };
  const toggleSubtask = (i: number) => {
    const arr = [...(form.subtasks ?? [])]; arr[i].done = !arr[i].done; handleChange('subtasks', arr);
  };
  const deleteSubtask = (i: number) => handleChange('subtasks', (form.subtasks ?? []).filter((_, j) => j !== i));

  const addNote = () => { if (newComment.trim()) { handleChange('notes', [...(form.notes ?? []), { text: newComment.trim() }]); setNewComment(''); } };
  const addTag = () => {
    const t = newTag.trim();
    if (t && !(form.tags ?? []).includes(t)) handleChange('tags', [...(form.tags ?? []), t]);
    setNewTag('');
  };
  const deleteTag = (tag: string) => handleChange('tags', (form.tags ?? []).filter(t => t !== tag));

  const save = async () => {
    await onSave(form, true);
    onUpdated?.();
    onClose();
  };
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
      setNewCategory('');
      setShowCategorySelect(false);
    }
  };

  const formatDateTime = (date?: string, time?: string) => {
    if (!date) return 'Tarih seçin';
    const d = new Date(`${date}T${time ?? '00:00'}:00`);
    return format(d, 'd MMMM yyyy, HH:mm', { locale: tr });
  };

  return !isOpen ? null : (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" onClick={onClose} />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl flex md:flex-row overflow-hidden pointer-events-auto animate-fade-in">

          {/* Sol Panel */}
          <div className="flex-1 p-0 relative flex flex-col">
            <div className="sticky top-0 z-50 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">
                  {form.title?.[0]?.toUpperCase() || 'T'}
                </div>
                <input
                  className="text-2xl font-bold bg-transparent text-gray-900 dark:text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Görev başlığı"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowMenu(prev => !prev)} className="p-2 text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-full">
                  <MoreVertical size={22} />
                </button>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 dark:hover:bg-gray-800 rounded-full">
                  <X size={22} />
                </button>
              </div>
              {showMenu && (
                <div className="absolute right-6 top-16 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-60">
                  <button onClick={onDelete} className="w-full px-4 py-2 flex items-center gap-2 text-red-500 hover:bg-red‑50">
                    <Trash2 size={18} /> Görevi Sil
                  </button>
                </div>
              )}
            </div>

            <div className="p-8 space-y-8 overflow-auto">
              {/* Açıklama */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 relative group">
                <div className="flex items-center gap-2 text-gray-500 font-medium mb-2">
                  <BookOpen size={18} /> Açıklama
                </div>
                <textarea
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Görev açıklaması"
                  className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors resize-none min-h-[100px]"
                />
                <Edit className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
              </div>

              {/* Alt Görevler */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-500 font-medium mb-4">
                  <List size={18} /> Alt Görevler
                </div>
                <div className="space-y-2">
                  {(form.subtasks ?? []).map((sub, i) => (
                    <div key={i} className="group flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-500/50 transition-colors">
                      <button
                        onClick={() => toggleSubtask(i)}
                        className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-colors ${
                          sub.done ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {sub.done && <Check size={14} />}
                      </button>
                      <input
                        value={sub.text}
                        onChange={e => {
                          const arr = [...(form.subtasks ?? [])]; arr[i].text = e.target.value;
                          handleChange('subtasks', arr);
                        }}
                        className={`flex-1 bg-transparent focus:outline-none ${sub.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}
                      />
                      <button onClick={() => deleteSubtask(i)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-900 rounded-full transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="relative">
                    <input
                      value={newSubtask}
                      onChange={e => setNewSubtask(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                      placeholder="Yeni alt görev ekle..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors"
                    />
                    <button onClick={addSubtask} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notlar */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-500 font-medium mb-4">
                  <MessageCircle size={18} /> Notlar
                </div>
                <div className="space-y-4">
                  {(form.notes ?? []).map((note, i) => (
                    <div key={i} className="group flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-medium">
                        {form.title?.[0]?.toUpperCase() || 'N'}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={note.text}
                          onChange={e => {
                            const arr = [...(form.notes ?? [])]; arr[i].text = e.target.value;
                            handleChange('notes', arr);
                          }}
                          rows={Math.min(5, note.text?.split('\n').length ?? 1)}
                          className="w-full bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none resize-y"
                        />
                        <div className="text-sm text-gray-400 mt-1">
                          {format(new Date(), 'd MMMM yyyy, HH:mm', { locale: tr })}
                        </div>
                      </div>
                      <button onClick={() => deleteSubtask(i)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-900 rounded-full transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative mt-4">
                  <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addNote())}
                    placeholder="Yeni not ekle..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors"
                  />
                  <button onClick={addNote} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Panel */}
          <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700 p-8 flex flex-col gap-6 rounded-r-2xl overflow-auto">
            

            {/* Öncelik */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Öncelik</div>
            <div className="flex justify-between gap-2">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    onClick={() => handleChange('priority', p.value)}
                  className={`relative group flex-1 h-12 rounded-xl transition-all ${form.priority === p.value
                      ? `${p.color} ${p.textColor} shadow-lg` : `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ${p.hoverColor}`
                  }`}
                  >
                    <div className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${form.priority === p.value ? 'text-white' : p.textColor}`}>
                    {p.label}
                  </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Kategori */}
            <div  className="space-y-2" ref={categoryRef}>
             <div className="text-sm font-medium text-gray-500">Kategori</div>
                <div className="relative"> 
                    <button
                      onClick={() => setShowCategorySelect(!showCategorySelect)}
                      className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="text-gray-400" size={18} />
                        <span className="text-gray-700 dark:text-gray-200">{form.category || 'Kategori Seçin'}</span>
                      </div>
                      <ChevronDown size={18} className="text-gray-400" />
                    </button>
                    {showCategorySelect && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[60]">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              handleChange('category', cat)
                              setShowCategorySelect(false);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors ${
                              form.category === cat ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            <Folder size={16} />
                            {cat}
                          </button>
                        ))}
                        <div className="px-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex gap-2">
                            <input
                              value={newCategory}
                              onChange={e => setNewCategory(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                              placeholder="Yeni kategori..."
                              className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                            <button onClick={handleAddCategory} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg">
                              <FolderPlus size={20} />
                            </button>
                          </div>
                        </div>
                      </div> 
                    ) }
                </div>
              </div>
            

     

            {/* Tarih & Saat */}
            <div className="text-sm font-medium text-gray-500">Tarih ve Saat</div>
            <div ref={dateRef}>
              <div onClick={() => setShowDatePicker(prev => !prev)} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                <Calendar size={18} /> <span>{formatDateTime(form.date, form.time)}</span>
                {showDatePicker ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {showDatePicker && (
                <div className="mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 z-50 space-y-3">
                  <button onClick={() => handleChange('date', format(new Date(), 'yyyy-MM-dd'))} className="block w-full px-3 py-2 text-left hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded">Bugün</button>
                  <button onClick={() => handleChange('date', format(addDays(new Date(),1),'yyyy-MM-dd'))} className="block w-full px-3 py-2 text-left hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded">Yarın</button>
                  <div className="mt-3"><label className="text-gray-500 dark:text-gray-300">Saat:</label>
                    <input type="time"
                      value={form.time ?? ''}
                      onChange={e => handleChange('time', e.target.value)}
                      className="w-full mt-1 px-2 py-1 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input type="date"
                      value={form.date ??''}
                      onChange={e => handleChange('date',e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Etiketler */}
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">Etiketler</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(form.tags ?? []).map((t, i) => (
                  <div key={i} onClick={() => deleteTag(t)} className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 cursor-pointer">
                    {t} <X size={14} />
                  </div>
                ))}
              </div>
              <div className="relative">
                <input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder="Yeni etiket..."
                  className="pl-3 pr-8 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 text-sm placeholder-gray-400 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
                <button onClick={addTag} className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-orange-500 hover:bg-orange-50 rounded-full">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Kaydet */}
            <button
              onClick={save}
              className="mt-auto bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailModal;