'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { supabase } from '@/lib/supabase';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Supabase에서 투도 로드
  useEffect(() => {
    loadTodos();
    subscribeToTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos: Todo[] = (data || []).map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        createdAt: new Date(todo.created_at),
        dueDate: todo.due_date ? new Date(todo.due_date) : undefined,
        category: todo.category,
        priority: todo.priority,
      }));

      setTodos(formattedTodos);
      setIsLoaded(true);
    } catch (error) {
      console.error('투도 로드 실패:', error);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 실시간 구독 설정
  const subscribeToTodos = () => {
    const subscription = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => {
          loadTodos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // 투도 추가
  const addTodo = async (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('todos')
        .insert([
          {
            title,
            completed: false,
            priority,
          },
        ])
        .select();

      if (error) throw error;
      await loadTodos();
    } catch (error) {
      console.error('투도 추가 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 투도 삭제
  const deleteTodo = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTodos();
    } catch (error) {
      console.error('투도 삭제 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 투도 완료 토글
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      setIsLoading(true);
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;
      await loadTodos();
    } catch (error) {
      console.error('투도 수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 투도 수정
  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    try {
      setIsLoading(true);
      const updateData: any = { ...updates };

      // Date 객체를 ISO 문자열로 변환
      if (updateData.dueDate) {
        updateData.due_date = updateData.dueDate.toISOString();
        delete updateData.dueDate;
      }

      const { error } = await supabase
        .from('todos')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await loadTodos();
    } catch (error) {
      console.error('투도 수정 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 투도 일괄 삭제 (완료된 투도)
  const clearCompleted = async () => {
    try {
      setIsLoading(true);
      const completedIds = todos.filter(todo => todo.completed).map(todo => todo.id);

      if (completedIds.length === 0) return;

      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', completedIds);

      if (error) throw error;
      await loadTodos();
    } catch (error) {
      console.error('완료된 투도 삭제 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    todos,
    isLoaded,
    isLoading,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
  };
}
