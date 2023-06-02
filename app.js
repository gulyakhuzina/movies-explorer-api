const express = require('express');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const cookieParser = require('cookie-parser');

const { NODE_ENV, PORT = 3000, MONGO_DB } = process.env;
const { celebrate, Joi, errors } = require('celebrate');
const { userRoute, movieRoute } = require('./routes/index');
const {
  createUser, login, deleteCookie,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
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

app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
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

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);