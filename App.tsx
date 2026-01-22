
import React, { useState, useEffect, useCallback } from 'react';
import { Category, Task } from './types';
import KanbanBoard from './components/KanbanBoard';
import NewTaskModal from './components/NewTaskModal';
import { optimizeSchedule } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('smart-agenda-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('smart-agenda-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
    setIsModalOpen(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleOptimize = async () => {
    if (tasks.length < 2) {
      alert("Aggiungi almeno due impegni per ricevere un'analisi logistica!");
      return;
    }
    setIsOptimizing(true);
    try {
      const result = await optimizeSchedule(tasks);
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Chronological Route across all categories
  const viewFullRoute = () => {
    const tasksWithLocation = tasks.filter(t => t.location);
    if (tasksWithLocation.length === 0) return;
    
    // Crucial: Sort ALL tasks by date AND time regardless of category to create the journey
    const sorted = [...tasksWithLocation].sort((a, b) => {
      // First by date
      if (a.date && b.date && a.date !== b.date) return a.date.localeCompare(b.date);
      // Then by time
      if (a.time && b.time) return a.time.localeCompare(b.time);
      return 0;
    });

    const locations = sorted.map(t => t.location);
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    
    // Build waypoints for intermediate stops
    let url;
    if (locations.length === 1) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(origin)}`;
    } else {
      const waypoints = locations.slice(1, -1).join('|');
      url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''}&travelmode=driving`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-sm z-20">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Smart-Agenda AI
          </h1>
          <p className="text-sm text-slate-500">Logistica integrata: Casa, Lavoro, Corsi, Allenamento</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={viewFullRoute}
            disabled={tasks.length === 0}
            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
          >
            <img src="https://www.google.com/images/branding/product/2x/maps_96in128dp.png" alt="" className="w-4 h-5" />
            ITINERARIO CRONOLOGICO
          </button>

          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm text-sm"
          >
            {isOptimizing ? (
              <div className="w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
            AI OTTIMIZZA
          </button>
          
          <button 
            onClick={openNewModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 text-sm uppercase"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Nuovo
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-auto p-6 bg-slate-50 relative">
        {aiAnalysis && (
          <div className="mb-6 bg-white border border-blue-200 p-5 rounded-2xl relative shadow-lg animate-in slide-in-from-top-4">
            <button 
              onClick={() => setAiAnalysis(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-xl text-white shadow-blue-200 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">Pianificazione Logistica AI</h3>
                <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  {aiAnalysis}
                </div>
              </div>
            </div>
          </div>
        )}

        <KanbanBoard tasks={tasks} onDeleteTask={deleteTask} onEditTask={openEditModal} />
      </main>

      {/* Modal */}
      {isModalOpen && (
        <NewTaskModal 
          onClose={() => { setIsModalOpen(false); setEditingTask(undefined); }} 
          onSave={editingTask ? updateTask : addTask} 
          editingTask={editingTask}
        />
      )}
    </div>
  );
};

export default App;
