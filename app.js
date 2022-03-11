require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { BD_URL } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.disable('x-powered-by');

app.use(cookieParser());
app.use(bodyParser.json());
mongoose.connect(BD_URL);
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use(errorHandler);
app.listen(PORT, () => {

});
