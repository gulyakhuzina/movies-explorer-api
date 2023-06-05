const express = require('express');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const cookieParser = require('cookie-parser');

const { celebrate, Joi, errors } = require('celebrate');
const { NODE_ENV, PORT, MONGO_DB } = require('./utils/config');
const { userRoute, movieRoute } = require('./routes/index');
const {
  createUser, login, deleteCookie,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PAGE_NOT_FOUND_MESSAGE, CRASH_TEST_MESSAGE } = require('./utils/constants');
const handleErrors = require('./middlewares/handleErrors');
const NotFoundError = require('./errors/not_found_err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'http://localhost:3001',
  'https://films.khuzinagulya.nomoredomains.rocks',
  'https://praktikum.tk',
  'http://praktikum.tk',
];

const corsOptions = {
  origin: allowedCors,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://127.0.0.1:27017/bitfilmsdb', { useNewUrlParser: true });

app.use(helmet());
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(CRASH_TEST_MESSAGE);
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signout', deleteCookie);

app.use(auth);

app.use('/users', auth, userRoute);
app.use('/movies', auth, movieRoute);

app.use('*', (req, res, next) => next(new NotFoundError(PAGE_NOT_FOUND_MESSAGE)));

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(NODE_ENV === 'production' ? PORT : 3000);