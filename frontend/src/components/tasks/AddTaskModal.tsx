import { useState } from 'react';
import { Plus, X, Calendar, Clock, Tag, BookOpen, List, MessageCircle, ChevronDown, Check, Flag, Folder, FolderPlus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const initialCategories = ['Ders', 'Sınav', 'Proje', 'Ödev', 'Laboratuvar', 'Dil', 'Okuma'];
const priorities = [
  { value: 'low', label: 'Düşük', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30', textColor: 'text-emerald-500' },
  { value: 'medium', label: 'Orta', color: 'bg-amber-500', hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/30', textColor: 'text-amber-500' },
  { value: 'high', label: 'Yüksek', color: 'bg-rose-500', hoverColor: 'hover:bg-rose-100 dark:hover:bg-rose-900/30', textColor: 'text-rose-500' }
];

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: any) => void;
}

const AddTaskModal = ({ isOpen, onClose, onAdd }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState<{ text: string; done: boolean }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [comments, setComments] = useState<{ text: string; date: string }[]>([]);
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title,
      description,
      time,
      priority,
      category,
      dueDate: date,
      tags,
      subtasks,
      comments,
      completed: false
    });
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

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { text: newSubtask, done: false }]);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (idx: number) => {
    setSubtasks(subtasks.map((s, i) => i === idx ? { ...s, done: !s.done } : s));
  };

  const handleDeleteSubtask = (idx: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, date: new Date().toISOString() }]);
      setNewComment('');
    }
  };

  const formatDateTime = (date: string, time: string) => {
    if (!date) return 'Tarih Seçilmedi';
    const dateObj = new Date(date);
    const formattedDate = format(dateObj, 'd MMMM yyyy', { locale: tr });
    return `${formattedDate}${time ? `, ${time}` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl p-0 relative animate-fade-in flex flex-col md:flex-row" style={{ height: 'fit-content' }} onClick={e => e.stopPropagation()}>
        {/* Left panel content */}
        <div className="flex-1 p-0 relative rounded-l-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-medium">
                {title?.[0]?.toUpperCase() || 'Y'}
              </div>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="font-bold text-2xl bg-transparent hover:bg-white dark:hover:bg-gray-800 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors"
                placeholder="Yeni Görev"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Description */}
            <div className="group relative mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-gray-500 font-medium mb-2">
                <BookOpen size={18} /> Açıklama
              </div>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors min-h-[100px] resize-none"
                placeholder="Açıklama"
                rows={Math.min(4, (description?.split('\n').length || 1))}
              />
            </div>

            {/* Subtasks */}
            <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-2 text-gray-500 font-medium mb-4">
                <List size={18} /> Alt görevler
              </div>
              <div className="space-y-2">
                {subtasks.map((s, i) => (
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
                        const newSubtasks = [...subtasks];
                        newSubtasks[i] = { ...s, text: e.target.value };
                        setSubtasks(newSubtasks);
                      }}
                      className={`flex-1 bg-transparent focus:outline-none ${
                        s.done ? 'line-through text-gray-400' : ''
                      }`}
                    />
                    <button
                      onClick={() => handleDeleteSubtask(i)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
                    >
                      <X size={16} />
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
                {comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 group">
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-medium">
                      {title?.[0]?.toUpperCase() || 'N'}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={c.text}
                        onChange={e => {
                          const newComments = [...comments];
                          newComments[i] = { ...c, text: e.target.value };
                          setComments(newComments);
                        }}
                        className="w-full bg-transparent focus:outline-none text-gray-700 dark:text-gray-200 min-h-[60px] resize-y"
                        rows={Math.min(5, (c.text?.split('\n').length || 1))}
                      />
                      <div className="text-sm text-gray-400 mt-1">
                        {format(new Date(c.date), 'd MMMM yyyy, HH:mm', { locale: tr })}
                      </div>
                    </div>
                    <button
                      onClick={() => setComments(comments.filter((_, index) => index !== i))}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
                    >
                      <X size={16} />
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
          {/* Priority Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Öncelik</div>
            <div className="flex justify-between gap-2">
              {priorities.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`relative group flex-1 h-12 rounded-xl transition-all ${
                    priority === p.value
                      ? `${p.color} shadow-lg`
                      : `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-${p.color.split('-')[1]}-500 ${p.hoverColor}`
                  }`}
                >
                  <div className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${
                    priority === p.value
                      ? 'text-white'
                      : p.textColor
                  }`}>
                    {p.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Kategori</div>
            <div className="relative">
              <button
                onClick={() => setShowCategorySelect(!showCategorySelect)}
                className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Folder className="text-gray-400" size={18} />
                  <span className="text-gray-700 dark:text-gray-200">
                    {category || 'Kategori Seçin'}
                  </span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
              {showCategorySelect && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[60]">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategorySelect(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors ${
                        category === cat
                          ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/30'
                          : 'text-gray-700 dark:text-gray-200'
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
                      <button
                        onClick={handleAddCategory}
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
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Tarih ve Saat</div>
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={18} />
                  <span className="text-gray-700 dark:text-gray-200">
                    {formatDateTime(date, time)}
                  </span>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
        </button>
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[60]">
        <div className="space-y-4">
                    {/* Date and Time Inputs */}
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                      <input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>

                    {/* Quick Date Options */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setDate(format(new Date(), 'yyyy-MM-dd'));
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                      >
                        Bugün
                      </button>
                      <button
                        onClick={() => {
                          setDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
                          setShowDatePicker(false);
                        }}
                        className="px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                      >
                        Yarın
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Etiketler</div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
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

          {/* Submit Button */}
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Görevi Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal; 