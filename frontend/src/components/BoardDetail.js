import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { boardService, todoService } from '../services';
import TodoItem from './TodoItem';
import CreateTodoModal from './CreateTodoModal';
import EditTodoModal from './EditTodoModal';
import './BoardDetail.css';

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  const fetchBoardAndTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [boardData, todosData] = await Promise.all([
        boardService.getBoard(boardId),
        todoService.getTodosByBoard(boardId)
      ]);
      setBoard(boardData);
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoardAndTodos();
  }, [fetchBoardAndTodos]);

  const handleCreateTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo({ ...todoData, boardId });
      setTodos([newTodo, ...todos]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const handleUpdateTodo = async (todoId, todoData) => {
    try {
      const updatedTodo = await todoService.updateTodo(todoId, todoData);
      setTodos(todos.map(t => t._id === todoId ? updatedTodo : t));
      setEditingTodo(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const updatedTodo = await todoService.toggleTodo(todoId);
      setTodos(todos.map(t => t._id === todoId ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoService.deleteTodo(todoId);
      setTodos(todos.filter(t => t._id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return <div className="loading">Loading board...</div>;
  }

  if (!board) {
    return <div className="error">Board not found</div>;
  }

  return (
    <div className="board-detail">
      <header className="board-header" style={{ borderBottomColor: board.color }}>
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> Back
          </button>
          <div>
            <h1>{board.title}</h1>
            {board.description && <p className="board-desc">{board.description}</p>}
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Add Todo
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="board-content">
        <div className="board-stats">
          <div className="stat">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalCount - completedCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Active ({totalCount - completedCount})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>No todos {filter !== 'all' ? filter : ''} yet</p>
              {filter === 'all' && (
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                  Create your first todo
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={setEditingTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateTodoModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTodo}
        />
      )}

      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onUpdate={handleUpdateTodo}
        />
      )}
    </div>
  );
};

export default BoardDetail;
