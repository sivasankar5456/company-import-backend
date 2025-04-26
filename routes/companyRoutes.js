import express from 'express';
import upload from '../middleware/upload.js';
import { uploadCompanies } from '../controller/companyController.js';

const router = express.Router();
router.post('/upload', upload.single('file'), uploadCompanies);
export default router;
