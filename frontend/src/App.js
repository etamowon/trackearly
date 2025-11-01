import React, { useState, useEffect } from 'react';
import { Plus, Check, Circle, Trash2, Edit2, X } from 'lucide-react';
import { taskAPI } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
  try {
    setLoading(true);
    const data = await taskAPI.getTasks();
    // Make sure data is an array
    setTasks(Array.isArray(data) ? data : []);
    setError(null);
  } catch (err) {
    setError('Failed to load tasks. Make sure the backend is running.');
    console.error('Error loading tasks:', err);
    setTasks([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};

  const handleAddTask = async (e) => {
  e.preventDefault();
  if (!newTaskTitle.trim()) return;
  
  try {
    const task = await taskAPI.createTask({
      title: newTaskTitle,
      completed: false
    });
    setTasks([task, ...tasks]);
    setNewTaskTitle('');
  } catch (err) {
    console.error('Error creating task:', err);
    alert('Failed to create task');
  }
};

  const toggleComplete = async (id) => {
    try {
      const updatedTask = await taskAPI.toggleTask(id);
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error toggling task:', err);
      alert('Failed to update task');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    
    try {
      const updatedTask = await taskAPI.updateTask(id, { title: editText });
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-normal text-gray-800">TrackEarly</h1>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Circle className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTask(e);
                }
              }}
              placeholder="Add a task"
              className="flex-1 text-base outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              <Plus className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        <div className="px-6 py-2">
          {activeTasks.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activeTasks.map(task => (
                <div
                  key={task._id}
                  className="group flex items-start gap-3 py-3 hover:bg-gray-50 rounded px-3 -mx-3 transition-colors"
                >
                  <button
                    onClick={() => toggleComplete(task._id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
                  </button>
                  
                  {editingId === task._id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task._id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 text-base outline-none border-b-2 border-blue-600 pb-1"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(task._id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span 
                        className="flex-1 text-base text-gray-800 cursor-pointer" 
                        onClick={() => startEdit(task)}
                      >
                        {task.title}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 mt-4">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-2"
            >
              <span className={`transform transition-transform ${showCompleted ? 'rotate-90' : ''}`}>▶</span>
              Completed ({completedTasks.length})
            </button>
            
            {showCompleted && (
              <div className="space-y-1 ml-4">
                {completedTasks.map(task => (
                  <div
                    key={task._id}
                    className="group flex items-start gap-3 py-3 hover:bg-gray-50 rounded px-3 -mx-3 transition-colors"
                  >
                    <button
                      onClick={() => toggleComplete(task._id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      <Check className="w-5 h-5 text-blue-600" />
                    </button>
                    <span className="flex-1 text-base text-gray-500 line-through">
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;