import Cart from '../models/cart/cartModel';
import Product from '../models/product/productModel';

/**
 * List cart items
 * @param req
 * @param res
 * @param next
 */
function listCart(req, res, next) {
  let cart = new Cart(req.session.cart);
  res.json(cart.serialize());
}

/**
 * Add product to cart
 * @param req
 * @param res
 * @param next
 */
function addProduct(req, res, next) {
  let productId = req.body.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Product.findOne({id: productId}, function (err, product) {
    if (err) {
      console.log(err);
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.json(cart.serialize());
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
  let cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  cart.reduceByOne(productId);
  req.session.cart = cart;
}


export default {
  listCart,
  addProduct,
  reduceProduct
}
