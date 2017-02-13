import express from 'express';
import productRoutes from './productRoute';
import cartRoutes from './cartRoute';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/products', productRoutes);
router.use('/cart', cartRoutes);

export default router;
