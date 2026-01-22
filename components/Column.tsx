
import React from 'react';
import { Category, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  category: Category;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ category, tasks, onDeleteTask, onEditTask }) => {
  // Sort tasks by time and then date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by date first
    if (a.date && b.date) {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
    } else if (a.date) return -1;
    else if (b.date) return 1;

    // Then by time
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const getHeaderStyle = () => {
    switch(category) {
      case Category.LAVORO: return 'border-t-4 border-t-blue-500';
      case Category.CASA: return 'border-t-4 border-t-green-500';
      case Category.CORSI: return 'border-t-4 border-t-purple-500';
      case Category.ALLENAMENTO: return 'border-t-4 border-t-orange-500';
    }
  };

  const getIcon = () => {
    switch(category) {
      case Category.LAVORO: return <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case Category.CASA: return <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case Category.CORSI: return <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      case Category.ALLENAMENTO: return <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    }
  };

  return (
    <div className={`kanban-column bg-slate-200/50 flex flex-col rounded-xl overflow-hidden shadow-sm h-full ${getHeaderStyle()}`}>
      <div className="p-4 bg-white/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h2 className="font-bold text-slate-700 tracking-wide uppercase text-xs">{category}</h2>
        </div>
        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {sortedTasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <TaskCard task={task} onDelete={onDeleteTask} onEdit={onEditTask} />
            {index < sortedTasks.length - 1 && (
              <div className="flex justify-center -my-2 z-10">
                <div className="h-4 w-0.5 bg-slate-300"></div>
              </div>
            )}
          </React.Fragment>
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <p className="text-slate-400 text-sm">Nessun impegno</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
