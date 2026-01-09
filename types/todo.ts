// 투도 타입 정의
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}
