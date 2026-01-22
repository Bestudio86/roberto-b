
import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`;
  const finalMapsUrl = task.mapsUrl || mapsSearchUrl;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative flex flex-col gap-3">
      {/* Top right actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button 
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Elimina"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      {/* Header Info */}
      <div>
        <h3 className="font-bold text-slate-800 leading-tight mb-2 pr-8">{task.title}</h3>
        <div className="flex flex-wrap gap-1.5">
          {task.date && (
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {new Date(task.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
            </span>
          )}
          {task.time && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {task.time}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 line-clamp-2 italic border-l-2 border-slate-100 pl-2">"{task.description}"</p>
      )}

      {/* Google Maps Details Section */}
      <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 0L10 18.9l-4.95-4.95zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-700 truncate">{task.location}</span>
            {task.mapsDetails && (
              <span className="text-[10px] text-slate-500 leading-tight mt-1 line-clamp-3">
                {task.mapsDetails}
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-1">
          <a 
            href={finalMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 py-2 rounded-md text-[11px] font-bold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
          >
            <img src="https://www.google.com/images/branding/product/2x/maps_96in128dp.png" alt="" className="w-3 h-4" />
            PERCORSO
          </a>
          <button 
            onClick={() => onEdit(task)}
            className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 py-2 rounded-md text-[11px] font-bold hover:bg-slate-100 transition-all uppercase tracking-tight shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            MODIFICA
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
