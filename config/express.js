import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import expressSession from 'express-session';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../server/routes/index';
import config from './env';
import APIError from '../server/helpers/APIError';
import errorTypes from '../server/constants/ErrorTypes';
import mongooseHelper from '../server/helpers/Mongoose';
import responseHelper from '../server/helpers/responseHelper';

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}
mongooseHelper.connect(config);
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.enable('trust proxy');

//enable session
app.use(expressSession({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//wrap to the data object
const original = express.response.json;
express.response.json = function(obj) {
  original.call(this, responseHelper.wrap(obj));
};

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// mount all routes on /api path
app.use('/api/v1/', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  let apiError;

  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const params = err.errors.map(error => {
      //let message = error.mes
      return {
        code: error.types.join('.'),
        message: error.messages.join('. '),
        name: error.field
      }
    });
    apiError = new APIError("Invalid data parameters", err.status, errorTypes.INVALID_PARAM_ERROR, params);
  } else if (!(err instanceof APIError)) {
    apiError = new APIError(err.message, err.status);
  }
  return next(apiError);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {

  const apiError = new APIError(
    `Unable to resolve the request "${req.path}"`,
    httpStatus.NOT_FOUND,
    errorTypes.INVALID_REQUEST_ERROR
  );

  return next(apiError);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
  res.status(err.status).json(err.serialize())
);

export default app;
