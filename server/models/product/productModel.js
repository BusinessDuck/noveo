import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
import autoIncrement from 'mongoose-auto-increment';


autoIncrement.initialize(mongoose.connection);

/**
 * Product Schema
 */
const options = {
  toJSON: {virtuals: true}
};

const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
/**
 * Remove system fields from object
 * @param options
 * @returns {*|{virtuals}|{years, months, date, hours, minutes, seconds, milliseconds}|MomentObjectOutput|Array|Object}
 */
ProductSchema.methods.toJSON = function (options) {
  var document = this.toObject(options);
  delete(document._id);
  delete(document.__v);
  return document;
};


ProductSchema.plugin(autoIncrement.plugin, {model: 'Product', field: 'id', startAt: 1});

/**
 * Methods
 */
ProductSchema.method({});

/**
 * Statics
 */
ProductSchema.statics = {
  /**
   * Get product
   * @param {ObjectId} id - The objectId of product
   * @returns {Promise<Product, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((product) => {
        if (product) {
          return product;
        }
        const err = new APIError('No such product exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List products in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of products to be skipped.
   * @param {number} limit - Limit number of products to be returned.
   * @returns {Promise<Product[]>}
   */
  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .exec();
  }
};


/**
 * @typedef Product
 */
export default mongoose.model('Product', ProductSchema);

