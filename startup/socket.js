const socketIO = require('socket.io');
const CallOrdersController = require('../controllers/callsController');
const ProductOrdersController = require('../controllers/productOrdersController');

let io = null;

const GET_CALLS_LIST = 'get_calls_list';
const CALLS_LIST = 'calls_list';
const NEW_CALL_ORDER = 'new_call_order';
const SERVING_CALL_ORDER = 'serving_call_order';

const GET_PRODUCT_ORDERS = 'get_product_orders';
const PRODUCT_ORDERS = 'product_orders';
const NEW_PRODUCT_ORDER = 'new_product_order';
const SERVING_PRODUCT_ORDER = 'serving_product_order';

// TODO: Add auth before connecting to socket.io
function initSocket(server) {
  if (!server) throw new Error("No servier provided for initializing Socket.io.");
  if (io) return;

  io = socketIO(server);

  io.on('connection', async (socket) => {

    const connectionID = socket.id;

    /************************ CALL ORDERS ************************/
    // inform other admins that one admin took an order to serve
    socket.on(SERVING_CALL_ORDER, async (callOrderId) => {
      socket.broadcast.emit(SERVING_CALL_ORDER, callOrderId);
      await CallOrdersController.delete(callOrderId)
    });

    socket.on(GET_CALLS_LIST, async (socket) => {
      const orders = await CallOrdersController.getAll();
      io.to(`${connectionID}`).emit(CALLS_LIST, orders);
    });

    /************************ PRODUCT ORDERS ************************/
    socket.on(SERVING_PRODUCT_ORDER, async (productOrderId) => {
      socket.broadcast.emit(SERVING_PRODUCT_ORDER, productOrderId);
      await ProductOrdersController.delete(productOrderId);
    });

    socket.on(GET_PRODUCT_ORDERS, async (socket) => {
      const orders = await ProductOrdersController.getAll();
      io.to(`${connectionID}`).emit(PRODUCT_ORDERS, orders);
    });
  });
}

function newCallOrder(call) {
  if (!call) return false;
  io.emit(NEW_CALL_ORDER, call);
  return true;
}

function newProductOrder(product) {
  if (!product) return false;

  io.emit(NEW_PRODUCT_ORDER, product);
  return true;
}

module.exports.initSocket = initSocket;
module.exports.getSocketIo = function getSocketIo() {
  return io ? io : null;
}

module.exports.newCallOrder = newCallOrder;
module.exports.newProductOrder = newProductOrder;
