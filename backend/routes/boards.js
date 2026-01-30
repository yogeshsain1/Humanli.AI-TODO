const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Todo = require('../models/Todo');
const { authenticateUser } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET all boards for the authenticated user
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.uid })
      .sort({ createdAt: -1 });
    
    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// GET a single board by ID
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// CREATE a new board
router.post('/', async (req, res) => {
  try {
    const { title, description, color } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Board title is required' });
    }

    const board = new Board({
      title: title.trim(),
      description: description?.trim() || '',
      color: color || '#3b82f6',
      userId: req.user.uid
    });

    await board.save();
    res.status(201).json(board);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// UPDATE a board
router.put('/:id', async (req, res) => {
  try {
    const { title, description, color } = req.body;

    const board = await Board.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    if (title !== undefined) board.title = title.trim();
    if (description !== undefined) board.description = description.trim();
    if (color !== undefined) board.color = color;

    await board.save();
    res.json(board);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// DELETE a board and all its todos
router.delete('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Delete all todos associated with this board
    await Todo.deleteMany({ boardId: req.params.id });

    // Delete the board
    await Board.deleteOne({ _id: req.params.id });

    res.json({ message: 'Board and associated todos deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

module.exports = router;
