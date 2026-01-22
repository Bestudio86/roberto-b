
import React, { useState, useEffect } from 'react';
import { Category, Task } from '../types';
import { getMapsInfo } from '../services/geminiService';

interface NewTaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  editingTask?: Task;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, onSave, editingTask }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: Category.LAVORO,
    time: '',
    date: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        location: editingTask.location,
        category: editingTask.category,
        time: editingTask.time || '',
        date: editingTask.date || ''
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) return;

    setLoading(true);
    
    let userLoc: { lat: number, lng: number } | undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      console.log("Geolocation not available");
    }

    let mapsUrl = editingTask?.mapsUrl;
    let mapsDetails = editingTask?.mapsDetails;

    // Fetch fresh info if location changed or new task
    if (!editingTask || formData.location !== editingTask.location) {
      const mapsInfo = await getMapsInfo(formData.location, userLoc);
      mapsUrl = mapsInfo.mapsUrl;
      mapsDetails = mapsInfo.text;
    }

    const task: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      time: formData.time,
      date: formData.date,
      mapsUrl: mapsUrl,
      mapsDetails: mapsDetails
    };

    onSave(task);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">{editingTask ? 'Modifica Impegno' : 'Nuovo Impegno'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titolo</label>
            <input 
              required
              type="text" 
              placeholder="Cosa devi fare?"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data</label>
              <input 
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Orario</label>
            <input 
              type="time"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Indirizzo / Luogo</label>
            <input 
              required
              type="text" 
              placeholder="Indirizzo o nome del locale"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrizione</label>
            <textarea 
              rows={3}
              placeholder="Note extra..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              editingTask ? 'Aggiorna Impegno' : 'Salva Impegno'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
