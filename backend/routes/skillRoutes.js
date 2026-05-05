const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/authMiddleware');

// GET - Fetch all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Fetch single skill
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create skill (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { name, category, proficiency, icon, logoUrl, color, order } = req.body;

    if (!name || !category || !proficiency) {
      return res.status(400).json({ message: 'Name, category, and proficiency are required' });
    }

    const skill = new Skill({
      name,
      category,
      proficiency,
      icon: icon || '',
      logoUrl: logoUrl || '',
      color: color || '#6366f1',
      order: order || 0
    });

    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update skill (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, category, proficiency, icon, logoUrl, color, order } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        proficiency,
        icon: icon || '',
        logoUrl: logoUrl || '',
        color: color || '#6366f1',
        order: order || 0,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete skill (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
