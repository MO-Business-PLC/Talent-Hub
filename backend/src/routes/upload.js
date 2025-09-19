import express from 'express';
import { uploadResume, handleUploadError } from '../middleware/upload.js';
import { auth } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// POST /upload/resume - Upload resume file
router.post('/resume', auth, uploadResume, handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a resume file to upload'
      });
    }

    // Generate the file URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while uploading the file'
    });
  }
});

// GET /upload/resume/:filename - Download resume file
router.get('/resume/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested resume file does not exist'
      });
    }

    // Send file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          error: 'Download failed',
          message: 'An error occurred while downloading the file'
        });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      error: 'Download failed',
      message: 'An error occurred while downloading the file'
    });
  }
});

// DELETE /upload/resume/:filename - Delete resume file
router.delete('/resume/:filename', auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested resume file does not exist'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: 'Resume file deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'An error occurred while deleting the file'
    });
  }
});

export default router;
