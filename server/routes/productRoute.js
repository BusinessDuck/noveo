import express from 'express';
import validate from 'express-validation';
import productValidator from '../models/product/productValidator';
import productContoller from '../controllers/productController';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
/** GET /api/products - Get list of products */
  .get(productContoller.list)

  /** POST /api/products - Create new product */
  .post(validate(productValidator.createProduct), productContoller.create);

router.route('/:productId')
/** GET /api/products/:productId - Get product */
  .get(productContoller.get)

  /** PUT /api/products/:productId - Update product */
  .put(validate(productValidator.updateProduct), productContoller.update)

  /** DELETE /api/products/:productId - Delete product */
  .delete(productContoller.remove);

/** Load product when API with productId route parameter is hit */
router.param('productId', productContoller.load);

export default router;

