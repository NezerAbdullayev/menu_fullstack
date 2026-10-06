import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, me } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/schemas.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Çox cəhd edildi, 15 dəqiqə sonra yenidən yoxlayın' },
});

router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/me', requireAdmin, me);

export default router;
