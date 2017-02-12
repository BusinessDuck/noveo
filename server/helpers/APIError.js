import httpStatus from 'http-status';
import errorTypes from '../constants/ErrorTypes';

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, type) {
    super(message);
    this.message = message;
    this.status = status;
    this.type = type;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {string} type - error type from constants
   * @param {Array} params errors
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, type = errorTypes.BASIC_TYPE, params) {
    super(message, status, type);
    this.params = params;
  }

  /**
   * Default serializer for error instance
   * @returns {{error: object}}
   */
  defaultSerializer = () => {
    let {message, type, status, params} = this;
    return {
      error: {
        message,
        type,
        status,
        params
      }
    }
  };

  /**
   * Serialize object by custom rule
   * @param {function} serializer - function for custom serializing
   * @returns {{error: APIError.serialize}}
   */
  serialize = function (serializer = this.defaultSerializer) {
    return serializer();
  };
}

export default APIError;
