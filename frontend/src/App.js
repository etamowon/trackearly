import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit2, X, Star, Tag, Search, Calendar, ChevronDown, ChevronUp, ListTree } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';
import { taskAPI } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newTags, setNewTags] = useState('');
  const [newDueDate, setNewDueDate] = useState(''); // NEW: Due date state
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const [expandedTaskId, setExpandedTaskId] = useState(null); // NEW: Subtask drawer state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

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
      setTasks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running.');
      setTasks([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const tagsArray = newTags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '');

    try {
      const task = await taskAPI.createTask({
        title: newTaskTitle,
        priority: newPriority,
        tags: tagsArray,
        dueDate: newDueDate || null,
        completed: false,
        subtasks: []
      });
      setTasks([task, ...tasks]);
      setNewTaskTitle('');
      setNewPriority('medium');
      setNewTags('');
      setNewDueDate('');
      toast.success('Task added!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  // NEW: Subtask Handlers
  const handleAddSubtask = async (e, task) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const updatedSubtasks = [...(task.subtasks || []), { title: newSubtaskTitle, completed: false }];
    
    try {
      const updatedTask = await taskAPI.updateTask(task._id, { subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
      setNewSubtaskTitle('');
    } catch (err) {
      toast.error('Failed to add subtask');
    }
  };

  const toggleSubtask = async (task, subtaskIndex) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;

    try {
      const updatedTask = await taskAPI.updateTask(task._id, { subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
    } catch (err) {
      toast.error('Failed to update subtask');
    }
  };

  const deleteSubtask = async (task, subtaskIndex) => {
    const updatedSubtasks = task.subtasks.filter((_, index) => index !== subtaskIndex);
    try {
      const updatedTask = await taskAPI.updateTask(task._id, { subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
    } catch (err) {
      toast.error('Failed to delete subtask');
    }
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#E8E0FF', '#C8F0FF', '#FFD6F5', '#B8FFF0'] });
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      const updatedTask = await taskAPI.toggleTask(id);
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
      if (!currentStatus) {
        triggerConfetti();
        toast.success('Crushed it!');
      }
    } catch (err) {
      toast.error('Failed to update task');
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
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
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
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const clearVault = async () => {
    const completedList = tasks.filter(t => t.completed);
    if (completedList.length === 0) return;
    try {
      await Promise.all(completedList.map(task => taskAPI.deleteTask(task._id)));
      setTasks(tasks.filter(t => !t.completed));
      toast.success('Vault cleared!');
      setShowCompleted(false);
    } catch (err) {
      toast.error('Failed to clear vault');
    }
  };

  const handleReorder = async (reorderedActiveTasks) => {
    if (searchQuery.trim() !== '') return; 
    setTasks([...reorderedActiveTasks, ...tasks.filter(t => t.completed)]);
    try {
      await Promise.all(reorderedActiveTasks.map((task, index) => taskAPI.updateTask(task._id, { order: index })));
    } catch (err) {
      toast.error('Could not save new layout');
    }
  };

  // HELPER FUNCTIONS
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-[#FFD6F5]/20 text-[#FFD6F5] border-[#FFD6F5]/30';
      case 'low': return 'bg-[#C8F0FF]/20 text-[#C8F0FF] border-[#C8F0FF]/30';
      default: return 'bg-[#E8E0FF]/20 text-[#E8E0FF] border-[#E8E0FF]/30';
    }
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const matchesSearch = (task) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().replace('#', ''); 
    const titleMatch = task.title.toLowerCase().includes(query);
    const tagMatch = task.tags && task.tags.some(tag => tag.toLowerCase().includes(query));
    return titleMatch || tagMatch;
  };

  const rawActiveTasks = tasks.filter(t => !t.completed);
  const rawCompletedTasks = tasks.filter(t => t.completed);
  const progress = tasks.length === 0 ? 0 : Math.round((rawCompletedTasks.length / tasks.length) * 100);

  const activeTasks = rawActiveTasks.filter(matchesSearch);
  const completedTasks = rawCompletedTasks.filter(matchesSearch);
  const isSearching = searchQuery.trim() !== '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#E8E0FF] animate-pulse text-xl font-bold tracking-widest">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 pb-24">
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: { background: 'rgba(26, 16, 40, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#E8E0FF', borderRadius: '9999px' },
          success: { iconTheme: { primary: '#B8FFF0', secondary: '#1A1028' } },
        }}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header & Progress */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8F0FF] via-[#E8E0FF] to-[#FFD6F5] drop-shadow-lg">
            TrackEarly
          </h1>
          
          <div className="glass-panel p-4 flex items-center justify-between">
            <span className="font-medium text-[#E8E0FF]">Daily Progress</span>
            <div className="flex items-center gap-4 flex-1 ml-6">
              <div className="h-3 flex-1 bg-black/30 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#B8FFF0] to-[#C8F0FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold w-10 text-right">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-panel p-1 border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center w-full bg-transparent rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks or #tags..."
              className="w-full bg-transparent border-none px-4 text-[#E8E0FF] placeholder-white/30 focus:outline-none focus:ring-0"
            />
            {isSearching && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-4 h-4 text-white/50" />
              </button>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="glass-panel p-3 flex flex-col gap-3">
          <div className="flex items-center w-full bg-black/20 rounded-full px-4 border border-white/5">
            <Plus className="w-5 h-5 text-[#B8FFF0] opacity-70" />
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask(e)}
              placeholder="What's your next move?"
              className="w-full bg-transparent border-none px-4 py-3 text-[#E8E0FF] placeholder-white/40 focus:outline-none focus:ring-0"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full px-1">
            <div className="flex-1 flex items-center w-full bg-black/20 rounded-full px-4 border border-white/5">
              <Tag className="w-4 h-4 text-white/40" />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask(e)}
                placeholder="Tags (e.g. gym, work)"
                className="w-full bg-transparent border-none px-3 py-2 text-sm text-[#E8E0FF] placeholder-white/30 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Custom Date Input Styling */}
              <div className="relative flex items-center bg-black/30 rounded-full border border-white/10 px-3 py-2 hover:border-[#B8FFF0]/50 transition-colors cursor-pointer">
                <Calendar className="w-4 h-4 text-white/50 mr-2" />
                <input 
                  type="date" 
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="bg-transparent text-sm text-[#E8E0FF] focus:outline-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full cursor-pointer"
                />
              </div>

              <select 
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="bg-black/30 text-[#E8E0FF] border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#B8FFF0]/50 appearance-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
              
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="shimmer-hover flex-1 sm:flex-none bg-gradient-to-r from-[#C8F0FF]/20 to-[#E8E0FF]/20 border border-white/20 px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <Reorder.Group axis="y" values={activeTasks} onReorder={handleReorder} className="space-y-3">
          <AnimatePresence>
            {activeTasks.map(task => (
              <Reorder.Item
                value={task}
                key={task._id}
                dragListener={!isSearching}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`glass-panel p-4 group flex flex-col transition-all hover:border-white/40 ${!isSearching ? 'cursor-grab active:cursor-grabbing' : ''} ${isOverdue(task.dueDate) ? 'border-red-400/50 shadow-[0_0_15px_rgba(248,113,113,0.15)]' : ''}`}
              >
                {/* Main Task Row */}
                <div className="flex items-start gap-4 w-full">
                  <button
                    onClick={() => toggleComplete(task._id, task.completed)}
                    className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-[#B8FFF0] transition-colors"
                  >
                    <motion.div whileTap={{ scale: 0.8 }} className="w-full h-full rounded-full hover:bg-[#B8FFF0]/20" />
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
                        className="flex-1 bg-black/30 text-white px-3 py-1 rounded-lg border border-[#B8FFF0]/50 focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(task._id)} className="p-1 hover:bg-white/10 rounded-lg"><Check className="w-5 h-5 text-[#B8FFF0]" /></button>
                      <button onClick={cancelEdit} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5 text-[#FFD6F5]" /></button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 flex flex-col gap-2 pointer-events-none">
                        <span 
                          className="text-[#E8E0FF] text-lg font-medium pointer-events-auto cursor-pointer" 
                          onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                        >
                          {task.title}
                        </span>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority || 'medium')}`}>
                            {task.priority || 'medium'}
                          </span>
                          
                          {/* NEW: Due Date Badge */}
                          {task.dueDate && (
                            <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${isOverdue(task.dueDate) ? 'bg-red-500/20 text-red-200 border-red-500/30' : 'bg-white/5 text-white/70 border-white/10'}`}>
                              <Calendar className="w-3 h-3" />
                              {formatDate(task.dueDate)}
                            </span>
                          )}

                          {task.tags && task.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full border bg-white/5 text-white/70 border-white/10">#{tag}</span>
                          ))}
                          
                          {/* Subtask indicator badge */}
                          {task.subtasks && task.subtasks.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full border bg-white/5 text-white/70 border-white/10 flex items-center gap-1">
                              <ListTree className="w-3 h-3" />
                              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 transition-opacity">
                        <button 
                          onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)} 
                          className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
                        >
                          {expandedTaskId === task._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button onClick={() => startEdit(task)} className="p-2 hover:bg-white/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4 text-white/70" /></button>
                        <button onClick={() => deleteTask(task._id)} className="p-2 hover:bg-red-500/20 hover:text-[#FFD6F5] rounded-xl transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-white/70" /></button>
                      </div>
                    </>
                  )}
                </div>

                {/* NEW: Subtasks Drawer */}
                <AnimatePresence>
                  {expandedTaskId === task._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full border-t border-white/10 pt-4 cursor-default pl-10"
                    >
                      <div className="space-y-2">
                        {task.subtasks && task.subtasks.map((subtask, index) => (
                          <div key={index} className="flex items-center gap-3 group/sub">
                            <button onClick={() => toggleSubtask(task, index)} className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${subtask.completed ? 'bg-[#B8FFF0]/50 border-[#B8FFF0]/50' : 'border-white/30 hover:border-[#B8FFF0]'}`}>
                              {subtask.completed && <Check className="w-3 h-3 text-black" />}
                            </button>
                            <span className={`flex-1 text-sm ${subtask.completed ? 'text-white/40 line-through' : 'text-white/80'}`}>{subtask.title}</span>
                            <button onClick={() => deleteSubtask(task, index)} className="opacity-0 group-hover/sub:opacity-100 p-1 hover:bg-red-500/20 rounded-md transition-colors">
                              <Trash2 className="w-3 h-3 text-white/40 hover:text-red-300" />
                            </button>
                          </div>
                        ))}
                        
                        <div className="flex items-center gap-3 pt-1">
                          <Plus className="w-4 h-4 text-white/30" />
                          <input
                            type="text"
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(e, task)}
                            placeholder="Add a step..."
                            className="bg-transparent border-none text-sm text-[#E8E0FF] placeholder-white/30 focus:outline-none flex-1"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {/* Completed Tasks (Unchanged) */}
        {completedTasks.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setShowCompleted(!showCompleted)} className="text-white/60 hover:text-white flex items-center gap-2 font-medium transition-colors">
                <span className={`transform transition-transform ${showCompleted ? 'rotate-90' : ''}`}>▶</span> Vault ({completedTasks.length})
              </button>
              {showCompleted && (
                <button onClick={clearVault} className="text-xs px-3 py-1.5 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-full transition-colors border border-red-500/20 shadow-lg">
                  Clear Vault
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {showCompleted && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                  {completedTasks.map(task => (
                    <div key={task._id} className="glass-panel opacity-50 p-3 flex items-center gap-4">
                      <button onClick={() => toggleComplete(task._id, task.completed)} className="w-5 h-5 rounded-full bg-[#B8FFF0]/50 flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </button>
                      <span className="flex-1 text-white/60 line-through decoration-white/30">{task.title}</span>
                      <button onClick={() => deleteTask(task._id)} className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"><Trash2 className="w-4 h-4 text-white/70" /></button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;