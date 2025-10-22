export type Task = {
  id: string;
  title: string;
  completed: boolean;
  created: number;
};

export type Session = {
  id: string;
  start: number;
  end: number;
  completed: boolean;
};
