import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Calendar } from 'lucide-react';

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (calendarData: {
    summary: string;
    description: string;
    start_time: string; // ISO string
    end_time: string;   // ISO string
  }) => void;
}

const AddToCalendarModal: React.FC<AddToCalendarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Modal açılınca inputları temizle
  useEffect(() => {
    if (isOpen) {
      setSummary('');
      setDescription('');
      setStartTime('');
      setEndTime('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!summary.trim()) {
      alert('Etkinlik başlığı zorunludur.');
      return;
    }
    if (!startTime || !endTime) {
      alert('Başlangıç ve bitiş zamanı giriniz.');
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      alert('Bitiş zamanı, başlangıç zamanından sonra olmalıdır.');
      return;
    }

    onSubmit({
      summary,
      description,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
    });

    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen bg-black/30 p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Takvime Ekle
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Etkinlik Başlığı
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full mt-1 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Etkinlik başlığını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Etkinlik açıklaması"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Başlangıç Zamanı
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bitiş Zamanı
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddToCalendarModal;
