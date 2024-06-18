// middlewares/uploadMiddleware.js
const multer = require('multer');
const { uploadFileToFirestore } = require('../services/firestoreService');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFileMiddleware = async (req, res, next) => {
  try {
    if (!req.files) return next();
    req.files = await Promise.all(req.files.map(async file => {
      const url = await uploadFileToFirestore(req.body.userId, file);
      return { ...file, url };
    }));
    next();
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
};

module.exports = { upload, uploadFileMiddleware };
