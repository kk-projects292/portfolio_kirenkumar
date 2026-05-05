require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const path = require('path');
const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));

const File = require('./models/File');

app.get('/api/files/:id', async (req, res) => {
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

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
