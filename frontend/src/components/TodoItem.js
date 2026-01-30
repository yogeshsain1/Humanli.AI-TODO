import React from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-checkbox" onClick={() => onToggle(todo._id)}>
        {todo.completed && <FaCheck />}
      </div>

      <div className="todo-content">
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        <div className="todo-meta">
          <span className={`todo-priority ${getPriorityClass(todo.priority)}`}>
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className="todo-due-date">
              Due: {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button 
          className="todo-action-btn edit" 
          onClick={() => onEdit(todo)}
          title="Edit todo"
        >
          <FaEdit />
        </button>
        <button 
          className="todo-action-btn delete" 
          onClick={() => onDelete(todo._id)}
          title="Delete todo"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
