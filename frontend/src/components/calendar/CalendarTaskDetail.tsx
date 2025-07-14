import { useState, useEffect, useRef } from 'react';
import { X, Edit, Trash2, Plus, Calendar, Clock, Tag, BookOpen, Repeat, MessageCircle, ChevronDown, ChevronUp, Check, Flag, MapPin, Bell, List, MoreVertical, Printer, Briefcase, Folder } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CalendarTask, CategoryType, PriorityType, RepeatType } from '../../types/calendar';

const priorities = [
  { value: 'low', label: 'Düşük', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  { value: 'medium', label: 'Orta', color: 'bg-amber-500', textColor: 'text-amber-500' },
  { value: 'high', label: 'Yüksek', color: 'bg-rose-500', textColor: 'text-rose-500' }
] as const;

const categories = [
  { value: 'work', label: 'İş' },
  { value: 'personal', label: 'Kişisel' },
  { value: 'meeting', label: 'Toplantı' },
  { value: 'event', label: 'Etkinlik' },
  { value: 'other', label: 'Diğer' }
] as const;

const repeatOptions = [
  { value: 'none', label: 'Tekrarlanmıyor', icon: X },
  { value: 'daily', label: 'Her Gün', icon: Calendar },
  { value: 'weekly', label: 'Her Hafta', icon: Calendar },
  { value: 'monthly', label: 'Her Ay', icon: Calendar },
  { value: 'yearly', label: 'Her Yıl', icon: Calendar }
] as const;

interface CalendarTaskDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: CalendarTask | null;
  onSave?: (task: CalendarTask) => void;
}

const CalendarTaskDetail = ({ isOpen, onClose, task, onSave }: CalendarTaskDetailProps) => {
  const [form, setForm] = useState<CalendarTask | null>(task);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setForm(task);
  }, [task]);

  if (!isOpen || !form) return null;

  const handleChange = (field: keyof CalendarTask, value: any) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    onSave?.(newForm);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtasks = [...form.subtasks, { 
        id: Date.now().toString(),
        title: newSubtask,
        completed: false
      }];
      handleChange('subtasks', newSubtasks);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    const newSubtasks = form.subtasks.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    handleChange('subtasks', newSubtasks);
  };

  const handleDeleteSubtask = (id: string) => {
    const newSubtasks = form.subtasks.filter(s => s.id !== id);
    handleChange('subtasks', newSubtasks);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newComments = [...form.comments, {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date().toISOString(),
        userId: 'current-user' // This should come from auth context
      }];
      handleChange('comments', newComments);
      setNewComment('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag)) {
      const newTags = [...form.tags, newTag];
      handleChange('tags', newTags);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    const newTags = form.tags.filter(t => t !== tag);
    handleChange('tags', newTags);
  };

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
                className="font-bold text-2xl bg-transparent hover:bg-white dark:hover:bg-gray-800 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors text-gray-900 dark:text-white"
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
                      onClick={() => handleToggleSubtask(s.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        s.completed
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                      }`}
                    >
                      {s.completed && <Check size={14} />}
                    </button>
                    <input
                      value={s.title}
                      onChange={e => {
                        const newSubtasks = [...form.subtasks];
                        newSubtasks[i] = { ...s, title: e.target.value };
                        handleChange('subtasks', newSubtasks);
                      }}
                      className={`flex-1 bg-transparent focus:outline-none ${
                        s.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'
                      }`}
                    />
                    <button
                      onClick={() => handleDeleteSubtask(s.id)}
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
                        {format(new Date(c.createdAt), 'd MMMM yyyy, HH:mm')}
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
                        handleAddComment();
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
          {/* Priority Section - Read Only */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Öncelik</div>
            <div className="w-full flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
              <Flag className="text-gray-400 dark:text-gray-500" size={18} />
              <span className={`font-medium ${priorities.find(p => p.value === form.priority)?.textColor}`}>
                {priorities.find(p => p.value === form.priority)?.label || 'Düşük'}
              </span>
            </div>
          </div>

          {/* Category Section - Read Only */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</div>
            <div className="w-full flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
              <Folder className="text-gray-400 dark:text-gray-500" size={18} />
              <span className="text-gray-700 dark:text-gray-200">
                {categories.find(cat => cat.value === form.category)?.label || 'Diğer'}
              </span>
            </div>
          </div>

          {/* Date and Time Section - Read Only */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarih ve Saat</div>
            <div className="space-y-2">
              <div className="w-full flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <Calendar className="text-gray-400 dark:text-gray-500" size={18} />
                <span className="text-gray-700 dark:text-gray-200">
                  {format(new Date(form.startTime), 'd MMMM yyyy', { locale: tr })}
                </span>
              </div>
              <div className="w-full flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <Clock className="text-gray-400 dark:text-gray-500" size={18} />
                <span className="text-gray-700 dark:text-gray-200">
                  {format(new Date(form.startTime), 'HH:mm', { locale: tr })} - 
                  {format(new Date(form.endTime), 'HH:mm', { locale: tr })}
                </span>
              </div>
              <div className="w-full flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <Repeat className="text-gray-400 dark:text-gray-500" size={18} />
                <span className="text-gray-700 dark:text-gray-200">
                  {repeatOptions.find(opt => opt.value === form.repeat)?.label || 'Tekrarlanmıyor'}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
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
                  className="pl-3 pr-8 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 hover:border-orange-500 transition-colors"
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

export default CalendarTaskDetail; 