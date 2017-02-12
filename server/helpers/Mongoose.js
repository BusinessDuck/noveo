import mongoose from 'mongoose';
import metaLogger from 'meta-logger';

export default class mongooseHelper {
  /**
   * Connect to mongo DB
   * @param {Object} config
   */
  static connect = (config) => {

    mongoose.connect(config.db);

    // When successfully connected
    mongoose.connection.on('connected', function () {
        metaLogger.info('Mongoose default connection open to ' + config.db);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
      metaLogger.error('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
      metaLogger.info('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        log.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });

  };

  /**
   * Disconnect from mongo DB
   */
  static disconnect = () => {
    mongoose.disconnect();
  }
};
