const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/authMiddleware');

// GET - Fetch all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Fetch single certificate
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Create certificate (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, issuer, filename, imageUrl, issueDate, credentialUrl, description } = req.body;

    if (!title || !issuer || !filename || !imageUrl || !issueDate) {
      return res.status(400).json({ message: 'Title, issuer, filename, imageUrl, and issueDate are required' });
    }

    const certificate = new Certificate({
      title,
      issuer,
      filename,
      imageUrl,
      issueDate,
      credentialUrl: credentialUrl || '',
      description: description || '',
      uploadedAt: new Date(),
      updatedAt: new Date()
    });

    const savedCertificate = await certificate.save();
    res.status(201).json(savedCertificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update certificate (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, issuer, filename, imageUrl, issueDate, credentialUrl, description } = req.body;

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        title,
        issuer,
        filename,
        imageUrl,
        issueDate,
        credentialUrl: credentialUrl || '',
        description: description || '',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete certificate (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
