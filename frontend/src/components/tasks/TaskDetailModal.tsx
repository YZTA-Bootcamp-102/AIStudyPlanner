import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Edit, Trash2, Plus, Calendar, Clock, Tag, BookOpen, Repeat, MessageCircle, ChevronDown, ChevronUp, Check, Flag, MapPin, Bell, List, MoreVertical, Printer, Briefcase, FolderPlus, Folder } from 'lucide-react';
import { ReactRRuleWidget } from 'react-rrule-widget';
import { format, addDays, nextSaturday, nextMonday, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const initialCategories = ['Ders', 'Sınav', 'Proje', 'Ödev', 'Laboratuvar', 'Dil', 'Okuma'];
const priorities = [
  { value: 'low', label: 'Düşük', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30', textColor: 'text-emerald-500' },
  { value: 'medium', label: 'Orta', color: 'bg-amber-500', hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/30', textColor: 'text-amber-500' },
  { value: 'high', label: 'Yüksek', color: 'bg-rose-500', hoverColor: 'hover:bg-rose-100 dark:hover:bg-rose-900/30', textColor: 'text-rose-500' }
];

const repeatOptions = [
  { value: 'none', label: 'Tekrarlanmıyor', icon: X },
  { value: 'daily', label: 'Her Gün', icon: Calendar },
  { value: 'weekly', label: 'Her Hafta', icon: Calendar },
  { value: 'weekdays', label: 'Hafta İçi', icon: Calendar },
  { value: 'monthly', label: 'Her Ay', icon: Calendar }
];

interface Subtask {
  text: string;
  done: boolean;
}

interface Comment {
  text: string;
  date: string;
}

export interface TaskDetailType {
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  time: string;
  repeat: string;
  customRepeat: string;
  subtasks: Subtask[];
  comments: Comment[];
  priority: string;
  lesson?: string;
}

const initialTask: TaskDetailType = {
  title: '',
  description: '',
  category: '',
  tags: [],
  date: '',
  time: '',
  repeat: 'none',
  customRepeat: '',
  subtasks: [],
  comments: [],
  priority: 'medium'
};

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskDetailType;
  onSave: (task: TaskDetailType, shouldClose?: boolean) => void;
  onDelete: () => void;
}

const TaskDetailModal = ({ isOpen, onClose, task = initialTask, onSave, onDelete }: TaskDetailModalProps) => {
  const [form, setForm] = useState<TaskDetailType>({ ...task });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  
  const categorySelectRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const debouncedSave = useCallback((newForm: TaskDetailType, shouldClose: boolean = false) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSave(newForm, shouldClose);
    }, 500);
  }, [onSave]);

  useEffect(() => {
    setForm({ ...task });
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target as Node)) {
        setShowCategorySelect(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
        setShowRepeatOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleChange = (field: keyof TaskDetailType, value: any) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    debouncedSave(newForm, false);
  };

  const handleAddSubtask = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (newSubtask.trim()) {
      const newForm = {
        ...form,
        subtasks: [...(form.subtasks || []), { text: newSubtask, done: false }]
      };
      setForm(newForm);
      debouncedSave(newForm, false);
      setNewSubtask('');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      handleChange('category', newCategory);
      setNewCategory('');
      setShowCategorySelect(false);
    }
  };

  const handleToggleSubtask = (idx: number) => {
    const newForm = {
      ...form,
      subtasks: form.subtasks.map((s, i) => i === idx ? { ...s, done: !s.done } : s)
    };
    setForm(newForm);
    debouncedSave(newForm, false);
  };

  const handleDeleteSubtask = (idx: number) => {
    const newForm = {
      ...form,
      subtasks: form.subtasks.filter((_, i) => i !== idx)
    };
    setForm(newForm);
    debouncedSave(newForm, false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newForm = {
        ...form,
        comments: [...(form.comments || []), { text: newComment, date: new Date().toISOString() }]
      };
      setForm(newForm);
      debouncedSave(newForm, false);
      setNewComment('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag)) {
      const newForm = {
        ...form,
        tags: [...(form.tags || []), newTag]
      };
      setForm(newForm);
      debouncedSave(newForm, false);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    const newForm = {
      ...form,
      tags: form.tags.filter(t => t !== tag)
    };
    setForm(newForm);
    debouncedSave(newForm, false);
  };

  const handleSave = () => {
    debouncedSave(form, true);
    setShowRepeatOptions(false);
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date) return 'Tarih Seçilmedi';
    const dateObj = parseISO(date);
    const formattedDate = format(dateObj, 'd MMMM yyyy', { locale: tr });
    return `${formattedDate}${time ? `, ${time}` : ''}`;
  };

  const handleCategorySelect = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleChange('category', category);
  };

  const handlePrioritySelect = (priority: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleChange('priority', priority);
  };

  const handleDateSelect = (date: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleChange('date', date);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-0 relative animate-fade-in flex flex-col md:flex-row" style={{ height: 'fit-content' }} onClick={e => e.stopPropagation()}>
        {/* Left panel content */}
        <div className="flex-1 p-0 relative rounded-l-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-medium">
                {form.title?.[0]?.toUpperCase() || 'T'}
              </div>
              <input
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                className="font-bold text-2xl bg-transparent hover:bg-white dark:hover:bg-gray-800 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors"
                placeholder="Başlık"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <MoreVertical size={22} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            {showMenu && (
              <div className="absolute right-16 top-16 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 size={18} />
                  <span>Görevi Sil</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Printer size={18} />
                  <span>Yazdır</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Description */}
            <div className="group relative mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-gray-500 font-medium mb-2">
                <BookOpen size={18} /> Açıklama
              </div>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors min-h-[100px] resize-none"
                placeholder="Açıklama"
                rows={Math.min(4, (form.description?.split('\n').length || 1))}
              />
              <Edit size={16} className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Subtasks */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-gray-500 font-medium mb-4">
                <List size={18} /> Alt görevler
              </div>
              <div className="space-y-2">
                {form.subtasks.map((s, i) => (
                  <div key={i} className="group flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 hover:border-orange-500/50 transition-colors">
                    <button
                      onClick={() => handleToggleSubtask(i)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        s.done
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                      }`}
                    >
                      {s.done && <Check size={14} />}
                    </button>
                    <input
                      value={s.text}
                      onChange={e => {
                        const newSubtasks = [...form.subtasks];
                        newSubtasks[i] = { ...s, text: e.target.value };
                        handleChange('subtasks', newSubtasks);
                      }}
                      className={`flex-1 bg-transparent focus:outline-none ${
                        s.done ? 'line-through text-gray-400' : ''
                      }`}
                    />
                    <button
                      onClick={() => handleDeleteSubtask(i)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="relative">
                  <input
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    placeholder="Yeni alt görev ekle..."
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-gray-500 font-medium mb-4">
                <MessageCircle size={18} /> Notlar
              </div>
              <div className="space-y-4">
                {form.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 group">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-medium">
                      {form.title?.[0]?.toUpperCase() || 'N'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={c.text}
                        onChange={e => {
                          const newComments = [...form.comments];
                          newComments[i] = { ...c, text: e.target.value };
                          handleChange('comments', newComments);
                        }}
                        className="w-full bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 min-h-[60px] resize-y"
                        rows={Math.min(5, (c.text?.split('\n').length || 1))}
                      />
                      <div className="text-sm text-gray-400 mt-1">
                        {format(new Date(c.date), 'd MMMM yyyy, HH:mm')}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newComments = form.comments.filter((_, index) => index !== i);
                        handleChange('comments', newComments);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
                        e.preventDefault();
                        const newComments = [
                          ...form.comments,
                          { text: newComment, date: new Date().toISOString() }
                        ];
                        handleChange('comments', newComments);
                        setNewComment('');
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[60px] resize-y"
                    placeholder="Not ekle..."
                    rows={Math.min(5, (newComment?.split('\n').length || 1))}
                  />
                  <div className="absolute left-2 top-4 p-2 text-orange-500">
                    <MessageCircle size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-100 dark:border-gray-700 p-8 relative flex flex-col gap-6 rounded-r-2xl">
          {/* Priority Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Öncelik</div>
            <div className="flex justify-between gap-2">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  onClick={(e) => handlePrioritySelect(priority.value, e)}
                  className={`relative group flex-1 h-12 rounded-xl transition-all ${
                    form.priority === priority.value
                      ? `${priority.color} shadow-lg`
                      : `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-${priority.color.split('-')[1]}-500 ${priority.hoverColor}`
                  }`}
                >
                  <div className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${
                    form.priority === priority.value
                      ? 'text-white'
                      : priority.textColor
                  }`}>
                    {priority.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div className="space-y-2" ref={categorySelectRef}>
            <div className="text-sm font-medium text-gray-500">Kategori</div>
            <div className="relative">
              <button
                onClick={() => setShowCategorySelect(!showCategorySelect)}
                className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Folder className="text-gray-400" size={18} />
                  <span className="text-gray-700 dark:text-gray-200">
                    {form.category || 'Kategori Seçin'}
                  </span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showCategorySelect && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[60]">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={(e) => handleCategorySelect(category, e)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors ${
                        form.category === category
                          ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/30'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <Folder size={16} />
                      {category}
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
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddCategory();
                        }}
                        className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                      >
                        <FolderPlus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="space-y-2" ref={datePickerRef}>
            <div className="text-sm font-medium text-gray-500">Tarih ve Saat</div>
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={18} />
                  <span className="text-gray-700 dark:text-gray-200">
                    {formatDateTime(form.date, form.time)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {form.repeat !== 'none' && (
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-900/30 rounded-full px-2 py-0.5 text-xs">
                      <Repeat size={12} />
                      {repeatOptions.find(opt => opt.value === form.repeat)?.label}
                    </div>
                  )}
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </button>
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[60]">
                  <div className="space-y-4">
                    {/* Date and Time Inputs */}
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={form.date}
                        onChange={e => handleChange('date', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                      <input
                        type="time"
                        value={form.time}
                        onChange={e => handleChange('time', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>

                    {/* Quick Date Options */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleDateSelect(format(new Date(), 'yyyy-MM-dd'), e)}
                        className="px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                      >
                        Bugün
                      </button>
                      <button
                        onClick={(e) => handleDateSelect(format(addDays(new Date(), 1), 'yyyy-MM-dd'), e)}
                        className="px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                      >
                        Yarın
                      </button>
                    </div>

                    {/* Repeat Options */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Tekrar</span>
                        <button
                          onClick={() => setShowRepeatOptions(!showRepeatOptions)}
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          {showRepeatOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      {showRepeatOptions && (
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              handleChange('repeat', 'none');
                              setShowRepeatOptions(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              form.repeat === 'none'
                                ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            } transition-colors`}
                          >
                            <X size={16} />
                            Tekrarlanmıyor
                          </button>
                          <button
                            onClick={() => {
                              handleChange('repeat', 'daily');
                              setShowRepeatOptions(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              form.repeat === 'daily'
                                ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            } transition-colors`}
                          >
                            <Calendar size={16} />
                            Her Gün
                          </button>
                          <button
                            onClick={() => {
                              handleChange('repeat', 'weekly');
                              setShowRepeatOptions(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              form.repeat === 'weekly'
                                ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            } transition-colors`}
                          >
                            <Calendar size={16} />
                            Her Hafta
                          </button>
                          <button
                            onClick={() => {
                              handleChange('repeat', 'weekdays');
                              setShowRepeatOptions(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              form.repeat === 'weekdays'
                                ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            } transition-colors`}
                          >
                            <Calendar size={16} />
                            Hafta İçi
                          </button>
                          <button
                            onClick={() => {
                              handleChange('repeat', 'monthly');
                              setShowRepeatOptions(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              form.repeat === 'monthly'
                                ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
                            } transition-colors`}
                          >
                            <Calendar size={16} />
                            Her Ay
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Repeat Options */}
          {form.repeat === 'custom' && showRepeatOptions && (
            <div className="mt-4 space-y-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Her</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={form.customRepeat.split(' ')[0] || '1'}
                    onChange={e => handleChange('customRepeat', `${e.target.value} ${form.customRepeat.split(' ')[1] || 'gün'}`)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Birim</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={form.customRepeat.split(' ')[1] || 'gün'}
                    onChange={e => handleChange('customRepeat', `${form.customRepeat.split(' ')[0] || '1'} ${e.target.value}`)}
                  >
                    <option value="gün">Gün</option>
                    <option value="hafta">Hafta</option>
                    <option value="ay">Ay</option>
                    <option value="yıl">Yıl</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Etiketler</div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <div
                  key={tag}
                  className="group flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full pl-3 pr-2 py-1.5 transition-colors"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    onClick={() => handleDeleteTag(tag)}
                    className="opacity-60 group-hover:opacity-100 hover:text-red-500 p-1 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="relative">
                <input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                  placeholder="Yeni etiket..."
                  className="pl-3 pr-8 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 hover:border-orange-500 transition-colors"
                />
                <button
                  onClick={handleAddTag}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

   
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal; 