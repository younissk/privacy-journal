

export interface Journal {
  id?: number;
  title: string;
  dateCreated: string;
  content: string;
}

export interface Habit {
  id?: number;
  name: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  icon: string;
  unit?: string;
  goal?: number;
  categoryId?: number;
  currentStreak?: number;
  longestStreak?: number;
  type: "numeric" | "boolean";
  color: string;
}

export interface HabitLog {
  id: number;
  habitId: number;
  date: string;
  numericValue?: number;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}
