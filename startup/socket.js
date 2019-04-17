const socketIO = require('socket.io');
const CallOrdersController = require('../controllers/callsController');

let io = null;

const GET_CALLS_LIST = 'get_calls_list';
const CALLS_LIST = 'calls_list';
const NEW_CALL_ORDER = 'new_call_order';
const SERVING_CALL_ORDER = 'serving_call_order';

function initSocket(server) {
  if (!server) throw new Error("No servier provided for initializing Socket.io.");
  if (io) return;

  io = socketIO(server);

  io.on('connection', async (socket) => {

    const connectionID = socket.id;

    // inform other admins that one admin took an order to serve
    socket.on(SERVING_CALL_ORDER, async (callOrderId) => {
      socket.broadcast.emit(SERVING_CALL_ORDER, callOrderId);
      await CallOrdersController.delete(callOrderId)
    });

    socket.on(GET_CALLS_LIST, async (socket) => {
      const orders = await CallOrdersController.getAll();
      io.to(`${connectionID}`).emit(CALLS_LIST, orders);
    });

    // socket.emit(CALLS_LIST, await CallOrdersController.getAll());
  });
}

function newCallOrder(call) {
  if (!call) return false;
  // save call to db with rest api
  io.emit(NEW_CALL_ORDER, call);
  return true;
}

module.exports.initSocket = initSocket;
module.exports.newCallOrder = newCallOrder;

module.exports.getSocketIo = function getSocketIo() {
  return io ? io : null;
}
