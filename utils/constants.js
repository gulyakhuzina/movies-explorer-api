const OK = 201;
const ERROR_BAD_REQUEST = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const ERROR_NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const ERROR_SERVER = 500;

const CONFLICT_ERROR_MESSAGE = 'Такой email уже существует';
const FORBIDDEN_ERROR_MESSAGE = 'Доступ запрещен';
const AUTHORIZED_ERROR_MESSAGE = 'Ошибка авторизации';
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация';
const COOKIES_DELETED = 'Cookies удалены';
const ERROR_BAD_REQUEST_MESSAGE = 'Переданы некорректные данные: ';
const ERROR_SERVER_MESSAGE = 'Что-то пошло не так: ';
const ERROR_NOT_FOUND_MESSAGE = 'Запрашиваемые данные не найдены';
const PAGE_NOT_FOUND_MESSAGE = 'Страница не найдена';
const INVALID_LINK_MESSAGE = 'Введена некоректная ссылка';
const INVALID_EMAIL_MESSAGE = 'Введен некоректный адрес электронной почты';
const WRONG_DATA_MESSAGE = 'Неправильные почта или пароль';
const CRASH_TEST_MESSAGE = 'Сервер сейчас упадёт';

module.exports = {
  OK,
  ERROR_BAD_REQUEST,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  ERROR_NOT_FOUND,
  CONFLICT_ERROR,
  ERROR_SERVER,
  CONFLICT_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  AUTHORIZED_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  COOKIES_DELETED,
  ERROR_BAD_REQUEST_MESSAGE,
  ERROR_SERVER_MESSAGE,
  ERROR_NOT_FOUND_MESSAGE,
  INVALID_LINK_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  WRONG_DATA_MESSAGE,
  PAGE_NOT_FOUND_MESSAGE,
  CRASH_TEST_MESSAGE,
};