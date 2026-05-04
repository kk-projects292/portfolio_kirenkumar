const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const type = req.query.type;
    
    if (type === 'resume') {
      // Allow PDF for resume
      const pdfMimetype = file.mimetype === 'application/pdf';
      const pdfExtname = path.extname(file.originalname).toLowerCase() === '.pdf';
      
      if (pdfExtname && pdfMimetype) {
        return cb(null, true);
      } else {
        cb('Error: PDF only for resume!');
      }
    } else if (type === 'certificate') {
      // Allow images for certificate
      const filetypes = /jpeg|jpg|png|webp/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb('Error: Images only for certificate!');
      }
    } else {
      // Default: allow images (profile/project)
      const filetypes = /jpeg|jpg|png|webp/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb('Error: Images only!');
      }
    }
  }
});

const fs = require('fs');
const User = require('../models/User');

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    if (req.query.type === 'profile') {
      const user = await User.findById(req.user._id);
      if (user && user.profileImage && user.profileImage.startsWith('/uploads/')) {
        const oldFilename = user.profileImage.split('/').pop();
        const oldPath = path.join(__dirname, '../uploads', oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
