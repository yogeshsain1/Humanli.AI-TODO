import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './BoardCard.css';

const BoardCard = ({ board, onDelete, onClick }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(board._id);
  };

  return (
    <div 
      className="board-card" 
      onClick={onClick}
      style={{ borderLeftColor: board.color }}
    >
      <div className="board-card-header">
        <h3>{board.title}</h3>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          title="Delete board"
        >
          <FaTrash />
        </button>
      </div>
      
      {board.description && (
        <p className="board-description">{board.description}</p>
      )}
      
      <div className="board-footer">
        <span className="board-date">
          {new Date(board.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default BoardCard;
