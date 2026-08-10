import express from 'express';
import { shorten, resolve } from '../controllers/UrlController.js';

const router = express.Router();

router.post('/api/shorten', shorten);
router.get('/:shortCode', resolve);

export default router;
