const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const personsRouter = require('./controllers/persons');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

const morgan = require('morgan');
morgan.token('req-body', (req, _res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :req-body'));

mongoose.set('strictQuery', false);
logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB');
	})
	.catch(error => {
		logger.error('error connecting to MongoDB:', error.message);
	});

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(middleware.requestLogger);

app.use('', personsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
