import { Router } from 'express';
import { handleGetTransactions, handleGetTransaction } from '../controllers/TransactionsController';
import { validateApiKey, validateJWT, checkPermission } from '../middlewares/auth';

const router = Router();

// Support both API key and JWT authentication
router.use((req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return validateJWT(req, res, () => {
      checkPermission('view_transactions')(req, res, next);
    });
  }
  return validateApiKey(req, res, next);
});

router.get('/', handleGetTransactions);
router.get('/:id', handleGetTransaction);

export default router;
