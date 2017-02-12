import Joi from 'joi';

export default {
  // POST /api/users
  createProduct: {
    param: {
      quantity: Joi.number().min(1).max(10).integer().required()
    }
  },

  // UPDATE /api/users/:userId
  updateProduct: {
    body: {
      quantity: Joi.number().min(1).max(10).integer().required()
    },
    params: {
      id: Joi.number().integer().required()
    }
  },

};
