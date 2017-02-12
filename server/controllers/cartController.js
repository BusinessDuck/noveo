import Cart from '../models/cart/cartModel';
import Product from '../models/product/productModel';

/**
 * List cart items
 * @param req
 * @param res
 * @param next
 */
function listCart(req, res, next) {
  let params = {};

  if (req.session.cart) {
    let cart = new Cart(req.session.cart);
    params.products = cart.generateArray();
    params.totalPrice = cart.totalPrice;
  }

  res.render('shop/shopping-cart', params);
}

/**
 * Add product to cart
 * @param req
 * @param res
 * @param next
 */
function addProduct(req, res, next) {

}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function reduceProduct(req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
}


export default {
  listCart,
  addProduct,
  reduceProduct
}
