'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Trash2, Plus, Circle, CheckCircle2, Menu } from 'lucide-react';

export default function TodoApp() {
  const { todos, isLoaded, addTodo, deleteTodo, toggleTodo } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue.trim(), 'medium');
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-100">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 py-8 px-4">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-4 shadow-lg">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-white transition-colors hover:opacity-80"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Website todo</h1>
            <div className="w-6" />
          </div>

          {/* 메인 컨텐츠 */}
          <div className="rounded-b-xl bg-white px-6 py-8 shadow-lg">
            {/* 투도 리스트 */}
            <div className="space-y-4 min-h-64">
              {todos.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-center text-gray-400">
                    아직 할 일이 없습니다.
                    <br />
                    아래 버튼으로 첫 작업을 추가해보세요! 🎯
                  </p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="flex-shrink-0 text-gray-400 transition-colors hover:text-purple-500"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-purple-500" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>

                    <div className="flex-grow">
                      <p
                        className={`text-lg transition-all ${
                          todo.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {todo.title}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="relative mt-6 flex justify-center">
            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="새 작업 입력..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-full border-2 border-purple-200 bg-white px-6 py-3 text-gray-700 placeholder-gray-400 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* "+ New task" 버튼 */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAddTodo}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-purple-600 hover:to-purple-700 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              New task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
