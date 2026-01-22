
import React from 'react';
import { Category, Task } from '../types';
import Column from './Column';

interface KanbanBoardProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onDeleteTask, onEditTask }) => {
  const categories = [Category.LAVORO, Category.CASA, Category.CORSI, Category.ALLENAMENTO];

  return (
    <div className="flex gap-6 h-full min-h-[500px] overflow-x-auto pb-6">
      {categories.map(cat => (
        <Column 
          key={cat} 
          category={cat} 
          tasks={tasks.filter(t => t.category === cat)} 
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
