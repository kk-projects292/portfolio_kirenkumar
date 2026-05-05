const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const File = require('../models/File');
const User = require('../models/User');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const type = req.query.type;

    if (type === 'resume') {
      const pdfMimetype = file.mimetype === 'application/pdf';
      const pdfExtname = path.extname(file.originalname).toLowerCase() === '.pdf';
      if (pdfExtname && pdfMimetype) {
        return cb(null, true);
      }
      return cb('Error: PDF only for resume!');
    }

    if (type === 'certificate') {
      const filetypes = /jpeg|jpg|png|webp/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      }
      return cb('Error: Images only for certificate!');
    }

    if (type === 'skill') {
      const filetypes = /svg/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (extname) {
        return cb(null, true);
      }
      return cb('Error: SVG files only for skill icon!');
    }

    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb('Error: Images only!');
  },
  limits: { fileSize: 25 * 1024 * 1024 }
});

const deleteOldFile = async (fileUrl) => {
  if (!fileUrl) return;
  if (fileUrl.startsWith('/api/files/')) {
    const fileId = fileUrl.split('/api/files/')[1];
    if (fileId) {
      await File.findByIdAndDelete(fileId);
    }
  }
};

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.query.type === 'profile') {
      const user = await User.findById(req.user._id);
      if (user && user.profileImage) {
        await deleteOldFile(user.profileImage);
      }
    }

    const fileDoc = new File({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer
    });

    // Ensure SVG files have correct content type
    if (path.extname(req.file.originalname).toLowerCase() === '.svg') {
      fileDoc.contentType = 'image/svg+xml';
    }

    await fileDoc.save();

    const fileUrl = `/api/files/${fileDoc._id}`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', file.contentType);
    res.set('Content-Length', file.size);
    res.send(file.data);
  } catch (err) {
    console.error('File fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
