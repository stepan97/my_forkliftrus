const socketIO = require('socket.io');

let io = null;

const EVENTS_ENUM = {
  CALL_ORDER: 'call_order',
  PRODUCT_ORDER: 'product_order',
  FEEDBACK: 'feedback',
  CALL_VIEWED: 'call_viewed',
  PRODUCT_ORDER_VIEWED: 'product_order_viewed',
  FEEDBACK_VIEWED: 'feedback_viewed',
};

function initSocket(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    io.emit('kayfo', 'new connection');
  });
}

function checkErrors() {
  if (!io) return 'Socket io is not initialized!';
  // if (!data) return { errorMessage: 'No call provided!', code: 'NoData' };
  return null;
}

// emit event to admins
const socketController = {
  initSocket,
  pushCallOrder(call) {
    const err = checkErrors();
    if (err) return err;

    io.emit(EVENTS_ENUM.CALL_ORDER, call);
    return null;
  },

  callHasBeenViewed(id) {
    io.emit(EVENTS_ENUM.CALL_VIEWED, id);
  },

  pushProductOrder(order) {
    const err = checkErrors();
    if (err) return err;

    io.emit(EVENTS_ENUM.PRODUCT_ORDER, order);
    return null;
  },

  productOrderHasBeenViewed(id) {
    io.emit(EVENTS_ENUM.PRODUCT_ORDER_VIEWED, id);
  },

  pushFeedback(feedback) {
    const err = checkErrors();
    if (err) return err;

    io.emit(EVENTS_ENUM.FEEDBACK, feedback);
    return null;
  },

  feedbackHasBeenViewed(id) {
    io.emit(EVENTS_ENUM.FEEDBACK_VIEWED, id);
  },
};

module.exports = socketController;
