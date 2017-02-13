import Product from '../models/product/productModel';

/**
 * Load product and append to req.
 */
function load(req, res, next, id) {
  Product.get(id)
    .then((product) => {
      req.product = product; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get product
 * @returns {Product}
 */
function get(req, res) {
  return res.json(req.product);
}

/**
 * Create new product
 * @property {number} req.body.sum - cost of product
 * @property {number} req.body.quantity - quantity of product in store
 * @property {string} req.body.title - name of product
 * @returns {Product}
 */
function create(req, res, next) {
  const product = new Product({
    price: req.body.price,
    quantity: req.body.quantity,
    title: req.body.title,
    description: req.body.description
  });

  product.save()
    .then(savedProduct => res.json(savedProduct))
    .catch(e => next(e));
}

/**
 * Update existing product
 * @property {number} req.body.sum - cost of product
 * @property {number} req.body.quantity - quantity of product in store
 * @property {string} req.body.title - name of product
 * @returns {Product}
 */
function update(req, res, next) {
  const product = req.product;
  product.sum = req.body.sum;
  product.quantity = req.body.quantity;
  product.title = req.body.title;

  product.save()
    .then(savedProduct => res.json(savedProduct))
    .catch(e => next(e));
}

/**
 * Get product list.
 * @property {number} req.query.skip - Number of products to be skipped.
 * @property {number} req.query.limit - Limit number of products to be returned.
 * @returns {Product[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Product.list({ limit, skip })
    .then(products => res.json(products))
    .catch(e => next(e));
}

/**
 * Delete product.
 * @returns {Product}
 */
function remove(req, res, next) {
  const product = req.product;
  product.remove()
    .then(deletedProduct => res.json(deletedProduct))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
