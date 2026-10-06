import { Router } from 'express';
import { listCategories, categoryItems, fullMenu } from '../controllers/publicController.js';

const router = Router();

router.get('/menu', fullMenu);
router.get('/categories', listCategories);
router.get('/categories/:slug/items', categoryItems);

export default router;
