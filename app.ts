import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import type { Request, Response, NextFunction } from 'express';
import routerCategories from './app/categories/router';
import routerProducts from './app/products/router';
import routerUsers from './app/users/router';
import dotenv from 'dotenv';
import { decodeToken } from './middleware/index';
import cors from 'cors'
import { fileURLToPath } from 'url';
import routerCarts from './app/cart/router';
import routerLikes from './app/likes/router';
import routerOrder from './app/order/router';
import routerInvoices from './app/invoices/router';
import routerDeliveryAddresser from './app/deliveryAddress/router';

interface CustomError extends Error {
  status?: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(decodeToken());
app.use(logger('dev'));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/api', routerCategories);
app.use('/api', routerProducts);
app.use('/api', routerCarts);
app.use('/api', routerLikes);
app.use('/api', routerOrder);
app.use('/api', routerInvoices);
app.use('/api', routerDeliveryAddresser);
app.use('/auth', routerUsers);

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Express' });
})


// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: CustomError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;