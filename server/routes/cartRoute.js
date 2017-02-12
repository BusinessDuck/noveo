import express from 'express';
import cartController from '../controllers/cartController';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(cartController.listCart)
  .post(cartController.addProduct);

/**
 * reduce by one product by id
 */
router.route('/:id')
  .delete(cartController.reduceProduct);

