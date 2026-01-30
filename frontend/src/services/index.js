import api from './api';

export const authService = {
  // Register user in backend after Firebase auth
  register: async () => {
    const response = await api.post('/auth/register');
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const boardService = {
  // Get all boards
  getBoards: async () => {
    const response = await api.get('/boards');
    return response.data;
  },

  // Get single board
  getBoard: async (id) => {
    const response = await api.get(`/boards/${id}`);
    return response.data;
  },

  // Create board
  createBoard: async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  // Update board
  updateBoard: async (id, boardData) => {
    const response = await api.put(`/boards/${id}`, boardData);
    return response.data;
  },

  // Delete board
  deleteBoard: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  }
};

export const todoService = {
  // Get todos for a board
  getTodosByBoard: async (boardId) => {
    const response = await api.get(`/todos/board/${boardId}`);
    return response.data;
  },

  // Get single todo
  getTodo: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create todo
  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  // Toggle todo completion
  toggleTodo: async (id) => {
    const response = await api.patch(`/todos/${id}/toggle`);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  }
};
