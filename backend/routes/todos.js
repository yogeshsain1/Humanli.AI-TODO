const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const Board = require('../models/Board');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET all todos for a specific board
router.get('/board/:boardId', async (req, res) => {
  try {
    // Verify the board belongs to the user
    const board = await Board.findOne({ 
      _id: req.params.boardId, 
      userId: req.user.uid 
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const todos = await Todo.find({ boardId: req.params.boardId })
      .sort({ createdAt: -1 });
    
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET a single todo by ID
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// CREATE a new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, boardId, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Todo title is required' });
    }

    if (!boardId) {
      return res.status(400).json({ error: 'Board ID is required' });
    }

    // Verify the board exists and belongs to the user
    const board = await Board.findOne({ 
      _id: boardId, 
      userId: req.user.uid 
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      boardId,
      userId: req.user.uid,
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// UPDATE a todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// TOGGLE todo completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    await todo.save();
    
    res.json(todo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
