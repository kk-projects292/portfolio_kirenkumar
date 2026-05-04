const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');

// GET - Fetch the latest resume
router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Upload/Create resume (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { filename, url } = req.body;
    
    if (!filename || !url) {
      return res.status(400).json({ message: 'Filename and URL required' });
    }

    // Delete previous resume if exists
    await Resume.deleteMany({});

    const resume = new Resume({
      filename,
      url,
      uploadedAt: new Date(),
      updatedAt: new Date()
    });

    const savedResume = await resume.save();
    res.status(201).json(savedResume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update resume (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { filename, url } = req.body;

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { 
        filename, 
        url,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete resume (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
