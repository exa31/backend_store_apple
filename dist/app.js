"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./app/categories/router"));
const router_2 = __importDefault(require("./app/products/router"));
const router_3 = __importDefault(require("./app/users/router"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./middleware/index");
const cors_1 = __importDefault(require("cors"));
const router_4 = __importDefault(require("./app/cart/router"));
const router_5 = __importDefault(require("./app/likes/router"));
const router_6 = __importDefault(require("./app/order/router"));
const router_7 = __importDefault(require("./app/invoices/router"));
const router_8 = __importDefault(require("./app/deliveryAddress/router"));
var app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use((0, cors_1.default)());
app.use((0, index_1.decodeToken)());
app.use((0, morgan_1.default)('dev'));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '/public')));
// router
app.use('/api', router_1.default);
app.use('/api', router_2.default);
app.use('/api', router_4.default);
app.use('/api', router_5.default);
app.use('/api', router_6.default);
app.use('/api', router_7.default);
app.use('/api', router_8.default);
app.use('/auth', router_3.default);
app.use('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
