
export enum Category {
  LAVORO = 'Lavoro',
  CASA = 'Casa',
  CORSI = 'Corsi',
  ALLENAMENTO = 'Allenamento'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  category: Category;
  time?: string;
  date?: string;
  mapsUrl?: string;
  mapsDetails?: string;
}

export interface AIOptimization {
  suggestions: string;
  optimizedOrder: string[];
  travelTips: string;
}
