"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMidtransNotification = exports.getOrder = exports.getAllOrders = exports.updateOrder = exports.getOrders = exports.createOrder = void 0;
const midtrans_client_1 = __importDefault(require("midtrans-client"));
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../deliveryAddress/model"));
const model_3 = __importDefault(require("../cart/model"));
const model_4 = __importDefault(require("../invoices/model"));
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snap = new midtrans_client_1.default.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
        const payload = Object.assign(Object.assign({}, req.body), { user: req.user._id });
        const cart = yield model_3.default.findOne({ user: req.user._id }).populate('products.product');
        const deliveryAddress = yield model_2.default.findById(payload.deliveryAddress);
        const order = new model_1.default(Object.assign(Object.assign({}, payload), { delivery_address: {
                provinsi: deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.provinsi,
                kabupaten: deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.kabupaten,
                name: deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.name,
                kecamatan: deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.kecamatan,
                kelurahan: deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.kelurahan,
                detail: deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.detail
            } }));
        const orderItems = cart.products.map((item) => {
            return {
                _id: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                name: item.product.name
            };
        });
        order.order_items = orderItems;
        const parameter = {
            transaction_details: {
                order_id: order._id,
                shipping_cost: payload.shipping,
                tax: payload.tax,
                discount: payload.discount,
                gross_amount: payload.total - payload.discount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: req.user.name,
                last_name: '',
                name: req.user.name,
                email: req.user.email,
            },
            item_details: [
                ...orderItems,
                {
                    id: 'shipping_cost',
                    price: payload.shipping,
                    quantity: 1,
                    name: 'Shipping Cost'
                },
                {
                    id: 'tax',
                    price: payload.tax,
                    quantity: 1,
                    name: 'Tax'
                },
                {
                    id: 'discount',
                    price: -payload.discount, // Diskon biasanya negatif
                    quantity: 1,
                    name: 'Discount'
                }
            ],
        };
        return snap.createTransaction(parameter)
            .then((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            yield model_3.default.findOneAndUpdate({
                user: req.user._id,
            }, {
                $set: {
                    products: []
                }
            });
            order.token = transaction.token;
            order.url_redirect = transaction.redirect_url;
            yield order.save();
            // transaction token                
            res.status(200).json({ url: transaction.redirect_url, token: transaction.token, });
        }));
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield model_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== 'admin') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const status_delivery = req.body.status_delivery;
        yield model_1.default.findByIdAndUpdate(req.params.id, { status_delivery }, { runValidators: true });
        res.status(200).json({ message: 'Order updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrder = updateOrder;
const getAllOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role === 'admin') {
            const { skip, limit } = req.query;
            const orders = yield model_1.default.find({ payment_method: { $ne: '', $exists: true } }).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).skip(parseInt(skip));
            const count = yield model_1.default.countDocuments({ payment_method: { $ne: '', $exists: true } });
            const page = count === 0 ? 1 : Math.ceil(count / 12);
            res.status(200).json({ orders, count, page });
            return;
        }
        else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrders = getAllOrders;
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield model_1.default.findById(req.params.id);
        res.status(200).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrder = getOrder;
const handleMidtransNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snap = new midtrans_client_1.default.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
        const notification = req.body;
        const statusResponse = yield snap.transaction.notification(notification);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const invoice = yield model_4.default.findOne({ order: orderId });
        // Lakukan tindakan berdasarkan status transaksi
        if (transactionStatus === 'capture') {
            if (fraudStatus === 'accept') {
                yield model_1.default.findByIdAndUpdate(orderId, {
                    status_payment: 'completed',
                    payment_method: statusResponse.payment_type,
                }, {
                    runValidators: true,
                });
                console.log(invoice);
                if (invoice) {
                    invoice.payment_method = statusResponse.payment_type;
                    invoice.status_payment = 'completed';
                    yield invoice.save();
                }
            }
        }
        else if (transactionStatus === 'settlement') {
            // Transaksi sukses
            yield model_1.default.findByIdAndUpdate(orderId, {
                status_payment: 'completed',
                payment_method: statusResponse.payment_type,
            }, {
                runValidators: true,
            });
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'completed';
                yield invoice.save();
            }
        }
        else if (transactionStatus === 'deny') {
            yield model_1.default.findByIdAndUpdate(orderId, {
                status_payment: 'cancelled',
                payment_method: statusResponse.payment_type,
                status_delivery: 'cancelled',
            }, {
                runValidators: true,
            }); // Transaksi ditolak            
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'cancelled';
                yield invoice.save();
            }
        }
        else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
            // Transaksi dibatalkan
            yield model_1.default.findByIdAndUpdate(orderId, {
                status_payment: 'cancelled',
                payment_method: statusResponse.payment_type,
                status_delivery: 'cancelled',
            }, {
                runValidators: true,
            });
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'cancelled';
                yield invoice.save();
            }
        }
        else if (transactionStatus === 'pending') {
            yield model_1.default.findByIdAndUpdate(orderId, {
                status_payment: 'pending',
                payment_method: statusResponse.payment_type,
            }, {
                runValidators: true
            });
            // Transaksi pending            
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'pending';
                yield invoice.save();
            }
        }
        else {
            invoice.status_payment = 'cancelled';
            invoice.status_delivery = 'cancelled';
            invoice.payment_method = 'cancelled';
            yield invoice.save();
        }
        res.status(200).send('OK');
    }
    catch (error) {
        next(error);
    }
});
exports.handleMidtransNotification = handleMidtransNotification;
