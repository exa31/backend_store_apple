import { Request, Response, NextFunction } from "express";
import middtransClient from 'midtrans-client';
import Orders, { Order, OrderItem } from './model';
import DeliveryAddresses, { DeliveryAddress } from "../deliveryAddress/model";
import Carts, { Cart } from "../cart/model";
import Invoices, { Invoice } from "../invoices/model";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const snap = new middtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
        const payload = { ...req.body, user: req.user.id };
        const cart: Cart | null = await Carts.findOne({ user: req.user.id }).populate('products.product');
        const deliveryAddress: DeliveryAddress | null = await DeliveryAddresses.findById(payload.deliveryAddress);
        const order: Order = new Orders({
            ...payload,
            delivery_address: {
                provinsi: deliveryAddress?.provinsi as string,
                kabupaten: deliveryAddress?.kabupaten as string,
                name: deliveryAddress?.name as string,
                kecamatan: deliveryAddress?.kecamatan as string,
                kelurahan: deliveryAddress?.kelurahan as string,
                detail: deliveryAddress?.detail as string
            }
        });
        const orderItems: OrderItem[] = cart!.products.map((item: any) => {
            return {
                id: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
                name: item.product.name
            }
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
            .then(async (transaction: any) => {
                await Carts.findOneAndUpdate(
                    {
                        user: req.user.id,
                    },
                    {
                        $set: {
                            products: []
                        }
                    },)
                order.token = transaction.token;
                await order.save();
                // transaction token                
                res.status(200).json(transaction.token);
            })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders: Order[] = await Orders.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order: Order | null = await Orders.findById(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const handleMidtransNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const snap = new middtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
        const notification = req.body;

        const statusResponse = await snap.transaction.notification(notification);

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const invoice: Invoice | null = await Invoices.findOne({ order: orderId });
        // Lakukan tindakan berdasarkan status transaksi
        if (transactionStatus === 'capture') {
            if (fraudStatus === 'accept') {
                await Orders.findByIdAndUpdate(orderId, {
                    status_payment: 'completed',
                    payment_method: statusResponse.payment_type,
                }, {
                    runValidators: true,
                });
                console.log(invoice);
                if (invoice) {
                    console.log('p');
                    invoice.payment_method = statusResponse.payment_type;
                    invoice.status_payment = 'completed';
                    await invoice.save();
                }
            }
        } else if (transactionStatus === 'settlement') {
            // Transaksi sukses
            await Orders.findByIdAndUpdate(orderId, {
                status_payment: 'completed',
                payment_method: statusResponse.payment_type,
            }, {
                runValidators: true,
            });
            if (invoice) {
                console.log('p');
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'completed';
                await invoice.save();
            }
        } else if (transactionStatus === 'deny') {
            await Orders.findByIdAndUpdate(orderId, {
                status_payment: 'cancelled',
                payment_method: statusResponse.payment_type,
                status_delivery: 'cancelled',
            }, {
                runValidators: true,
            });// Transaksi ditolak            
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'cancelled';
                await invoice.save();
            }

        } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
            // Transaksi dibatalkan
            await Orders.findByIdAndUpdate(orderId, {
                status_payment: 'cancelled',
                payment_method: statusResponse.payment_type,
                status_delivery: 'cancelled',
            }, {
                runValidators: true,
            });
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'cancelled';
                await invoice.save();
            }
        } else if (transactionStatus === 'pending') {
            if (invoice) {
                invoice.payment_method = statusResponse.payment_type;
                invoice.status_payment = 'pending';
                await invoice.save();
            }
        };
        res.status(200).send('OK');
    } catch (error) {
        next(error);
    }
};