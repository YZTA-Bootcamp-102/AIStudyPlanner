import { useState } from 'react';
import { Pencil, Trash2, Plus, StickyNote, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Note {
  id: number;
  text: string;
  date: string;
}

interface NotesSectionProps {
  initialNotes?: Note[];
}

const NotesSection = ({ initialNotes = [] }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const addNote = () => {
    if (newNote.trim()) {
      const now = new Date();
      setNotes([
        ...notes,
        {
          id: Date.now(),
          text: newNote,
          date: now.toISOString()
        }
      ]);
      setNewNote('');
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditNote = (id: number) => {
    setEditingNoteId(id);
    const note = notes.find(n => n.id === id);
    if (note) {
      setNewNote(note.text);
    }
  };

  const saveEditNote = () => {
    if (editingNoteId && newNote.trim()) {
      setNotes(notes.map(note =>
        note.id === editingNoteId
          ? { ...note, text: newNote }
          : note
      ));
      setEditingNoteId(null);
      setNewNote('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingNoteId) {
        saveEditNote();
      } else {
        addNote();
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-3 shadow-sm">
              <StickyNote size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notlarım
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Önemli notlarını burada sakla
              </p>
            </div>
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20">
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              {notes.length} not
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-5">
          {/* Add Note Input */}
          {!editingNoteId && (
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Yeni not ekle..."
                    className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
                  />
                  <Plus size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-orange-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  Ekle
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {notes.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-3">
                  <StickyNote size={20} className="text-orange-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Henüz not eklenmemiş
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  İlk notunu ekleyerek başla
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="group relative rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-200"
                >
                  {editingNoteId === note.id ? (
                    <div className="p-4">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => {
                            setEditingNoteId(null);
                            setNewNote('');
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          İptal
                        </button>
                        <button
                          onClick={saveEditNote}
                          className="px-3 py-1.5 rounded-lg text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                        >
                          Kaydet
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {note.text}
                      </p>
                      <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent dark:from-gray-600 dark:via-gray-500 my-3"></div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>
                              {format(new Date(note.date), 'd MMMM yyyy', { locale: tr })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>
                              {format(new Date(note.date), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => startEditNote(note.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection; 