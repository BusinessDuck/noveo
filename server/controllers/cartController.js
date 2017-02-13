import Cart from '../models/cart/cartModel';
import Product from '../models/product/productModel';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

/**
 * List cart items
 * @param req
 * @param res
 * @param next
 */
function listCart(req, res, next) {
  let cart = new Cart(req.session.cart);
  res.sendData(cart);
}

/**
 * Add product to cart
 * @param req
 * @param res
 * @param next
 */
function addProduct(req, res, next) {
  let productId = req.body.id;
  let cart = new Cart(req.session.cart);

  Product.findOne({id: productId}, function (err, product) {
    if (!product) {
      const apiError = new APIError("Product does not exists", httpStatus.NOT_FOUND);
      return next(apiError);

    }
    cart.add(product, product.id);
    req.session.cart = cart.toSessionObject();
    res.sendData(cart.serialize());
  });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function reduceProduct(req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart);
  try {
    cart.reduceByOne(productId);
  } catch (err) {
    const apiError = new APIError(err.message, httpStatus.NOT_FOUND);
    return next(apiError);
  }
  req.session.cart = cart.toSessionObject();
  res.sendData(cart.serialize());
}


export default {
  listCart,
  addProduct,
  reduceProduct
}
