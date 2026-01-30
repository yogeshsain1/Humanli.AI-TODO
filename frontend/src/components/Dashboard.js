import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { boardService } from '../services';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModal';
import './Dashboard.css';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async (boardData) => {
    try {
      const newBoard = await boardService.createBoard(boardData);
      setBoards([newBoard, ...boards]);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board and all its todos?')) {
      return;
    }

    try {
      await boardService.deleteBoard(boardId);
      setBoards(boards.filter(board => board._id !== boardId));
    } catch (error) {
      console.error('Error deleting board:', error);
      setError('Failed to delete board');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>My Boards</h1>
          <div className="header-actions">
            <span className="user-email">{currentUser?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading boards...</div>
        ) : (
          <>
            <div className="boards-grid">
              <div className="create-board-card" onClick={() => setShowModal(true)}>
                <div className="create-board-icon">+</div>
                <p>Create New Board</p>
              </div>

              {boards.map(board => (
                <BoardCard
                  key={board._id}
                  board={board}
                  onDelete={handleDeleteBoard}
                  onClick={() => navigate(`/board/${board._id}`)}
                />
              ))}
            </div>

            {boards.length === 0 && (
              <div className="empty-state">
                <h3>No boards yet</h3>
                <p>Create your first board to get started!</p>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <CreateBoardModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </div>
  );
};

export default Dashboard;
