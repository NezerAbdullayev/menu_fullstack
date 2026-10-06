import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { categorySchema, menuItemSchema, reorderSchema } from '../validators/schemas.js';
import * as categories from '../controllers/categoryController.js';
import * as items from '../controllers/itemController.js';
import { reorder, uploadImage, stats } from '../controllers/adminController.js';

const router = Router();
router.use(requireAdmin);

router.get('/stats', stats);

router.get('/categories', categories.list);
router.get('/categories/:id', categories.getOne);
router.post('/categories', validate(categorySchema), categories.create);
router.put('/categories/:id', validate(categorySchema), categories.update);
router.delete('/categories/:id', categories.remove);

router.get('/items', items.list);
router.get('/items/:id', items.getOne);
router.post('/items', validate(menuItemSchema), items.create);
router.put('/items/:id', validate(menuItemSchema), items.update);
router.delete('/items/:id', items.remove);

router.patch('/reorder', validate(reorderSchema), reorder);
router.post('/upload', upload.single('image'), uploadImage);

export default router;
